module.exports ="varying vec2 vVertexTexCoord;uniform vec4 uVertexColor;uniform float uUseTexture;uniform sampler2D uTexImage;void main(void){ gl_FragColor = uVertexColor * (1.0 - uUseTexture) + texture2D(uTexImage,vVertexTexCoord) * uUseTexture;}";