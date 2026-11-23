extends RefCounted

const AN_COMBO := preload("res://assets/eclipse/an-combo.webp")
const MONSTER_ACTIONS := preload("res://assets/eclipse/monster-actions.webp")
const HEROES := preload("res://assets/eclipse/heroes.webp")
const HERO_RUN := preload("res://assets/eclipse/hero-run.webp")
const HERO_STATES := preload("res://assets/eclipse/hero-states.webp")
const DETAILS := preload("res://assets/eclipse/ruin-details.webp")
const CREATURES := preload("res://assets/eclipse/creatures.webp")
const RUINS := preload("res://assets/eclipse/ruins.webp")
const SCENERY := preload("res://assets/eclipse/moon-tower.webp")
const HERO_CELL := Vector2i(192, 168)
const ENEMY_CELL := Vector2i(192, 192)
const RUIN_REGIONS := [
    Rect2i(3, 153, 234, 83), Rect2i(260, 8, 199, 228), Rect2i(483, 101, 234, 135),
    Rect2i(66, 328, 107, 148), Rect2i(302, 267, 115, 209), Rect2i(533, 264, 133, 212)
]

static func cell(texture: Texture2D, index: int, size: Vector2i) -> AtlasTexture:
    var atlas := AtlasTexture.new()
    atlas.atlas = texture
    atlas.region = Rect2(Vector2(index % 4, index / 4) * Vector2(size), Vector2(size))
    atlas.filter_clip = true
    return atlas

const DETAIL_REGIONS := [
    Rect2i(53, 5, 133, 231), Rect2i(283, 5, 153, 231),
    Rect2i(11, 367, 217, 109), Rect2i(278, 374, 164, 102)
]

static func ruin(index: int) -> AtlasTexture:
    var atlas := AtlasTexture.new()
    if index < RUIN_REGIONS.size():
        atlas.atlas = RUINS
        atlas.region = RUIN_REGIONS[index]
    else:
        atlas.atlas = DETAILS
        atlas.region = DETAIL_REGIONS[index - RUIN_REGIONS.size()]
    atlas.filter_clip = true
    return atlas

static func actor_frames(is_kha: bool) -> SpriteFrames:
    var result := SpriteFrames.new()
    result.remove_animation("default")
    var bank := 4 if is_kha else 0
    _add(result, "idle", HEROES, HERO_CELL, [bank], 2)
    _add(result, "run", HERO_RUN, HERO_CELL, [bank, bank + 1, bank + 2, bank + 3], 12)
    _add(result, "jump", HEROES, HERO_CELL, [bank + 2], 4)
    _add(result, "fall", HERO_STATES, HERO_CELL, [bank], 4)
    _add(result, "dash", HERO_STATES, HERO_CELL, [bank + 1], 4)
    _add(result, "hurt", HERO_STATES, HERO_CELL, [bank + 2], 4)
    _add(result, "death", HERO_STATES, HERO_CELL, [bank + 3], 4)
    _add(result, "attack", HEROES, HERO_CELL, [bank + 3], 6, false)
    if not is_kha:
        for step in range(3):
            _add(result, "attack_%d" % (step + 1), AN_COMBO, Vector2i(256, 168), [step, step + 3], 12, false)
            result.add_frame("attack_%d" % (step + 1), cell(HEROES, 0, HERO_CELL))
    return result

static func attach_enemy(enemy: CharacterBody2D) -> AnimatedSprite2D:
    var result := SpriteFrames.new()
    result.remove_animation("default")
    var frames: Array = {"wolf":[0,1], "golem":[2,3], "mage":[4,4], "bat":[5,6], "guardian":[7,7]}[enemy.kind]
    _add(result, "idle", CREATURES, ENEMY_CELL, frames if enemy.kind == "bat" else [frames[0]], 6)
    if enemy.kind in ["wolf", "guardian"]:
        var bank := 0 if enemy.kind == "wolf" else 3
        for state in ["tell", "attack", "recover"]:
            var offset := {"tell":0, "attack":1, "recover":2}
            _add(result, state, MONSTER_ACTIONS, Vector2i(256, 192), [bank + offset[state]], 5, false)
    else:
        _add(result, "attack", CREATURES, ENEMY_CELL, [frames[1]], 5)
        _add(result, "tell", CREATURES, ENEMY_CELL, [frames[0]], 5)
        _add(result, "recover", CREATURES, ENEMY_CELL, [frames[0]], 5)
    var sprite := AnimatedSprite2D.new()
    sprite.sprite_frames = result
    sprite.offset = Vector2(0, -92)
    var height: float = {"wolf":53.0, "golem":76.0, "mage":71.0, "bat":53.0, "guardian":153.0}[enemy.kind]
    var source_height: float = {"wolf":107.0, "golem":151.0, "mage":150.0, "bat":120.0, "guardian":178.0}[enemy.kind]
    sprite.scale = Vector2.ONE * (height / source_height)
    sprite.position.y = enemy.SIZES[enemy.kind].y / 2.0
    sprite.z_index = 3
    enemy.add_child(sprite)
    sprite.play("idle")
    return sprite

static func _add(result: SpriteFrames, label: String, texture: Texture2D, size: Vector2i, indices: Array, speed: float, loop := true) -> void:
    result.add_animation(label)
    result.set_animation_loop(label, loop)
    result.set_animation_speed(label, speed)
    for index in indices:
        result.add_frame(label, cell(texture, index, size))
