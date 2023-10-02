#### live demo hosted at: [https://extrude-demo-aditya.vercel.app/](https://extrude-demo-aditya.vercel.app/)

# 🚀 Object Extrusion on Three.js

Recognizes mouse clicks and visualizes multiple extrusions made to an object in Three.js, without using gizmos.

### How to run it
This project has been created using BabylonJS and ES6/NPM , you can run it using:

```
npm i
npx webpack serve
```
To bundle your application, you can run
```
npm run build
```

### Notes
- Mesh should stay in the same position despite any combination of extrusions.
- To track mouse movement, an invisible range of extrusion mesh was used. Experimented with planes as babylonjs official documentation suggests but that was not as accurate as the current solution.
- Originally, implemented a solution that utilizes a single cube mesh that is scaled using a pivot to simulate extrusion on one side only. However, when extrusion on another face is attempted, the cube shifts position as the pivot must shift as well. To solve this issue, the current solution was implemented using a seperate cube that is created using the mouse pointer location and old center to calculate the new dimension and center, for the new mesh.
