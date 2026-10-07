#!/usr/bin/env python3
"""Semantic validator for Selflo Story Reader V3 fixtures and packages."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


CORE_CAPABILITY = "story_reader.editorial_v3.core"
EXTENDED_TEXT_CAPABILITY = "story_reader.editorial_v3.extended_text"
FIGURE_CAPABILITY = "story_reader.editorial_v3.figure"
KNOWN_MARKS = {"strong", "emphasis", "accent"}
KNOWN_DELIVERIES = {"spoken", "thought", "remembered", "written"}
KNOWN_QUOTE_PRESENTATIONS = {"centerpiece", "inset", "rail"}
EXTENDED_TEXT_BLOCKS = {"sequence", "flow", "list", "verse", "aside", "source_note"}


@dataclass(frozen=True)
class Finding:
    code: str
    path: str
    message: str
    severity: str = "error"


def _words(text: str) -> int:
    return len(re.findall(r"\S+", text.strip()))


def _scalars(text: str) -> int:
    return len(text)


def _wrapped_in_quotes(text: str) -> bool:
    stripped = text.strip()
    return len(stripped) >= 2 and (
        (stripped.startswith("“") and stripped.endswith("”"))
        or (stripped.startswith('"') and stripped.endswith('"'))
    )


def _rich_text_nodes(story: dict[str, Any]) -> Iterable[tuple[str, dict[str, Any]]]:
    for section_index, section in enumerate(story.get("sections", [])):
        for block_index, block in enumerate(section.get("blocks", [])):
            base = f"/sections/{section_index}/blocks/{block_index}"
            if "text_vi" in block:
                yield base, block
            if block.get("type") == "dialogue":
                for turn_index, turn in enumerate(block.get("turns", [])):
                    for paragraph_index, paragraph in enumerate(turn.get("paragraphs", [])):
                        yield f"{base}/turns/{turn_index}/paragraphs/{paragraph_index}", paragraph
            for field in ("items", "lines"):
                for item_index, item in enumerate(block.get(field, [])):
                    yield f"{base}/{field}/{item_index}", item
    takeaway = story.get("takeaway")
    if isinstance(takeaway, dict):
        yield "/takeaway", takeaway


def required_capabilities(story: dict[str, Any]) -> set[str]:
    if story.get("reader_format") != "editorial_v3":
        return set()
    capabilities = {CORE_CAPABILITY}
    block_types = {
        block.get("type")
        for section in story.get("sections", [])
        for block in section.get("blocks", [])
    }
    if block_types & EXTENDED_TEXT_BLOCKS:
        capabilities.add(EXTENDED_TEXT_CAPABILITY)
    if "figure" in block_types:
        capabilities.add(FIGURE_CAPABILITY)
    return capabilities


def validate_story(story: dict[str, Any]) -> list[Finding]:
    findings: list[Finding] = []
    if story.get("reader_format") != "editorial_v3":
        return findings

    for path, node in _rich_text_nodes(story):
        runs = node.get("runs")
        if not isinstance(runs, list):
            continue
        if "".join(str(run.get("text_vi", "")) for run in runs) != node.get("text_vi"):
            findings.append(Finding("runs_text_mismatch", f"{path}/runs", "Nối runs phải bằng chính xác text_vi."))
        for run_index, run in enumerate(runs):
            marks = run.get("marks", [])
            unknown = set(marks) - KNOWN_MARKS if isinstance(marks, list) else {str(marks)}
            if unknown:
                findings.append(Finding("unknown_rich_text_mark", f"{path}/runs/{run_index}/marks", f"Mark không hỗ trợ: {sorted(unknown)}"))
            if isinstance(marks, list) and len(marks) != len(set(marks)):
                findings.append(Finding("duplicate_rich_text_mark", f"{path}/runs/{run_index}/marks", "Marks trong một run phải duy nhất."))

    all_block_ids: list[str] = []
    part_numbers: list[int] = []
    statement_count = 0
    for section_index, section in enumerate(story.get("sections", [])):
        blocks = section.get("blocks", [])
        if section.get("marker_vi") and not section.get("title_vi"):
            findings.append(Finding("marker_requires_title", f"/sections/{section_index}/title_vi", "Section có marker phải có title."))
        section_statement_count = 0
        consecutive_beats = 0
        for block_index, block in enumerate(blocks):
            path = f"/sections/{section_index}/blocks/{block_index}"
            block_type = block.get("type")
            all_block_ids.append(str(block.get("id", "")))
            if block_type == "flow":
                findings.append(Finding(
                    "deprecated_flow_block",
                    path,
                    "flow đã deprecated và không được Release mới; dùng sequence hoặc list.",
                ))
            if block_type == "part_heading":
                part_numbers.append(block.get("part_number"))
            if block_type == "paragraph":
                if block.get("style") == "lead_in" and block_index == len(blocks) - 1:
                    findings.append(Finding("lead_in_at_section_end", path, "lead_in không được đứng cuối section."))
                if block.get("style") == "beat":
                    consecutive_beats += 1
                    if consecutive_beats > 2:
                        findings.append(Finding("too_many_consecutive_beats", path, "Không dùng quá hai beat liên tiếp.", "warning"))
                else:
                    consecutive_beats = 0
            else:
                consecutive_beats = 0
            if block_type == "dialogue":
                turns = block.get("turns", [])
                if not turns:
                    findings.append(Finding("dialogue_without_turn", f"{path}/turns", "Dialogue phải có ít nhất một turn."))
                turn_ids = [turn.get("id") for turn in turns]
                if len(turn_ids) != len(set(turn_ids)):
                    findings.append(Finding("duplicate_turn_id", f"{path}/turns", "Turn ID phải duy nhất trong dialogue."))
                identities: set[tuple[str | None, str | None]] = set()
                speakers: set[str] = set()
                for turn_index, turn in enumerate(turns):
                    turn_path = f"{path}/turns/{turn_index}"
                    paragraphs = turn.get("paragraphs", [])
                    if not paragraphs:
                        findings.append(Finding("turn_without_paragraph", f"{turn_path}/paragraphs", "Turn phải có ít nhất một paragraph."))
                    delivery = turn.get("delivery")
                    if delivery not in KNOWN_DELIVERIES:
                        findings.append(Finding("invalid_dialogue_delivery", f"{turn_path}/delivery", "Delivery không được hỗ trợ."))
                    speaker = turn.get("speaker")
                    if speaker is not None and (
                        not isinstance(speaker, dict)
                        or not str(speaker.get("id", "")).strip()
                        or not str(speaker.get("label_vi", "")).strip()
                    ):
                        findings.append(Finding("invalid_dialogue_speaker", f"{turn_path}/speaker", "Speaker cần stable id và label_vi khác rỗng."))
                    speaker_id = speaker.get("id") if isinstance(speaker, dict) else None
                    identities.add((speaker_id, delivery))
                    if speaker_id:
                        speakers.add(speaker_id)
                if block.get("style") == "exchange" and (len(turns) < 2 or len(identities) < 2):
                    findings.append(Finding("exchange_requires_distinct_turns", path, "Exchange cần ít nhất hai turn hoặc speaker/delivery distinct."))
                if block.get("style") == "inner_monologue" and len(speakers) > 1:
                    findings.append(Finding("inner_monologue_multiple_speakers", path, "Inner monologue không được có nhiều speaker."))
            if block_type == "statement":
                statement_count += 1
                section_statement_count += 1
                if "attribution_vi" in block:
                    findings.append(Finding("statement_has_attribution", f"{path}/attribution_vi", "Statement không có attribution."))
                text = str(block.get("text_vi", ""))
                if _wrapped_in_quotes(text):
                    findings.append(Finding("statement_quote_wrapper", f"{path}/text_vi", "Statement không bọc toàn câu bằng ngoặc kép."))
                if block.get("presentation") == "centered":
                    if _words(text) > 24 or _scalars(text) > 140:
                        findings.append(Finding("centered_statement_too_long", f"{path}/text_vi", "Centered statement vượt 24 từ hoặc 140 Unicode scalar."))
                    elif _words(text) > 19 or _scalars(text) > 112:
                        findings.append(Finding("centered_statement_near_limit", f"{path}/text_vi", "Centered statement đã vượt 80% length gate.", "warning"))
            if block_type == "pull_quote":
                presentation = block.get("presentation")
                if presentation not in KNOWN_QUOTE_PRESENTATIONS:
                    findings.append(Finding("invalid_quote_presentation", f"{path}/presentation", "Quote presentation không được hỗ trợ."))
                text = str(block.get("text_vi", ""))
                if presentation == "centerpiece":
                    if _words(text) > 32 or _scalars(text) > 180:
                        findings.append(Finding("centerpiece_quote_too_long", f"{path}/text_vi", "Centerpiece quote vượt 32 từ hoặc 180 Unicode scalar."))
                    elif _words(text) > 25 or _scalars(text) > 144:
                        findings.append(Finding("centerpiece_quote_near_limit", f"{path}/text_vi", "Centerpiece quote đã vượt 80% length gate.", "warning"))
            if block_type == "divider":
                if block_index in (0, len(blocks) - 1):
                    findings.append(Finding("divider_at_boundary", path, "Divider không đứng đầu hoặc cuối section."))
                if block_index and blocks[block_index - 1].get("type") == "divider":
                    findings.append(Finding("adjacent_dividers", path, "Không đặt hai divider liên tiếp."))
            if block_index and block_type == "pull_quote" and blocks[block_index - 1].get("type") == "pull_quote":
                if block.get("presentation") == "centerpiece" and blocks[block_index - 1].get("presentation") == "centerpiece":
                    findings.append(Finding("adjacent_centerpiece_quotes", path, "Không đặt hai centerpiece quote liên tiếp."))
        if section_statement_count > 2:
            findings.append(Finding("too_many_statements_in_section", f"/sections/{section_index}", "Section có hơn hai statement.", "warning"))

    if len(all_block_ids) != len(set(all_block_ids)):
        findings.append(Finding("duplicate_block_id", "/sections", "Block ID phải duy nhất trong story."))
    if part_numbers and part_numbers != list(range(1, len(part_numbers) + 1)):
        findings.append(Finding("non_contiguous_part_numbers", "/sections", "Part number phải liên tục theo document order."))
    if statement_count > 8:
        findings.append(Finding("too_many_statements_in_story", "/sections", "Story có hơn tám statement.", "warning"))
    return findings


def validate_package(stories: Iterable[dict[str, Any]], declared_capabilities: Iterable[str]) -> list[Finding]:
    declared = set(declared_capabilities)
    required = set().union(*(required_capabilities(story) for story in stories))
    return [
        Finding("missing_required_capability", "/required_capabilities", f"Thiếu capability: {capability}")
        for capability in sorted(required - declared)
    ]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("story", type=Path)
    parser.add_argument("--capability", action="append", default=[])
    args = parser.parse_args()
    story = json.loads(args.story.read_text(encoding="utf-8"))
    findings = validate_story(story) + validate_package([story], args.capability)
    print(json.dumps([finding.__dict__ for finding in findings], ensure_ascii=False, indent=2))
    return 1 if any(finding.severity == "error" for finding in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
