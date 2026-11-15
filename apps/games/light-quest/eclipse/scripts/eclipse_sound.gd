extends Node
## Small pooled cues. Samples ship with the build and play after player input.

const CUES := {
    "slash": preload("res://assets/eclipse/sound/slash.wav"),
    "cast": preload("res://assets/eclipse/sound/cast.wav"),
    "contact": preload("res://assets/eclipse/sound/contact.wav"),
    "hurt": preload("res://assets/eclipse/sound/hurt.wav"),
    "light": preload("res://assets/eclipse/sound/light.wav"),
    "victory": preload("res://assets/eclipse/sound/victory.wav"),
    "dash": preload("res://assets/eclipse/sound/dash.wav"),
    "phase": preload("res://assets/eclipse/sound/phase.wav")
}

var players: Array[AudioStreamPlayer] = []
var cursor := 0

func _ready() -> void:
    if DisplayServer.get_name() == "headless" or AudioServer.get_driver_name() == "Dummy":
        return
    for index in range(5):
        var player := AudioStreamPlayer.new()
        player.volume_db = -12
        add_child(player)
        players.append(player)

func play_cue(cue: String, pitch := 1.0) -> void:
    if players.is_empty(): return
    var player := players[cursor]
    cursor = (cursor + 1) % players.size()
    player.stream = CUES[cue]
    player.pitch_scale = pitch
    player.play()
