extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("Kha", 3)
    var loadout = game.loadout
    loadout.open(0)
    if not ensure(loadout.panel.visible and paused, "armory pauses battle"): return
    loadout._select_weapon(2)
    if not ensure(loadout.weapon == 0, "inspecting a weapon does not equip it"): return
    loadout._equip()
    if not ensure(loadout.weapon == 2, "chosen story weapon equips"): return
    loadout.show_page(1)
    loadout._select_art(1)
    loadout._pin_art()
    if not ensure(loadout.favorite == 1, "rune selects quick cast"): return
    loadout._map()
    if not ensure(game.atlas.overlay.visible and paused, "map replaces armory without resuming battle"): return
    game.atlas._open_menu(2)
    if not ensure(loadout.panel.visible and loadout.page == 2 and paused, "journal opens from atlas"): return
    loadout.close()
    game.arts.cast(loadout.quick_art())
    if not ensure(not paused and is_equal_approx(game.arts.cooldowns[1], 2.4), "equipped rune receives its true cooldown discount"): return

    game.time_mode = true
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    var timeline = game.sky.timeline
    loadout.open(0)
    loadout._select_weapon(1)
    loadout._equip()
    if not ensure(timeline.equipped == 0, "armory cannot equip an unowned era weapon"): return
    timeline.owned[1] = true
    loadout._equip()
    if not ensure(timeline.equipped == 1 and loadout.weapon == 2, "era technique equips independently from story weapon"): return
    game.trials.return_menu()
    if not ensure(not paused and game.menu.visible and not loadout.panel.visible, "returning to selector clears the pause screen"): return
    print("ECLIPSE ARMORY PASS")
    quit()
