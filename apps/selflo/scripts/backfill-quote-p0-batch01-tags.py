#!/usr/bin/env python3
"""Backfill reviewed content-tags.v1 metadata for P0 quote batch 01."""
import argparse
import json
from pathlib import Path

TAG_MAP = {
    'roof_releases_the_storm_slowly': ['intent:overcome_adversity','support:soothe','support:new_perspective','topic:adversity_recovery','origin:selflo'],
    'new_light_enters_where_branch_broke': ['intent:overcome_adversity','support:new_perspective','topic:adversity_recovery','topic:change_growth','origin:selflo'],
    'every_long_road_is_crossed_one_meter_at_a_time': ['intent:overcome_adversity','support:motivate','support:small_action','topic:adversity_recovery','origin:selflo'],
    'accepting_the_flood_reveals_the_road_still_open': ['intent:overcome_adversity','support:clarify','support:new_perspective','topic:adversity_recovery','origin:selflo'],
    'a_large_task_only_needs_one_first_square': ['intent:overcome_adversity','support:motivate','support:small_action','topic:adversity_recovery','origin:selflo'],
    'tea_waits_beside_the_screen': ['intent:calm','support:new_perspective','topic:attention_presence','origin:selflo'],
    'seed_grows_out_of_sight': ['intent:personal_growth','support:motivate','support:new_perspective','topic:change_growth','origin:selflo'],
    'eraser_shrinks_as_letters_straighten': ['intent:personal_growth','support:new_perspective','topic:change_growth','topic:learning_habits','origin:selflo'],
    'restitching_teaches_the_hand': ['intent:personal_growth','support:clarify','support:new_perspective','topic:change_growth','topic:learning_habits','origin:selflo'],
    'freedom_begins_when_one_path_is_not_the_only_path': ['intent:personal_growth','support:new_perspective','topic:change_growth','origin:selflo'],
    'river_carries_the_upstream_rain': ['intent:understand_self','support:clarify','support:new_perspective','topic:emotions','origin:selflo'],
    'an_old_scent_can_open_an_old_room': ['intent:understand_self','support:clarify','topic:emotions','origin:selflo'],
    'old_chair_holds_more_than_wood': ['intent:meaning','support:new_perspective','topic:meaning_values','origin:selflo'],
    'bus_ticket_keeps_the_day_of_return': ['intent:meaning','support:new_perspective','topic:meaning_values','origin:selflo'],
    'one_umbrella_keeps_two_steps_together': ['intent:relationships','support:soothe','support:new_perspective','topic:relationships','origin:selflo'],
    'familiar_cafe_remembers_the_order': ['intent:relationships','support:new_perspective','topic:relationships','origin:selflo'],
    'someone_calls_at_the_last_stop': ['intent:relationships','support:soothe','topic:relationships','origin:selflo'],
    'safe_return_can_help_us_go_farther': ['intent:relationships','support:soothe','support:new_perspective','topic:relationships','origin:selflo'],
    'hands_keep_the_hammers_echo': ['intent:calm','support:clarify','topic:rest_wellbeing','origin:selflo'],
    'house_turns_off_one_window_at_a_time': ['intent:calm','support:clarify','topic:rest_wellbeing','origin:selflo'],
    'comparison_steals_joy': ['intent:understand_self','support:clarify','support:new_perspective','topic:self_understanding','origin:selflo'],
    'late_flower_meets_another_sky': ['intent:understand_self','intent:personal_growth','support:soothe','support:new_perspective','topic:self_understanding','origin:selflo'],
    'first_burnt_batch_does_not_erase_the_kitchen': ['intent:understand_self','support:soothe','support:new_perspective','topic:self_understanding','origin:selflo'],
    'another_persons_measure_cannot_fit_your_life': ['intent:understand_self','support:clarify','support:new_perspective','topic:self_understanding','origin:selflo'],
    'musician_stays_with_one_lost_note': ['intent:work_direction','intent:personal_growth','support:motivate','support:small_action','topic:work_choices','topic:learning_habits','origin:selflo'],
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    quote_root = args.root / 'perspective-library/source/vi/quotes'
    found = {}
    changed = []
    for path in sorted(quote_root.glob('*/*.json')):
        doc = json.loads(path.read_text())
        dirty = False
        for quote in doc.get('quotes', []):
            ident = quote.get('id')
            if ident not in TAG_MAP:
                continue
            if ident in found:
                raise SystemExit('Duplicate quote ID: ' + ident)
            found[ident] = str(path)
            if quote.get('rights', {}).get('status') != 'selflo_owned':
                raise SystemExit('Unexpected rights for ' + ident)
            existing = quote.get('tags')
            if existing not in (None, [], TAG_MAP[ident]):
                raise SystemExit('Refusing to overwrite existing tags for ' + ident)
            if existing != TAG_MAP[ident]:
                quote['tags'] = TAG_MAP[ident]
                dirty = True
        if dirty:
            changed.append(path)
            if args.apply:
                path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n')
    missing = sorted(set(TAG_MAP) - set(found))
    if missing:
        raise SystemExit('Missing quote IDs: ' + ', '.join(missing))
    print(json.dumps({'mode':'apply' if args.apply else 'dry_run','quote_count':len(found),'changed_files':[str(p.relative_to(args.root)) for p in changed]}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
