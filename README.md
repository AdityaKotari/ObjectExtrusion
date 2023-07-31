#### live demo hosted at: [https://sdealgo-test.vercel.app/](https://sdealgo-test.vercel.app/)

# 🚀 SDE-Algo Assignment

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

## Task
- Set up a basic Babylon.js project environment. ✅
- Create a cube mesh object in the scene. ✅
- Implement the following extrusion features:
	- User Input: Allow user to select a face to be extruded with the first mouse click, on the second click the extrusion operation should be complete and the original mesh modified. ✅
	- Extrusion Animation: When the user triggers the extrusion action, smoothly animate the cube's vertices to create the extrusion effect. ✅

Optional: 

- Multiple extrusions enabled, on all sides of the cube ✅
- Visual guidelines to show range of extrusion and dimensions before extrusion ✅
- live demo deployed ✅

### Assumptions made
- Mesh should stay in the same position despite any combination of extrusions.
- To track mouse movement, an invisible range of extrusion mesh was used. Experimented with planes as babylonjs official documentation suggests but that was not as accurate as the current solution.
- Originally, implemented a solution that utilizes a single cube mesh that is scaled using a pivot to simulate extrusion on one side only. However, when extrusion on another face is attempted, the cube shifts position as the pivot must shift as well. To solve this issue, the current solution was implemented using a seperate cube that is created using the mouse pointer location and old center to calculate the new dimension and center, for the new mesh.