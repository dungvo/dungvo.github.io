extends RefCounted
class_name EclipseHitGeometry

## All coordinates are WORLD space. Collision visuals and damage logic use the same shapes.
const PLAYER_BODY := Vector2(24.0, 48.0)
const ENEMY_BODY := Vector2(38.0, 36.0)
const ATTACK_HEIGHT := 38.0
const SWORD_REACH := 90.0
const MAGIC_REACH := 162.0

static func player_hurtbox(world_origin: Vector2) -> Rect2:
    return Rect2(world_origin - Vector2(PLAYER_BODY.x * 0.5, PLAYER_BODY.y * 0.5), PLAYER_BODY)

static func enemy_hurtbox(world_center: Vector2) -> Rect2:
    return Rect2(world_center - ENEMY_BODY * 0.5, ENEMY_BODY)

static func attack_hitbox(world_origin: Vector2, facing: int, is_mage: bool) -> Rect2:
    var reach: float = MAGIC_REACH if is_mage else SWORD_REACH
    var x: float = world_origin.x if facing >= 0 else world_origin.x - reach
    return Rect2(Vector2(x,world_origin.y - ATTACK_HEIGHT * 0.5),Vector2(reach,ATTACK_HEIGHT))

static func overlaps(first: Rect2, second: Rect2) -> bool:
    return first.intersects(second)

static func grounded_platform_overlap(body: Rect2, platform: Rect2) -> bool:
    return body.intersects(platform)
