extends SceneTree
## Staged combat captures from the production Compatibility renderer.
func _initialize() -> void: call_deferred("_capture")
func _capture() -> void:
    root.size = Vector2i(960, 540)
    for chapter in range(3):
        var game = load("res://scenes/main.tscn").instantiate()
        game.save_enabled = false
        root.add_child(game)
        game.demo_room_select.select(chapter)
        game._start("Kha" if chapter == 2 else "An")
        game._interact()
        var boss = game.trials.boss
        game.hero.position = Vector2(chapter * 1920 + 1470, 432)
        game.cam.reset_smoothing()
        game.cam.force_update_scroll()
        game.scenery.update_camera(game.cam.get_screen_center_position().x, false, true)
        boss.awake = true
        boss._choose_attack(game, game.hero.position - boss.position)
        game.trials.update_hud()
        game.set_physics_process(false)
        await _save("actual-chapter-%d-boss.png" % (chapter + 1))
        boss.phase_two = true
        boss.hp = boss.max_hp / 2
        boss.move_name = "volley" if chapter > 0 else "cleave"
        boss.ranged_action = chapter > 0
        boss._set_state("tell", 0.7)
        game.trials.update_hud()
        await _save("actual-chapter-%d-phase-two.png" % (chapter + 1))
        game.queue_free()
        await process_frame
    for chapter in range(3):
        var game = load("res://scenes/main.tscn").instantiate()
        game.save_enabled = false
        root.add_child(game)
        game.demo_room_select.select(chapter)
        game._start("Kha" if chapter == 2 else "An")
        game._interact()
        game.trials.routes.air_step_unlocked = true
        game.hero.position = Vector2(chapter * 1920 + 985, 130)
        game.cam.reset_smoothing()
        game.cam.force_update_scroll()
        game.scenery.update_camera(game.cam.get_screen_center_position().x, false, true)
        game.trials.routes.tick(0.016)
        game.trials.update_hud()
        game.set_physics_process(false)
        await _save("actual-new-route-%d.png" % (chapter + 1))
        game._signature()
        await _save("actual-signature-%d.png" % (chapter + 1))
        game.queue_free()
        await process_frame
    print("ECLIPSE CAPTURE PASS: production-renderer chapter, boss, route and signature frames")
    quit(0)
func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var image := root.get_texture().get_image()
    assert(image != null and not image.is_empty(), "Godot rendered pixels")
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    assert(image.save_png(folder.path_join(filename)) == OK, "screenshot saved")
