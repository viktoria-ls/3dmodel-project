import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let loader = new GLTFLoader();

let speed = 0.03
let state = "grounded";
let targetPos = 0

let cooldown = false
let gameOver = false;

let carPosition;
let goal;

//URLS
const crateURL = './models/crate.glb'
const crate2URL = './models/crate2.glb'
const grassURL = './models/grass.glb'
const carURL = './models/car.glb'
const treeURLs = ['./models/tree1.glb', './models/tree2.glb'];

let obstacledNum = 8;

class CarPosition {
  constructor(row, column) {
      this.row = row; // Row position on the grid
      this.column = column; // Column position on the grid
  }

  setRow(row) {
      this.row = row;
  }

  setColumn(column) {
      this.column = column;
  }

  getRow() {
      return this.row;
  }

  getColumn() {
      return this.column;
  }
}

class CratePosition {
  constructor(row, column) {
      this.row = row; // Row position on the grid
      this.column = column; // Column position on the grid
  }

  setRow(row) {
      this.row = row;
  }

  setColumn(column) {
      this.column = column;
  }

  getRow() {
      return this.row;
  }

  getColumn() {
      return this.column;
  }
}



function randomCoord() {
  return Math.random() * 29 - 14.5
}

const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper(30, 10); // Create a grid with size 30x30
gridHelper.position.y; // Set the position of the grid to be just below the floor
scene.add(gridHelper); // Add the grid to the scene

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 1, 1, 1 );
scene.add( light );

loader = new GLTFLoader();
// Load GLTF model

let crateList = []
let immovableList = []

function loadLevelOne() {
  carPosition = new CarPosition(5, 1)

  let crates = []
  crates.push(new CratePosition(4, 2))
  crates.push(new CratePosition(5, 2))
  crates.push(new CratePosition(6, 2))

  crates.push(new CratePosition(8, 5))
  crates.push(new CratePosition(8, 6))


  let immovables = []
  immovables.push(new CratePosition(10, 1))
  immovables.push(new CratePosition(9, 1))
  immovables.push(new CratePosition(8, 1))
  immovables.push(new CratePosition(7, 1))
  immovables.push(new CratePosition(6, 1))
  immovables.push(new CratePosition(4, 1))
  immovables.push(new CratePosition(3, 1))
  immovables.push(new CratePosition(2, 1))
  immovables.push(new CratePosition(1, 1))

  immovables.push(new CratePosition(2, 2))
  immovables.push(new CratePosition(2, 3))
  immovables.push(new CratePosition(2, 4))
  immovables.push(new CratePosition(2, 5))
  immovables.push(new CratePosition(2, 6))
  immovables.push(new CratePosition(2, 7))
  immovables.push(new CratePosition(2, 8))
  immovables.push(new CratePosition(2, 9))
  immovables.push(new CratePosition(2, 10))

  immovables.push(new CratePosition(1, 2))
  immovables.push(new CratePosition(1, 3))
  immovables.push(new CratePosition(1, 4))
  immovables.push(new CratePosition(1, 5))
  immovables.push(new CratePosition(1, 6))
  immovables.push(new CratePosition(1, 7))
  immovables.push(new CratePosition(1, 8))
  immovables.push(new CratePosition(1, 9))
  immovables.push(new CratePosition(1, 10))

  immovables.push(new CratePosition(10, 2))
  immovables.push(new CratePosition(10, 3))
  immovables.push(new CratePosition(10, 4))

  immovables.push(new CratePosition(10, 7))
  immovables.push(new CratePosition(10, 8))
  immovables.push(new CratePosition(10, 9))
  immovables.push(new CratePosition(10, 10))

  immovables.push(new CratePosition(9, 8))
  immovables.push(new CratePosition(9, 9))
  immovables.push(new CratePosition(9, 10))

  immovables.push(new CratePosition(8, 9))
  immovables.push(new CratePosition(8, 10))

  immovables.push(new CratePosition(3, 10))
  immovables.push(new CratePosition(4, 10))
  immovables.push(new CratePosition(5, 10))
  immovables.push(new CratePosition(6, 10))
  immovables.push(new CratePosition(7, 10))

  immovables.push(new CratePosition(3, 9))
  immovables.push(new CratePosition(4, 9))
  immovables.push(new CratePosition(5, 9))
  immovables.push(new CratePosition(6, 9))
  immovables.push(new CratePosition(7, 9))


  immovables.push(new CratePosition(3, 4))
  immovables.push(new CratePosition(4, 4))
  immovables.push(new CratePosition(5, 4))
  immovables.push(new CratePosition(6, 4))
  immovables.push(new CratePosition(7, 4))
  immovables.push(new CratePosition(8, 4))

  immovables.push(new CratePosition(6,5))
  immovables.push(new CratePosition(5,6))
  

  

  loader.load(crateURL, function(crateGLFT) {
    crates.forEach((cratePosition) => {
      let crate = crateGLFT.scene.clone();
      crate.position.x = -13.5 + (cratePosition.getRow() - 1) * 3;
      crate.position.z = -(-13.5 + (cratePosition.getColumn() - 1) * 3);
      crate.position.y = 1;
      scene.add(crate);
    
      let temp = { crate: crate, position: cratePosition, moveFlag: false, direction: "up", targetPos: 0 }
    
      crateList.push(temp);
    })
  });
  
  loader.load(crate2URL, function(crateGLFT) {
    immovables.forEach((immovablePosition) => {
      let crate = crateGLFT.scene.clone();
      crate.position.x = -13.5 + (immovablePosition.getRow() - 1) * 3;
      crate.position.z = -(-13.5 + (immovablePosition.getColumn() - 1) * 3);
      crate.position.y = 1;
      scene.add(crate);

      let temp = { crate: crate, position: immovablePosition, moveFlag: false, direction: "up", targetPos: 0 }
  
      immovableList.push(temp);
    })
  });

  goal = new CratePosition(5,5)

  //Render Goal
  const tile = new THREE.Mesh( 
    new THREE.BoxGeometry( 3, 1, 3), 
    new THREE.MeshBasicMaterial( { color: 0xFFFF00 } ));
  //Borders are 14.5
  tile.position.y = -0.8;
  tile.position.x = -13.5 + (goal.getRow() - 1) * 3
  tile.position.z = -(-13.5 + (goal.getColumn() - 1) * 3)
  scene.add( tile );
}

function getRandomPosition(bounds) {
  const { minX, maxX, minZ, maxZ } = bounds;
  const y = floor.position.y; 
  let randomX, randomZ;

  do {
      randomX = Math.random() * (maxX - minX) + minX;
      randomZ = Math.random() * (maxZ - minZ) + minZ;
  } while (Math.abs(randomX) <= 15 && Math.abs(randomZ) <= 15); //Makes sure it's outside the floor area

  return new THREE.Vector3(randomX, y, randomZ);
}

function scatterTrees(treeURL) {
    loader.load(treeURL, function (treeGLTF) {
        const treeModel = treeGLTF.scene;
        const numTreeInstances = 30; // Adjust as needed

        for (let i = 0; i < numTreeInstances; i++) {
            const treeInstance = treeModel.clone();
            const randomPosition = getRandomPosition(backgroundBounds);
            treeInstance.position.copy(randomPosition);
            scene.add(treeInstance);
            treeList.push(treeInstance);
        }
    });
}


loadLevelOne()

function detectWin() {
  let onGoal = crateList.find(crate => crate.position.getRow() === goal.getRow() && crate.position.getColumn() === goal.getColumn())

  if(onGoal != undefined) {
    document.getElementById('win-screen').style.display = 'block';
  }
}

function move(direction) {
  let targetColumn = carPosition.getColumn();
  let targetRow = carPosition.getRow();
  let tempState
  let tempPos
  
  switch(direction) {
    case "up":
      model.lookAt(model.position.x, model.position.y, -999)
      targetColumn += 1
      tempState = "moveUp"
      tempPos = model.position.z -3
      break;
    case "down":
      model.lookAt(model.position.x, model.position.y, 999)
      targetColumn -= 1
      tempState = "moveDown"
      tempPos = model.position.z + 3
      break;
    case "left":
      model.lookAt(-999, model.position.y, model.position.z)
      targetRow -= 1
      tempState = "moveLeft"
      tempPos = model.position.x - 3
      break;
    case "right":
      model.lookAt(999, model.position.y, model.position.z)
      targetRow += 1
      tempState = "moveRight"
      tempPos = model.position.x + 3
  }

  console.log("Was at " + carPosition.getRow() + " " + carPosition.getColumn() + " Looking for crate at row " + targetRow + " and column " + targetColumn)

  let targetCrate = crateList.find(crate => crate.position.getRow() == targetRow && crate.position.getColumn() == targetColumn);
  console.log(immovableList[0])
  if (targetCrate == undefined) {
    let targetCrate = immovableList.find(crate => crate.position.getRow() == targetRow && crate.position.getColumn() == targetColumn);
    console.log(targetCrate)
    if(targetCrate == undefined) {
      carPosition.setColumn(targetColumn)
      carPosition.setRow(targetRow)
      console.log("Moved to " + carPosition.getRow() + " " + carPosition.getColumn())
      state = tempState
      targetPos = tempPos
    }
    
  }
  else {
    let pushFlag
    let nextTargetRow = targetRow
    let nextTargetColumn = targetColumn
    switch(direction) {
      case "up":
        if(targetCrate.position.getColumn() != 10) {
          pushFlag = true;
          nextTargetColumn += 1
          tempPos = targetCrate.crate.position.z - 3
        }
        break;
      case "down":
       if(pushFlag = targetCrate.position.getColumn() != 1) {
         pushFlag = true;
         nextTargetColumn -= 1
         tempPos = targetCrate.crate.position.z + 3
       }
        break;
      case "left":
        if(pushFlag = targetCrate.position.getRow() != 1) {
          pushFlag = true;
          nextTargetRow -= 1
          tempPos = targetCrate.crate.position.x - 3
        }
        break;
      case "right":
        if(pushFlag = targetCrate.position.getRow() != 10) {
          pushFlag = true;
          nextTargetRow += 1
          tempPos = targetCrate.crate.position.x + 3
        }
        break;
    }

    if(pushFlag) {
      let nextTargetCrate = crateList.find(crate => crate.position.getColumn() == nextTargetColumn && crate.position.getRow() == nextTargetRow);
      
      if (nextTargetCrate == undefined) {
        let nextTargetCrate = immovableList.find(crate => crate.position.getColumn() == nextTargetColumn && crate.position.getRow() == nextTargetRow);
        if(nextTargetCrate == undefined) {
          targetCrate.moveFlag = true
          targetCrate.direction = direction
          targetCrate.targetPos = tempPos
          
          targetCrate.position.setColumn(nextTargetColumn)
          targetCrate.position.setRow(nextTargetRow)
        }        
      }
    }
    

  }
}

let model
loader.load(carURL, function (gltf) {
    model = gltf.scene;
    model.position.x = (-13.5 + (carPosition.getRow()-1) * 3)
    model.position.z = -(-13.5 + (carPosition.getColumn()-1) * 3)
    model.position.y = 0.2;

    const boundingBox = new THREE.Box3().setFromObject(model);
    const modelSize = boundingBox.getSize(new THREE.Vector3());
    const scaleFactor = 2.6 / Math.max(modelSize.x, modelSize.y, modelSize.z);
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(model);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Directional light
    directionalLight.position.set(1, 1, 1).normalize(); // Set position of the light
    scene.add(ambientLight, directionalLight);

    // Optional: You may want to manipulate the model or access its children here

    window.addEventListener("keydown", (pressed)=> {
      console.log(state)
      if(state == "grounded" || state == "blocked") {
        console.log("Inside IF")
        switch(pressed.key) {
          case "ArrowUp": case "W": case "w":
            if(carPosition.getColumn() != 10) 
              move("up")
            break;
          case "ArrowRight": case "D": case "d":
            if(carPosition.getRow() != 10)
              move("right")        
            break;
          case "ArrowDown": case "S": case "s":
            if(carPosition.getColumn() != 1)
              move("down")
            break;
          case "ArrowLeft": case "A": case "a":
            if(carPosition.getRow() != 1)
              move("left")
            break;
          case " ":
            if(!cooldown)
              state = "airborne";
            break;
          case "Shift":
            if(!cooldown)
              state = "dodge";
            break;  
        }
      }
      else {
        console.log("NO")
      }
    })

    // Render the scene
    animate();
});




const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xD2B48C); // Sky blue color
document.body.appendChild( renderer.domElement );

const floor = new THREE.Mesh( 
  new THREE.BoxGeometry( 30, 1, 30), 
  new THREE.MeshBasicMaterial( { color: 0x5EC657  } ));
//Borders are 14.5
floor.position.y = -1;
scene.add( floor );

let grassList = [];

loader.load(grassURL, function (grassGLTF) {
    const grassModel = grassGLTF.scene;

    const numGrassInstances = 50;

    const minX = -14.5; 
    const maxX = 14.5;
    const minZ = -14.5; 
    const maxZ = 14.5;

    for (let i = 0; i < numGrassInstances; i++) {
        const grassInstance = grassModel.clone();

        const randomX = Math.random() * (maxX - minX) + minX;
        const randomZ = Math.random() * (maxZ - minZ) + minZ;

        grassInstance.position.set(randomX, 0, randomZ);

        scene.add(grassInstance);

        grassList.push(grassInstance);
    }
});

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.copy(new THREE.Vector3(0, 30, 20))
camera.lookAt(floor.position)

const controls = new OrbitControls( camera, renderer.domElement );

let treeList = [];

const backgroundBounds = {
    minX: -30,
    maxX: 30,
    minZ: -30,
    maxZ: 30,
};


// Scatter trees from each URL
treeURLs.forEach(treeURL => scatterTrees(treeURL));


function animate() {
	requestAnimationFrame( animate );

  if(gameOver) {
    obstacleList.forEach((obstacle) => {
      scene.remove(obstacle)
    })
  }

  crateList.forEach((crate) => {
    if(crate.moveFlag) {
      switch(crate.direction) {
        case "up":
          if(crate.crate.position.z >= crate.targetPos)
            crate.crate.position.z -= speed
          else {
            crate.crate.position.z = crate.targetPos
            crate.moveFlag = false
          }
          break;
        case "down":
          if(crate.crate.position.z <= crate.targetPos)
            crate.crate.position.z += speed
          else {
            crate.crate.position.z = crate.targetPos
            crate.moveFlag = false
          }
          break;
        case "left":
          if(crate.crate.position.x >= crate.targetPos)
            crate.crate.position.x -= speed
          else {
            crate.crate.position.x = crate.targetPos
            crate.moveFlag = false
          }
          break;
        case "right":
          if(crate.crate.position.x <= crate.targetPos)
            crate.crate.position.x += speed
          else {
            crate.crate.position.x = crate.targetPos
            crate.moveFlag = false
          }
          break;
      }
    }
  })
  

  switch(state) {
    case "moveUp":
      if(model.position.z >= targetPos)
        model.position.z -= speed
      else {
        model.position.z = targetPos
        state = "grounded"
      }
        
      break;
    case "moveRight":
      if(model.position.x <= targetPos)
          model.position.x += speed
      else {
          model.position.x = targetPos
          state = "grounded"
      }
      break;
    case "moveDown":
      if(model.position.z <= targetPos)
          model.position.z += speed
      else {
        model.position.z = targetPos
        state = "grounded"
      }
      break;
    case "moveLeft":
      if(model.position.x >= targetPos)
          model.position.x -= speed
      else {
        model.position.x = targetPos
        state = "grounded"
      }
  }
  
  
  detectWin()

	renderer.render( scene, camera );
}

animate();

window.addEventListener("resize", ()=> {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
})

