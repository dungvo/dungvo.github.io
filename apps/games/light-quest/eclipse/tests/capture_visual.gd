extends SceneTree
## Godot screenshot probe: captures a REAL rendered frame, not concept art.
## Run in CI and attach generated PNG for side-by-side mockup review.
func _initialize() -> void:
    call_deferred("_capture")

func _capture() -> void:
    var scene: PackedScene = load("res://scenes/main.tscn")
    if scene == null:
        push_error("Visual QA: scene missing")
        quit(2)
        return
    var game: Node2D = scene.instantiate()
    root.add_child(game)
    game.started = true
    game.menu.hide()
    game.hero.position = Vector2(470, 432)
    game.last_room = 0
    game._physics_process(0.016)
    for frame in range(5):
        await process_frame
    await RenderingServer.frame_post_draw
    var img: Image = root.get_texture().get_image()
    if img == null or img.is_empty():
        push_error("Visual QA: blank image")
        quit(3)
        return
    var dest := ProjectSettings.globalize_path("res://visual-qa/actual-gameplay.png")
    DirAccess.make_dir_recursive_absolute(dest.get_base_dir())
    var err := img.save_png(dest)
    if err != OK:
        push_error("Visual QA: cannot save screenshot "+str(err))
        quit(4)
        return
    print("VISUAL QA SCREENSHOT: "+dest+" "+str(img.get_width())+"x"+str(img.get_height()))
    print("IMPORTANT: An image existing does not prove visual quality. Human comparison required.")
    quit(0)
