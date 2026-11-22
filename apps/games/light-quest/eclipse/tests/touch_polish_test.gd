extends "res://tests/smoke.gd"

func _run() -> void:
    await _fixture("An", 6)
    game.enter_time_coast()
    game._interact()
    await _frames(8)

    _finger(1, Vector2(125, 365), true)
    await _frames(3)
    if not ensure(game.crouched and game.joystick.finger == -1, "crouch does not claim the movement finger"): return

    _finger(2, Vector2(242, 480), true)
    if not ensure(game.joystick.finger == 2 and game.joystick.axis == Vector2.ZERO, "floating stick begins neutral even near the edge"): return
    var drag := InputEventScreenDrag.new()
    drag.index = 2
    drag.position = Vector2(191, 480)
    root.push_input(drag, true)
    if not ensure(game.joystick.axis.x < -0.85 and game.touch.crouch, "crouch and movement use independent fingers"): return

    var cancel := InputEventScreenTouch.new()
    cancel.index = 2
    cancel.position = drag.position
    cancel.canceled = true
    root.push_input(cancel, true)
    if not ensure(game.joystick.finger == -1 and game.joystick.axis == Vector2.ZERO, "cancelled drag releases movement"): return
    _finger(1, Vector2(125, 365), false)
    await _frames(4)
    if not ensure(not game.crouched and not game.control_art.crouch.held, "release restores crouch and icon state"): return

    _finger(3, Vector2(705, 463), true)
    await _frames(5)
    _finger(3, Vector2(705, 463), false)
    var initial: float = game.control_art.dash.recovery
    if not ensure(initial > 0.8, "dash icon follows the gameplay cooldown"): return
    await _frames(26)
    if not ensure(game.control_art.dash.recovery < initial and game.control_art.dash.recovery > 0.0, "dash ring fills during recovery"): return
    print("ECLIPSE TOUCH POLISH PASS")
    quit()
