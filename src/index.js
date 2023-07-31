import { ArcRotateCamera, Color4, CreateBox, CreateLines, Mesh, MeshBuilder, MultiPointerScaleBehavior, PointerEventTypes, Space, StandardMaterial, Tools, UniversalCamera, VertexData } from "@babylonjs/core";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

// ------------------ scene setup ------------------
const canvas = document.getElementById("renderCanvas");

const engine = new Engine(canvas);

const scene = new Scene(engine);

/*
    This creates and positions an universal camera

    Note: ArcRotateCamera is more intuitive to use with only a mouse 
    so I've preferred that over UniversalCamera.
*/
//const camera = new UniversalCamera("camera1", new Vector3(6, 3, -6), scene);
const camera = new ArcRotateCamera("camera1", 1 * Math.PI / 8, Math.PI / 3, 10, Vector3.Zero(), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

const light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
light.intensity = 1;


// ------------------ global variables ------------------
// caches previous dimensions and center to use to calculate new center and dimensions
var boxDepth = 1, boxWidth = 1, boxHeight = 1, boxCenter = new Vector3(1.5, 1, 1.5);
var boxDepthTemp = null, boxWidthTemp = null, boxHeightTemp = null, boxCenterTemp = null;

var selectedFacet = null, selectedMesh = null;
var tempMesh = null, pickMesh = null;
var mouseText = null;

// constants
const green = new Color4(0, 1, 0, 1);
const red = new Color4(1, 0, 0, 1);

// ------------------ rendering axis ------------------
// rendering x, y, z axis
const myPoints = [
    new Vector3(100, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 100, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 100),
]
const lines = CreateLines("lines", { points: myPoints, updatable: true }, scene);
lines.isPickable = false;

// ------------------ rendering box ------------------
// convenience function to create a box and cache dimensions, center
const createBoxAt = (depth, width, height, center, color) => {
    if (depth === null || width === null || height === null || center === null || color === null)
        return null;
    const box = CreateBox("initialbox", { height: height, width: width, depth: depth }, scene);
    if (center !== null) {
        box.position.set(center.x, center.y, center.z);
    }
    box.enableEdgesRendering();
    box.edgesWidth = 1.5;
    box.edgesColor = color;

    return box;
};
// creating the initial box
const box = createBoxAt(boxDepth, boxWidth, boxHeight, boxCenter, green);

// ------------------ events and logic for extrusion ------------------
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            //console.log("POINTER DOWN");
            if (selectedMesh !== null) {
                //box.setAbsolutePosition(worldPosition);
                // selectedMesh = null;
                // newScale = null;

                boxHeight = boxHeightTemp;
                boxWidth = boxWidthTemp;
                boxDepth = boxDepthTemp;
                boxCenter = boxCenterTemp;
                
                selectedMesh.dispose();
                selectedFacet = null;
                selectedMesh = null;

                tempMesh = null;

                pickMesh.dispose();
                pickMesh = null;
            }
            else {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                if (pickResult !== null && pickResult.pickedMesh !== null) {
                    if (pickResult.pickedMesh.id === "initialbox" && pickResult.faceId !== null) {
                        selectedMesh = pickResult.pickedMesh;

                        selectedFacet = 2 * Math.floor(pickResult.faceId / 2);
                        console.log(selectedFacet)

                        // facet corresponds to which face is picked
                        switch (selectedFacet) {
                            case 0:
                                // +z face
                                pickMesh = createBoxAt(100, boxWidth, boxHeight, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                            case 2:
                                // -z face
                                pickMesh = createBoxAt(100, boxWidth, boxHeight, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                            case 4:
                                // +x face
                                pickMesh = createBoxAt(boxDepth, 100, boxHeight, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                            case 6:
                                // -x face
                                pickMesh = createBoxAt(boxDepth, 100, boxHeight, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                            case 8:
                                // +y face
                                pickMesh = createBoxAt(boxDepth, boxWidth, 100, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                            case 10:
                                // -y face
                                pickMesh = createBoxAt(boxDepth, boxWidth, 100, boxCenter, red);
                                pickMesh.isPickable = true;
                                var mat = new StandardMaterial("mat", scene);
                                mat.alpha = 0;
                                pickMesh.material = mat;
                                break;
                        }


                    }
                }
            }
            break;
        case PointerEventTypes.POINTERMOVE:
            //console.log("POINTER MOVE");
            const pickedPoint = scene.pick(scene.pointerX, scene.pointerY).pickedPoint;
            console.log(pickedPoint)
            if (selectedMesh !== null && pickedPoint !== null) {
                // initializing to default
                boxHeightTemp = boxHeight;
                boxWidthTemp = boxWidth;
                boxDepthTemp = boxDepth;

                var mouseTextValue = "";

                // cases for which face is picked
                switch (selectedFacet) {
                    case 0:
                        // +z face
                        boxDepthTemp = Math.abs(pickedPoint.z - (boxCenter.z - boxDepth / 2))
                        boxCenterTemp = new Vector3(boxCenter.x, boxCenter.y, (pickedPoint.z + boxCenter.z - boxDepth / 2) / 2);
                        mouseTextValue = boxDepthTemp.toString();
                        break;
                    case 2:
                        // -z face
                        boxDepthTemp = Math.abs(pickedPoint.z - (boxCenter.z + boxDepth / 2))
                        boxCenterTemp = new Vector3(boxCenter.x, boxCenter.y, (pickedPoint.z + boxCenter.z + boxDepth / 2) / 2);
                        mouseTextValue = boxDepthTemp.toString();
                        break;
                    case 4:
                        // +x face
                        boxWidthTemp = Math.abs(pickedPoint.x - (boxCenter.x - boxWidth/2));
                        boxCenterTemp = new Vector3((pickedPoint.x + boxCenter.x - boxWidth/2)/2, boxCenter.y, boxCenter.z);
                        break;
                    case 6:
                        // -x face
                        boxWidthTemp = Math.abs(pickedPoint.x - (boxCenter.x + boxWidth/2));
                        boxCenterTemp = new Vector3((pickedPoint.x + boxCenter.x + boxWidth/2)/2, boxCenter.y, boxCenter.z);
                        break;
                    case 8:
                        // +y face
                        boxHeightTemp = Math.abs(pickedPoint.y - (boxCenter.y - boxHeight/2));
                        boxCenterTemp = new Vector3(boxCenter.x, (pickedPoint.y + boxCenter.y - boxHeight/2)/2, boxCenter.z);
                        break;
                    case 10:
                        // -y face
                        boxHeightTemp = Math.abs(pickedPoint.y - (boxCenter.y + boxHeight/2));
                        boxCenterTemp = new Vector3(boxCenter.x, (pickedPoint.y + boxCenter.y + boxHeight/2)/2, boxCenter.z);
                        break;
                }
                var newMesh = createBoxAt(boxDepthTemp, boxWidthTemp, boxHeightTemp, boxCenterTemp, green);
                if (tempMesh !== null) {
                    tempMesh.dispose();
                }
                tempMesh = newMesh;
            }
            break;
    }
});

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});