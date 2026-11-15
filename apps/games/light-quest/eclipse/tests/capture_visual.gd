extends SceneTree
## Captures the production scene through the Compatibility renderer at 960×540.

func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    root.size = Vector2i(960, 540)
    game._start("An")
    var wolf = game.enemies[0]
    game.hero.position = Vector2(wolf.position.x - 77, 432)
    game.cam.reset_smoothing()
    game.cam.force_update_scroll()
    game.scenery.update_camera(game.cam.get_screen_center_position().x, game.activated, true)
    game._request_attack()
    await _settle(10)
    if not await _save_frame("actual-gameplay.png"): return

    game._start("Kha")
    game.hero.position = Vector2(3 * 960 + 517, 432)
    game.cam.reset_smoothing()
    game.cam.force_update_scroll()
    game.scenery.update_camera(game.cam.get_screen_center_position().x, game.activated, true)
    game.light_circuit.rotate_near(Vector2(3 * 960 + 329, 332))
    game.light_circuit.rotate_near(Vector2(3 * 960 + 329, 407))
    await _settle(6)
    if not await _save_frame("actual-puzzle.png"): return

    game.hero.position = Vector2(6 * 960 + 509, 432)
    game.cam.reset_smoothing()
    game.cam.force_update_scroll()
    game.scenery.update_camera(game.cam.get_screen_center_position().x, game.activated, true)
    await _settle(8)
    if not await _save_frame("actual-guardian.png"): return
    quit(0)

func _settle(frames: int) -> void:
    for i in range(frames):
        await physics_frame
    await process_frame

func _save_frame(filename: String) -> bool:
    await RenderingServer.frame_post_draw
    var image := root.get_texture().get_image()
    if image == null or image.is_empty():
        push_error("Eclipse visual QA: no rendered pixels")
        quit(1)
        return false
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    if image.save_png(folder.path_join(filename)) != OK:
        push_error("Eclipse visual QA: failed to write " + filename)
        quit(2)
        return false
    print("ECLIPSE FRAME %s %dx%d" % [filename, image.get_width(), image.get_height()])
    return true
