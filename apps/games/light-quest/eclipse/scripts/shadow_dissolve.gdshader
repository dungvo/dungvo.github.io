shader_type canvas_item;
varying vec2 local_pixel;

void vertex() {
    local_pixel = VERTEX;
}

uniform float dissolve : hint_range(0.0, 1.0) = 0.0;

void fragment() {
    vec2 block = floor(local_pixel * 0.55);
    float grain = fract(sin(dot(block, vec2(127.1, 311.7))) * 4375.5453);
    float threshold = clamp(0.50 + local_pixel.y * 0.0028 + (grain - 0.5) * 0.62, 0.001, 0.999);
    float gap = threshold - dissolve;
    float edge = (1.0 - smoothstep(0.0, 0.12, gap)) * smoothstep(0.0, 0.09, dissolve);
    COLOR.rgb = mix(COLOR.rgb, vec3(0.76, 0.56, 0.99), edge);
    COLOR.a *= smoothstep(-0.025, 0.025, gap);
}
