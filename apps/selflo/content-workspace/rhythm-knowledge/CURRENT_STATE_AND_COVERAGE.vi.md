# Rhythm Knowledge — current state, architecture và coverage

**Trạng thái:** Authoring design candidate — chưa phải contract, chưa Release  
**Ngày:** 2026-10-12  
**Phạm vi:** 33 golden scenarios của Rhythm Reading V2

## 1. Kết luận audit

- Canonical content source hiện nằm tại `perspective-library/source/vi/`; Authoring và Release là generated output, không sửa tay.
- Proposal `selflo.rhythm-knowledge.v1` hiện vẫn là draft, chưa phải active contract.
- Knowledge Catalog hiện có 19 concept, 26 theory, 12 framework và 18 reference.
- Hai analysis companion hiện có phục vụ editorial review của Story, không phải Knowledge article cho Rhythm.
- Nội dung có thể reuse mạnh nhất: `psychological_detachment`, `repetitive_negative_thinking`, `affect_labeling`, `emotional_awareness`, `psychological_flexibility_values`.
- `cognitive_behavioral_interpretation` và `broaden_and_build` đúng hướng nhưng vẫn `draft + pending_source_review`.
- Story/Perspective hiện có có thể làm minh họa hoặc related content. Chúng không thay thế article vì không có đủ claim–source–limit, mechanism, misconception và practice.
- Reader V3 có đủ block `flow`, `sequence`, `figure`, `aside`, `source_note` để thử article dưới dạng editorial payload; nhưng stable Knowledge article identity và mapping semantics vẫn cần contract được chấp nhận trước production.

## 2. Quyết định kiến trúc

Giữ chín root article. Chín bài có learning job khác nhau và together phủ 33/33 scenario mà không ép một bài giải thích mọi hiện tượng.

| ID làm việc | Câu hỏi gốc | Loại bài | Reuse chính |
|---|---|---|---|
| `knowledge.rhythm.k1.reading_patterns` | Bao nhiêu lần thì được gọi là một pattern? | data literacy | mới |
| `knowledge.rhythm.k2.event_interpretation_emotion_action` | Vì sao cùng một sự việc có thể dẫn tới cảm xúc và phản ứng khác nhau? | mechanism | CBT/appraisal draft + story minh họa |
| `knowledge.rhythm.k3.supportive_conditions` | Vì sao một hoàn cảnh có thể đi cùng cảm giác tập trung, bình yên hoặc vui? | mechanism + observation | broaden-and-build draft, self-determination |
| `knowledge.rhythm.k4.emotion_and_context` | Vì sao cảm xúc có thể khác nhau theo hoàn cảnh? | mechanism | emotional awareness, affect labeling |
| `knowledge.rhythm.k5.change_over_time` | Một thay đổi trong vài lần ghi nhận có phải là xu hướng không? | data literacy | mới, emotion dynamics |
| `knowledge.rhythm.k6.recovery_and_detachment` | Điều gì có thể giúp một trạng thái dịu lại sau công việc? | mechanism + limits | psychological detachment |
| `knowledge.rhythm.k7.repetitive_thinking_attention` | Vì sao một mối lo có thể quay lại và giữ sự chú ý? | mechanism | repetitive negative thinking |
| `knowledge.rhythm.k8.mixed_signals` | Vì sao nhiều cảm xúc hoặc tín hiệu trái chiều có thể cùng tồn tại? | mechanism + observation | emotional awareness |
| `knowledge.rhythm.k9.sampled_days` | Những ngày đã check-in đại diện được bao nhiêu cho cả tuần hoặc tháng? | data literacy | mới, EMA methodology |

## 3. Coverage matrix 33/33

`Primary` là bài mở mặc định. `Related` chỉ hiện khi contract/UI sau này hỗ trợ và bài đó thực sự bổ sung một câu hỏi khác.

| Case | Engine result | Primary | Related | Coverage |
|---:|---|---|---|---|
| 01 | check-in đầu tiên | K1 | K9 | new |
| 02 | hai điểm đầu tiên khác nhau | K1 | K4 | new |
| 03 | lặp trong cùng một ngày | K9 | K1 | new |
| 04 | nhiều cảm xúc, chưa có pattern | K4 | K1 | revise/new |
| 05 | các lần giống nhau cách xa | K9 | K1 | new |
| 06 | Work + Anxiety hai ngày | K2 | K7 | new from draft |
| 07 | Work + Anxiety bốn ngày | K2 | K7 | new from draft/reuse |
| 08 | Learning + Focus lặp lại | K3 | K1 | new from draft |
| 09 | Relationships + Joy lặp lại | K3 | K4 | new from draft |
| 10 | Health + Tired kéo dài | K4 | K1 | new; medical boundary |
| 11 | Thoughts + Neutral ổn định | K2 | K3 | new from draft |
| 12 | Work khó, private time nhẹ | K4 | K6 | revise/reuse |
| 13 | cùng topic có vui và buồn | K8 | K4 | new |
| 14 | nhiều cảm xúc dễ chịu | K3 | K4 | new from draft |
| 15 | nhiều cảm xúc khó ở nhiều context | K4 | K1 | new |
| 16 | dịu lại qua năm ngày | K5 | K6 | new/reuse |
| 17 | chùng xuống qua năm ngày | K5 | K4 | new |
| 18 | dao động, không có hướng | K8 | K5 | new |
| 19 | nhịp khá đều | K3 | K5 | new |
| 20 | một ngày khác biệt | K5 | K4 | new |
| 21 | hai sequence hồi phục | K6 | K4 | reuse/expand |
| 22 | một sequence hồi phục | K6 | K1 | reuse/expand |
| 23 | headspace và emotion khác hướng | K8 | K4 | new |
| 24 | Finance + Anxiety lặp lại | K2 | K7 | new; structural boundary |
| 25 | sadness kéo dài, thiếu topic | K7 | K1 | reuse/expand |
| 26 | buồn → vui, hai lần | K5 | K1 | new |
| 27 | vui → buồn, hai lần | K5 | K1 | new |
| 28 | ba lần giống nhau, không liền ngày | K9 | K7 | new/reuse |
| 29 | ba ngày lịch liên tiếp | K1 | K7 | new/reuse |
| 30 | một ngày có cảm xúc đối lập | K8 | K4 | new |
| 31 | bảy ngày gần đây khác baseline | K5 | K9 | new |
| 32 | 30 ngày nhưng quá thưa | K9 | K1 | new |
| 33 | headspace corroborates anxiety | K2 | K7 | new/reuse |

## 4. Mapping semantics đề xuất

Production resolver chỉ nhận typed facts/signals. Không nhận raw note, không branch theo case ID.

```text
article_id
eligible_signal_ids
required_fact_predicates
supporting_fact_predicates
contradicting_predicates
minimum_confidence
topic_emotion_constraints optional
entry_reason_template_id
forbidden_claim_ids
readiness
```

### Quy tắc chọn

1. `insufficientData` → K1; nếu vấn đề chính là mật độ/cửa sổ hoặc same-day, ưu tiên K9.
2. `repeatedContextEmotion` → K2; thêm K7 khi difficult emotion lặp lại và wording không gắn nhãn rumination cho user.
3. `positiveAnchor` → K3.
4. `contextContrast` hoặc `emotionalVariety` theo context → K4; mixed/opposing fields → K8.
5. `directionalShift`, transition, outlier hoặc recent-vs-baseline → K5.
6. `recoverySignal` → K6.
7. `emotionalPersistence` không có đủ context → K7; nếu health/medical context thì primary K4 với boundary cơ thể/sức khỏe.
8. Sparse/missing/non-calendar observations → K9.

### Forbidden mappings

- Không suy ra cognitive distortion, catastrophizing, avoidance hoặc nguyên nhân.
- Không biến `difficult → settled` thành “đã hồi phục”.
- Không biến hai điểm thành trend.
- Không coi ngày không check-in là neutral hoặc không có cảm xúc.
- Không coi headspace là ground truth cao hơn emotion.
- Không gắn K2 vì topic là Work nếu signal không liên quan interpretation/context.

## 5. Reuse audit

| Asset | Quyết định | Cách dùng |
|---|---|---|
| `theory.psychological_detachment` | reuse + expand | nền K6; giữ limitation về job demands/resources |
| `theory.repetitive_negative_thinking` | reuse + expand | nền K7; không gắn nhãn user |
| `theory.affect_labeling` | reuse supporting | hỗ trợ K4/K8; không hứa gọi tên sẽ làm emotion giảm |
| `concept.emotional_awareness` | reuse supporting | vocabulary cho K4/K8 |
| `theory.psychological_flexibility_values` | reuse supporting | K2 practice/decentering; không biến thành ACT treatment |
| `theory.cognitive_behavioral_interpretation` | revise after source review | nền K2; bổ sung references và reciprocal/context limits |
| `theory.broaden_and_build` | revise after source review | một phần K3; không dùng làm giải thích duy nhất |
| `story.one_event_two_perspectives` | related/example only | minh họa nhiều cách nhìn, không phải scientific evidence |
| `story.half_glass_two_views` | related only | illustration; tránh thông điệp positive-thinking |
| `story.shoes_that_went_to_work_twice` | related after owner review | minh họa K7/K6; hiện draft và rights unverified |
| two existing analyses | research/editorial pattern only | không map trực tiếp vào Rhythm |

## 6. Backlog và thứ tự authoring

1. K1 + K9: khóa data/epistemic literacy chung cho mọi reading.
2. K2: pilot Work + Anxiety.
3. K4 + K8: context và mixed states.
4. K5: change over time.
5. K6 + K7: tận dụng theory đã source-checked.
6. K3: positive/supportive patterns sau khi bound broaden-and-build.

## 7. Definition of Done content

- 33/33 scenario có primary article.
- Chín article có research pack, claim matrix, outline, full Vietnamese draft, visual spec, alt text và rubric.
- Mapping fixture không dùng case ID ở production semantics.
- Article candidates giữ `draft + needs_owner_review`; không tự Release.
- Contract proposal phải được chấp nhận và app-compatible trước khi canonical payload dùng mapping mới.
- Owner nghiệm thu cuối trên Authoring Preview; promotion Release là thao tác riêng sau quyết định đó.

