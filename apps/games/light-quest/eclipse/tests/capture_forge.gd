extends SceneTree
## Stage comparable 960×540 screenshots using the production UI, art and preview.
func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    root.size = Vector2i(960,540)
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.demo_room_select.select(6)
    game.time_mode = true
    game._start("An")
    game._interact()
    var timeline = game.sky.timeline
    timeline.travel(0)
    timeline.set_interior(true)
    game.hero.position = game.sky.point(Vector2(3320,432))
    game.cam.reset_smoothing()
    game._interact()
    timeline.lunar_cores = 2
    timeline.metal = 2
    timeline.inspect_weapon(1)
    await create_timer(0.20).timeout
    await _save("v12-forge-preview.png")
    timeline.spear_infused = true
    timeline.owned[1] = true
    timeline.equipped = 1
    timeline.lunar_cores = 0
    timeline.inspect_weapon(1)
    await create_timer(0.40).timeout
    await _save("v12-forge-twin-tether.png")
    print("ECLIPSE FORGE CAPTURE PASS")
    quit(0)

func _save(filename: String) -> void:
    await process_frame
    await RenderingServer.frame_post_draw
    var folder := ProjectSettings.globalize_path("res://visual-qa")
    DirAccess.make_dir_recursive_absolute(folder)
    var picture := root.get_texture().get_image()
    assert(picture != null and not picture.is_empty())
    assert(picture.save_png(folder.path_join(filename)) == OK)
