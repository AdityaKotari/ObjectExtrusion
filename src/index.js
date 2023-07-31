import { ArcRotateCamera, Color4, CreateBox, CreateLines, Mesh, MultiPointerScaleBehavior, PointerEventTypes, Space, UniversalCamera, VertexData } from "@babylonjs/core";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

// ------------------- constants -------------------
const initialBoxSize = 1;

// ------------------ scene setup ------------------
const canvas = document.getElementById("renderCanvas");

const engine = new Engine(canvas);

const scene = new Scene(engine);

/*
    This creates and positions an universal camera

    Note: ArcRotateCamera is more intuitive to use with only a mouse 
    but requires clicks which conflicts with our use case.
*/
const camera = new UniversalCamera("camera1", new Vector3(6, 3, -6), scene);
//const camera = new ArcRotateCamera("camera1", 3*Math.PI/4, Math.PI/3, 10, Vector3.Zero(), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

const light = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
light.intensity = 0.7;

// ------------------ rendering box ------------------
const box = CreateBox("box", { size: initialBoxSize }, scene);
box.updatable = true;
box.position.set(1.5, 1, 1.5);
box.enableEdgesRendering();
box.edgesWidth = 1.5;
box.edgesColor = new Color4(0, 1, 0, 1);

// ------------------ rendering axis ------------------

// rendering x, y, z axis
const myPoints = [
    new Vector3(5, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 5, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 5),
]
const lines = CreateLines("lines", { points: myPoints, updatable: true }, scene);

var newScale = null;
var selectedMesh = null;
var worldPosition = new Vector3(1.5, 1, 1.5);
var prevFacet = -1;

// ------------------ event and logic for extrusion ------------------
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
            //console.log("POINTER DOWN");
            if (selectedMesh !== null) {
                //box.setAbsolutePosition(worldPosition);
                selectedMesh = null;
                newScale = null;
            }
            else {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                if (pickResult !== null && pickResult.pickedMesh !== null) {
                    if (pickResult.pickedMesh.id === "box" && pickResult.faceId !== null) {
                        selectedMesh = pickResult.pickedMesh;

                        const facet = 2 * Math.floor(pickResult.faceId / 2);
                        console.log(facet)

                        const boxDepth = initialBoxSize * box.scaling.z;
                        const boxHeight = initialBoxSize * box.scaling.y;
                        const boxLength = initialBoxSize * box.scaling.x;

                        // box.computeWorldMatrix(true);
                        worldPosition = box.absolutePosition.clone();
                        // worldPosition = box.getBoundingInfo().boundingBox.centerWorld;
                        // const relativeLocalPosition = worldPosition.subtract(box.position)

                        const pointerScale = 0.002;
                        console.log(worldPosition)
                        console.log(box.getPositionData())
                        console.log(box.get)
                        switch (facet) {
                            case 0:
                                // +z face
                                box.setPivotPoint(new Vector3(0, 0, -boxDepth / 2).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(0, 0, pointerScale);
                                break;
                            case 2:
                                // -z face
                                box.setPivotPoint(new Vector3(0, 0, boxDepth / 2).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(0, 0, pointerScale);
                                break;
                            case 4:
                                // +x face
                                box.setPivotPoint(new Vector3(-boxLength / 2, 0, 0).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(pointerScale, 0, 0);
                                break;
                            case 6:
                                // -x face
                                box.setPivotPoint(new Vector3(boxLength / 2, 0, 0).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(pointerScale, 0, 0);
                                break;
                            case 8:
                                // +y face
                                box.setPivotPoint(new Vector3(0, -boxHeight / 2, 0).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(0, pointerScale, 0);
                                break;
                            case 10:
                                // -y face
                                box.setPivotPoint(new Vector3(0, boxHeight / 2, 0).add(worldPosition), Space.WORLD);
                                newScale = new Vector3(0, pointerScale, 0);
                                break;
                        }
                        box.setAbsolutePosition(worldPosition);


                    }
                }
            }
            break;
        case PointerEventTypes.POINTERMOVE:
            //console.log("POINTER MOVE");
            if (selectedMesh !== null) {

                const currentScale = selectedMesh.scaling;
                selectedMesh.scaling.set(currentScale.x + newScale.x, currentScale.y + newScale.y, currentScale.z + newScale.z);
            }
            break;
    }
});

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});