extends SceneTree
const Surface := preload("res://scripts/ground_surface.gd")
const Art := preload("res://scripts/eclipse_art.gd")
const Hit := preload("res://scripts/hit_geometry.gd")

func _initialize() -> void:
    call_deferred("_run")

func _run() -> void:
    var game = load("res://scenes/main.tscn").instantiate()
    game.save_enabled = false
    root.add_child(game)
    game.enter_journey("An")
    for i in range(8): await physics_frame
    assert(game.hero.is_on_floor() and game.ground_contact.visible)
    assert(is_equal_approx(game.actor_anim.position.y + game.actor_anim.offset.y * game.actor_anim.scale.y,
        Hit.PLAYER_BODY.y * 0.5 + (Art.HERO_CELL.y * 0.5 - Art.HERO_FOOTLINE) * game.actor_anim.scale.y))
    var found := 0
    for floor_art in game.scenery.play_surfaces:
        _assert_lip(floor_art)
        found += 1
    assert(found > 10)
    assert(game.atlas.terrain(0, 0, 1).size() > 2)

    # The moving ferry used to put its art's left edge at its collider's centre.
    game.story_mode = false
    game.demo_room_select.select(1)
    game._start("Kha")
    game._interact()
    for i in range(30):
        await physics_frame
        _assert_lip(game.trials.routes.ferry_art)
    game.demo_room_select.select(6)
    game._start("An")
    game._interact()
    for floor_art in game.sky.root.get_children():
        if floor_art is Surface: _assert_lip(floor_art)
    assert(game.atlas.terrain(6, 0, 1).size() > 2)
    var pose := Art.anchored_pose(Vector2(120, 267), 205)
    assert(is_equal_approx(pose.position.y + Art.HERO_FOOTLINE / Art.HERO_CELL.x * pose.size.x, 267.0))
    print("ECLIPSE GROUND CONTACT PASS")
    quit()

func _assert_lip(surface: Node2D) -> void:
    assert(is_instance_valid(surface.collider))
    var shape: CollisionShape2D = surface.collider.get_child(0)
    var dimensions: Vector2 = shape.shape.size
    var expected := shape.global_position - dimensions * 0.5
    assert(surface.lip().position.distance_to(expected) < 0.2)
    assert(is_equal_approx(surface.lip().size.x, dimensions.x))
