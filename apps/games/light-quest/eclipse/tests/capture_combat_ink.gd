extends "res://tests/smoke.gd"
## Staged positions. Input, collisions, HP, particles and pixels use the production scene.
func _run() -> void:
    root.size = Vector2i(960,540)
    await _fixture("An")
    game.story_mode = true
    game.trials.update_hud()
    game.hero.position = Vector2(550,432)
    game.facing = 1
    game.i_frames = 0
    game._snap_view()
    await _frames(4)
    game._signature()
    await _frames(4)
    await _photo("01-nguyet-tram")
    var foe: Node2D = game.enemies[1]
    game.hero.position = Vector2(751,432)
    foe.position = Vector2(815,425)
    game._snap_view()
    await _frames(30)
    game.facing = 1
    var before: int = foe.hp
    game._request_attack()
    await _frames(9)
    if not ensure(foe.hp > 0 and foe.hp < before, "nonlethal blade collision"): return
    await _photo("02-trung-chieu")
    foe.hp = 1
    await _frames(17)
    game._request_attack()
    await _frames(13)
    if not ensure(foe.state == "dead", "lethal blade dissolves the target"): return
    await _frames(5)
    await _photo("03-tan-anh")
    await _fixture("Kha")
    game.story_mode = true
    game.trials.update_hud()
    game.hero.position = Vector2(550,432)
    game._snap_view()
    await _frames(6)
    game.touch.jump = true
    await _frames(7)
    if not ensure(not game.hero.is_on_floor() and game.hero.velocity.y < 0, "jump rendered airborne"): return
    await _photo("04-buoc-gio")
    print("ECLIPSE COMBAT INK CAPTURE PASS")
    quit()

func _photo(label: String) -> void:
    await RenderingServer.frame_post_draw
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    var shot := root.get_texture().get_image()
    assert(shot.save_png(folder.path_join("v18-" + label + ".png")) == OK)
