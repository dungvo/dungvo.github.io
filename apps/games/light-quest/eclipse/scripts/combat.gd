extends RefCounted

# Physics layers shared by the actor scenes and swept projectile queries.
const WORLD := 1
const HERO := 2
const HOSTILE := 4
const HERO_HURT := 8
const HOSTILE_HURT := 16

static func add_hurtbox(body: Node2D, size: Vector2, layer: int) -> void:
    var area := Area2D.new()
    area.name = "Hurtbox"
    area.collision_layer = layer
    area.collision_mask = 0
    area.monitoring = false
    area.add_child(rectangle(size))
    body.add_child(area)

static func rectangle(size: Vector2) -> CollisionShape2D:
    var shape := RectangleShape2D.new()
    shape.size = size
    var collision := CollisionShape2D.new()
    collision.shape = shape
    return collision

static func overlapping(space: PhysicsDirectSpaceState2D, rect: Rect2, mask: int) -> Array:
    var shape := RectangleShape2D.new()
    shape.size = rect.size
    var params := PhysicsShapeQueryParameters2D.new()
    params.shape = shape
    params.transform = Transform2D(0, rect.get_center())
    params.collision_mask = mask
    params.collide_with_bodies = false
    params.collide_with_areas = true
    return space.intersect_shape(params)

static func ray(space: PhysicsDirectSpaceState2D, start: Vector2, end: Vector2, mask: int) -> Dictionary:
    var params := PhysicsRayQueryParameters2D.create(start, end, mask)
    params.collide_with_areas = true
    params.hit_from_inside = true
    return space.intersect_ray(params)
