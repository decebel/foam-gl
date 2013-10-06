var Foam = require('../../src/foam/foam.js');

function App()
{
    Foam.Application.apply(this,arguments);

    this.setFullWindowFrame(true);

    this.setTargetFPS(60);
    this.setSize(1025,768);
}

App.prototype = Object.create(Foam.Application.prototype);

App.prototype.setup = function()
{
    var fgl = this.fgl;

    var light0 = this._light0 = new Foam.Light(fgl.LIGHT_0);
    light0.setAmbient3f(0.8,0.8,0.8);
    light0.setDiffuse3f(0.8,0.8,0.8);
    light0.setSpecular3f(1,1,1);
    light0.setPosition3f(1,1,1);

    var material = this._material0 = new Foam.Material();
    material.setDiffuse3f(0.7,0.7,0.7);
    material.setAmbient3f(0.7,0.7,0.7);
    material.setSpecular3f(1,1,1);
    material.shininess = 200.0;

    this._surface = new Foam.ParametricSurface(220);
    this._surface.setFunctions(null,function(u,v,t){return Math.sin(u*10+t*4)*Math.sin(v*10+t*4);},null);


};

App.prototype.update = function()
{
    var fgl = this.fgl;
    var cam = this.camera;

    var time = this.getSecondsElapsed(),
        timeDelta = this.getTimeDelta(),
        zoom = 10 + Math.sin(time) * 0.25;

    var light0 = this._light0;

    fgl.clear3f(0.1,0.1,0.1);
    fgl.loadIdentity();


    var camRotX, camRotY;

    if(this.isMouseDown())
    {
        camRotX = (-1 + this.mouse.getX() / this.getWidth()  * 2.0) * Math.PI;
        camRotY = (-1 + this.mouse.getY() / this.getHeight() * 2.0) * Math.PI ;

        Foam.Vec3.lerp3f(cam.position,
                         Math.cos(camRotX) * zoom,
                         Math.sin(camRotY) * zoom,
                         Math.sin(camRotX) * zoom,
                         timeDelta * 0.25);
    }
    else
    {
        camRotX = time * 0.25;

        cam.setPosition3f(Math.cos(camRotX) * zoom,
            zoom,
            Math.sin(camRotX) * zoom);
    }

    cam.setTarget3f(0,0,0);
    cam.updateMatrices();



    var material = this._material0;

    this._surface.applyFunctionsWithArg(time);
    this._surface.updateVertexNormals();

    fgl.drawMode(fgl.LINES);
    this.drawSystem();

    fgl.useLighting(true);
    fgl.useMaterial(true);

    fgl.light(light0);


    fgl.material(material);

    fgl.drawMode(fgl.TRIANGLES);
    fgl.pushMatrix();
    fgl.scale3f(4,1,4);
    fgl.drawGeometry(this._surface);
    fgl.popMatrix();

    fgl.useMaterial(false);
    fgl.useLighting(false);

};

App.prototype.drawSystem =  function()
{
    var fgl = this.fgl;

    fgl.color1f(0.25);
    Foam.fGLUtil.drawGrid(fgl,48,1);
    Foam.fGLUtil.drawGridCube(fgl,48,1);
    Foam.fGLUtil.drawAxes(fgl,12);
};

var app = new App();