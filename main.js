import './style.css'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let loader = new GLTFLoader();

let direction = "up";
let speed = 0.02
let state = "grounded";
let frameCounter = 0;
let cooldownCounter = 0;
let cooldown = false
let gameOver = false;
let obstacleList = [];

let obstacledNum = 8;

function randomCoord() {
  return Math.random() * 29 - 14.5
}

function detectCollision(head, obstacle) {
  //obstacle x range:
  let type
  console.log(obstacle.material)
  if(obstacle.material.color.getHex() == 0xff00ff)
    type = "dodge"
  else 
    type = "airborne"

  let startX = obstacle.position.x - (obstacle.geometry.parameters.width)/2
  let endX = obstacle.position.x + (obstacle.geometry.parameters.width)/2;
  let startZ = obstacle.position.z - (obstacle.geometry.parameters.depth)/2
  let endZ = obstacle.position.z + (obstacle.geometry.parameters.depth)/2;
  
  if(obstacle.geometry.parameters.width == 1) {
    startX -= 1
    endX += 1
  }

  if(obstacle.geometry.parameters.depth == 1) {
    startZ -= 1
    endZ += 1
  }

  if((head.position.z > startZ && head.position.z < endZ) && (head.position.x > startX && head.position.x < endX)) {
    if(type != state)
      return true
  }

  return false
}

function generateObstacles(head) {
  let orientation = 1
  
  for (let i = 0; i < obstacledNum; i++) {
    let type = Math.random() > 0.5 ? "dodge" : "airborne";
    let blockColor = type == "dodge" ? 0xff00ff : 0x00ffff;
    let flag = true;
    let length = Math.random() * 4 + 10;

    while (flag) {
        let obstacle;
        if (orientation === 0) {
            obstacle = new THREE.Mesh(
                new THREE.BoxGeometry(length, 1, 1),
                new THREE.MeshBasicMaterial({ color: blockColor })
            );
            obstacle.position.z = randomCoord();
        } else {
            obstacle = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, length),
                new THREE.MeshBasicMaterial({ color: blockColor })
            );
            obstacle.position.x = randomCoord();
        }

        // Check for collision with existing obstacles
        let collisionDetected = false;
        for (let j = 0; j < obstacleList.length; j++) {
            if (detectCollision(obstacle, obstacleList[j])) {
                collisionDetected = true;
                break;
            }
        }

        // Check for collision with head object
        if (!collisionDetected && detectCollision(obstacle, head)) {
            collisionDetected = true;
        }

        // If no collision detected, add obstacle to scene and obstacleList
        if (!collisionDetected) {
            scene.add(obstacle);
            obstacleList.push(obstacle);
            flag = false;
        }
    }

    // Toggle orientation for next obstacle
    orientation = (orientation === 0) ? 1 : 0;
  }
}

function pointCollected(point) {
  point.position.x = randomCoord()
  point.position.z = randomCoord()
}

const scene = new THREE.Scene();

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 1, 1, 1 );
scene.add( light );

// Load GLTF model
loader = new GLTFLoader();
loader.load('./models/car.glb', function (gltf) {
    const model = gltf.scene;
    model.position.x = 1;
    model.position.y = 1;
    model.position.z = 1;
    scene.add(model);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Directional light
    directionalLight.position.set(1, 1, 1).normalize(); // Set position of the light
    scene.add(ambientLight, directionalLight);

    // Optional: You may want to manipulate the model or access its children here

    // Render the scene
    animate();
});


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const floor = new THREE.Mesh( 
  new THREE.BoxGeometry( 30, 1, 30), 
  new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
//Borders are 14.5
floor.position.y = -1;
scene.add( floor );


const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.copy(new THREE.Vector3(0, 30, 20))
camera.lookAt(floor.position)

const point = new THREE.Mesh( 
  new THREE.BoxGeometry( 1, 1, 1), 
  new THREE.MeshBasicMaterial( { color: 0xffff00 } ));
  point.position.z = randomCoord()
  point.position.x = randomCoord()
scene.add ( point )


const head = new THREE.Mesh( 
  new THREE.BoxGeometry( 1, 1, 1), 
  new THREE.MeshBasicMaterial( { color: 0xff00000 } ));
scene.add( head )

generateObstacles(head)

const controls = new OrbitControls( camera, renderer.domElement );


function animate() {
	requestAnimationFrame( animate );

  obstacleList.forEach((obstacle) => {
    if(detectCollision(head, obstacle, "airborne")) {
      gameOver = true
    }
  })

  if(detectCollision(head, point, "none")) {
    pointCollected(point)
    obstacleList.forEach((obstacle) => {
      scene.remove(obstacle)
    })
    obstacleList = []

    generateObstacles(head)
  }
 
  if(gameOver) {
    obstacleList.forEach((obstacle) => {
      scene.remove(obstacle)
    })

    
  }

  console.log(gameOver)

  switch(state) {
    case "airborne":
      head.material.color.set(0x0000ff)
      frameCounter += 1;
      console.log(frameCounter)
      if(frameCounter > 300) {
        frameCounter = 0;
        state = "grounded";
        cooldown = true;
      }
      break;
    case "dodge":
      console.log("DODGE")
      head.material.color.set(0xffffff)
      frameCounter += 1;
      console.log(frameCounter)
      if(frameCounter > 300) {
        frameCounter = 0;
        state = "grounded";
        cooldown = true;
      }
      break;
    case "grounded":
      head.material.color.set(0xff0000)
      if(cooldown) {
        cooldownCounter += 1;
        if(cooldownCounter > 120) {
          cooldown = false;
          cooldownCounter = 0;
        }
      }
  }
  
  
  if(!gameOver) {
    switch(direction) {
      case "up":
        head.position.z -= speed
        break;
      case "right":
        head.position.x += speed
        break;
      case "down":
        head.position.z += speed
        break;
      case "left":
        head.position.x -= speed
        break;
    }
  }
  

  if(head.position.x > 14.5) 
    head.position.x = 14.5

  if(head.position.x < -14.5)
    head.position.x = -14.5

  if(head.position.z > 14.5)
    head.position.z = 14.5

  if(head.position.z < -14.5)
    head.position.z = -14.5

	renderer.render( scene, camera );
}

animate();

window.addEventListener("resize", ()=> {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
})

window.addEventListener("keydown", (pressed)=> {
  console.log
  switch(pressed.key) {
    case "ArrowUp": case "W": case "w":
      direction = "up";
      break;
    case "ArrowRight": case "D": case "d":
      direction = "right";
      break;
    case "ArrowDown": case "S": case "s":
      direction = "down";
      break;
    case "ArrowLeft": case "A": case "a":
      direction = "left";
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
})