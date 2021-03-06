import ShaderComponent from "./shader_component";
import ShaderMaterial from "./shader_material";

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('custom/Shader/Outline')
export default class OutlineShader extends ShaderComponent {

    protected _shaderName = "Outline"

    protected _vert = `
    uniform mat4 viewProj;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        vec4 pos = viewProj * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`;
    protected _frag = `
    uniform sampler2D texture;
    varying vec2 uv0;
    uniform vec3 iResolution;

    void main()
    {
        vec2 onePixel = vec2(1.0 / iResolution.x, 1.0 / iResolution.y);

        vec4 color = texture2D(texture, uv0.xy);
        vec4 colorRight = texture2D(texture, uv0.xy + vec2(0,onePixel.t));
        vec4 colorBottom = texture2D(texture, uv0.xy + vec2(onePixel.s,0));

        color.r = 3.0* sqrt( (color.r - colorRight.r) * (color.r - colorRight.r) + (color.r - colorBottom.r) * (color.r - colorBottom.r) );
        color.g = 3.0* sqrt( (color.g - colorRight.g) * (color.g - colorRight.g) + (color.g - colorBottom.g) * (color.g - colorBottom.g) );
        color.b = 3.0* sqrt( (color.b - colorRight.b) * (color.b - colorRight.b) + (color.b - colorBottom.b) * (color.b - colorBottom.b) );

        color.r >1.0 ? 1.0 : color.r;
        color.g >1.0 ? 1.0 : color.g;
        color.b >1.0 ? 1.0 : color.b;
        gl_FragColor = vec4(color.rgb, 1);
    }
    `
    protected _defines = []

    protected _params = [{ name: 'iResolution', type: renderer.PARAM_FLOAT3 }]

    protected setParamValue(material: ShaderMaterial) {
        var iResolution = new cc.Vec3(this.node.width, this.node.height, 0);
        material.setParamValue("iResolution", iResolution)
    }

}
