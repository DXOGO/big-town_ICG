// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
    control: null,
};

let car_colors = [0xFF0000, 0xFFFF00, 0x008000, 0x000080, 0xC0C0C0, 0xFFFFFF, 0x3C32A8, 0XFF9021];
let building_colors = [0xff0000, 0xff0059, 0xd000ff, 0x5d00ff, 0x0091ff, 0x00ff95, 0x3cff00, 0Xffcc00, 0xff6600];

helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false, keyShift = false, keyC = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
        case 16: //shift
            keyShift = true;
            break;
        case 67: //c
            keyC = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
        case 16: //shift
            keyShift = false;
            break;
        case 67: //c
            keyC = false;
            break;
    }
}

// Insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {
    // ************************** //
    // Create a ground plane
    // ************************** //
    const plane = createPlane(3200,4000);
    sceneGraph.add(plane);
    plane.name = "plane"

    const concrete = new THREE.Mesh(new THREE.PlaneGeometry(1180, 4000), new THREE.MeshStandardMaterial({color: 0x332e23, side : THREE.DoubleSide}));
    concrete.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    concrete.receiveShadow = true;
    concrete.position.set(810,5,0)


    sceneGraph.add(concrete);

     // ************************** //
    // Create roads and others
    // ************************** //

    sceneGraph.add(createRoad(3200, 150, -200, 0));
    sceneGraph.add(createRoad(150, 1950, 150, -1025));
    sceneGraph.add(createRoad(150, 1950, 150, 1025));
    sceneGraph.add(createBusStop())
    sceneGraph.add(createCrossWalk());

    const othercross = createCrossWalk();
    othercross.rotation.y = Math.PI/2;
    othercross.position.set(150,0,155);
    sceneGraph.add(othercross);

    const bus = createBus();
    sceneGraph.add(bus)
    bus.name = "bus"

    // ************************** //
    // Create vehicles
    // ************************** //

    const car = createCar(-1200, 5, 40);
    sceneGraph.add(car);
    // Name
    car.name = "car";

/*     sceneGraph.add(createMuscleCar(680, -1000));
    sceneGraph.add(createClassicCar(1120, -800));
    sceneGraph.add(createRedCar(660, 10)); */

    // ************************** //
    // Create trees
    // ************************** //

    for (var i = -100; i > -1000; i-=200){ sceneGraph.add(createTree(i)); }

    // ************************** //
    // Create lightposts
    // ************************** //

    for (var i = -1700; i <= 1200; i+=200){ sceneGraph.add(createPost(i, 0)); }

    for (var i = -2000; i <= 1900; i+=200){ 
        const post = createPost(0,i);
        post.rotation.y = - Math.PI/2
        post.position.x += 100;
        sceneGraph.add(post); 
    }

    // ************************** //
    // Create buildings and parking lot
    // ************************** //

    sceneGraph.add(createRoad(100, 240, 880, -190));

    for (var z= -1850; z < -100; z+= 300 ){ sceneGraph.add(createBuilding(-100, z)); }

    sceneGraph.add(createAnotherBuilding(-100, -1680))

    sceneGraph.add(createParkingLot());
    
/* sceneGraph.add(createShop1());
    sceneGraph.add(createShop2());
    sceneGraph.add(createUni()); */

    // ************************** //
    // Create football field
    // ************************** //
    const field = createField();
    field.position.z = -1500
    sceneGraph.add(field);

    /* for (var x = -700; x <= -300; x+=400){
        for (var z = -1800; z <= -1200; z+=600){
            sceneGraph.add(createBench(x, z));
        }
    } */

    // ************************** //
    // Create lake and decoration
    // ************************** //
    sceneGraph.add(createLake());
   /*  sceneGraph.add(createBridge());
   const rst = createOtherStatue();
   rst.rotation.y = - Math.PI / 3
   rst.position.set(-850, 0, -280)
   sceneGraph.add(rst);

   const lst = createOtherStatue();
   lst.rotation.y = Math.PI / 3
   lst.position.set(-850, 0, -720)
   sceneGraph.add(lst); */

   // sceneGraph.add(createRock());
  

    // ************************** //
    // Create sun and moon
    // ************************** //

    // create sun and add pivot light
    const sun = createSun(0, 2800, 0);
    sceneGraph.add(sun);

    const sunPivot = new THREE.Object3D();
    sunPivot.add(sceneElements.sceneGraph.getObjectByName("sunlight"));
    sunPivot.add(sun);
    sceneElements.sceneGraph.add(sunPivot)
    sunPivot.name="sunPivot"

    // create moon and add pivot light
    const moon = createMoon(0, -2400, 0);
    sceneGraph.add(moon);

    const moonPivot = new THREE.Object3D();
    moonPivot.add(sceneElements.sceneGraph.getObjectByName("moonlight"));
    moonPivot.add(moon);
    sceneElements.sceneGraph.add(moonPivot)
    moonPivot.name="moonPivot"

    const airplane = createAirPlane();
    airplane.rotation.y = Math.PI / 2
    airplane.name = 'airplane'
    sceneGraph.add(airplane)
}

const star_vertices = [];

for ( let i = 0; i < 50000; i ++ ) {
    const x = THREE.MathUtils.randFloatSpread( 10000 );
    const y = THREE.MathUtils.randFloatSpread( 10000 );
    const z = THREE.MathUtils.randFloatSpread( 5000 ); + 10000 
    star_vertices.push( x, y, z );

}
// stars
const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( star_vertices, 3 ) );
let stars = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0xffffff } ) );

function computeFrame() {

    const car = sceneElements.sceneGraph.getObjectByName("car");

    // if 'c' is pressed, change to car pov
  /*   if (keyC) { 
        sceneElements.control = false;
        const cameraOffset = new THREE.Vector3(-300, 150.0, 0); // NOTE Constant offset between the camera and the target

        // NOTE Assuming the camera is direct child of the Scene
        const carPosition = new THREE.Vector3();
        car.getWorldPosition(carPosition);

        sceneElements.camera.position.copy(carPosition).add(cameraOffset);
        sceneElements.camera.lookAt(car.position.x+500, car.position.y+30, car.position.z); 
    }  */

    const helice = sceneElements.sceneGraph.getObjectByName("helice");
    helice.rotation.x += 120

    const airplane = sceneElements.sceneGraph.getObjectByName("airplane");
    airplane.rotation.y += 0.015;

    const duck = sceneElements.sceneGraph.getObjectByName("duck");
    duck.rotation.y-=0.01;

    const sun = sceneElements.sceneGraph.getObjectByName("sun");
    const worldPosition = new THREE.Vector3();
    const sunpos = sun.getWorldPosition( worldPosition );

    // otherbuilding lights
    const otherbuildinglight1 = sceneElements.sceneGraph.getObjectByName("otherbuildinglight1");
    const otherbuildinglight2 = sceneElements.sceneGraph.getObjectByName("otherbuildinglight2");

    // turn off car lights when day
    const bulblight1 = sceneElements.sceneGraph.getObjectByName("light1");
    const bulblight2 = sceneElements.sceneGraph.getObjectByName("light2");

    // get sunlight
    const sunlight = sceneElements.sceneGraph.getObjectByName("sunlight");

    // field lights
    const fl1 = sceneElements.sceneGraph.getObjectByName("light440")
    const fl2 = sceneElements.sceneGraph.getObjectByName("light-440")

    let post_lights = []
    // post lights
    for(var i = -1700; i <= 1200; i+=200){
        var p = 'postlight'.concat(i);
        p = sceneElements.sceneGraph.getObjectByName("postlight"+i);
        post_lights.push(p);
    }

    for (var i = -2000; i <= 1900; i+=200){ 
        var p = 'postlight'.concat(i);
        p = sceneElements.sceneGraph.getObjectByName("postlight"+i);
        post_lights.push(p);
    }

    let building_lights = []
    // post lights
    for (var i= -1850; i < -100; i+= 300 ){
        var b = 'buildinglight'.concat(i);
        b = sceneElements.sceneGraph.getObjectByName("buildinglight"+i);
        building_lights.push(b);
    }
    
    /* var r = building_colors[Math.floor(Math.random()*building_colors.length)];

    const rgb1 = sceneElements.sceneGraph.getObjectByName("rgb1");
    createjs.Tween.get(rgb1.material.color).to(new THREE.Color(r)) 

    const rgb2 = sceneElements.sceneGraph.getObjectByName("rgb2");
    createjs.Tween.get(rgb2.material.color).to(new THREE.Color(r)) 
    
    // if its day
     if (sunpos.y > 0) {

        sceneElements.sceneGraph.remove(stars)

        createjs.Tween.get(sceneElements.sceneGraph.background).to(new THREE.Color(0x91c3ed), 1200)
        createjs.Tween.get(sceneElements.sceneGraph.fog).to(new THREE.Fog(0xffe680, 2500, 12000))
        
        for (var i in post_lights){ post_lights[i].intensity = 0; }
        for (var i in building_lights){ building_lights[i].intensity = 0; }

        bulblight1.intensity = 0;
        bulblight2.intensity = 0;
        otherbuildinglight1.intensity = 0;
        otherbuildinglight2.intensity = 0;
        sunlight.intensity = 1;
        fl1.intensity = 0;
        fl2.intensity = 0;

    } else {    // night

        sceneElements.sceneGraph.add(stars);

        createjs.Tween.get(sceneElements.sceneGraph.background).to(new THREE.Color(0x090f14), 1200)
        createjs.Tween.get(sceneElements.sceneGraph.fog).to(new THREE.Fog(0x1e2733, 1000, 10000))

        for (var i in post_lights){ post_lights[i].intensity = 2.8; }
        for (var i in building_lights){ building_lights[i].intensity = 1; }
        
        sunlight.intensity = 0;
        bulblight1.intensity = 2.2;
        bulblight2.intensity = 2.2;
        otherbuildinglight1.intensity = 1.5;
        otherbuildinglight2.intensity = 1.5;
        fl1.intensity = 1.6;
        fl2.intensity = 1.6;
    }

    // rotate sun and moon light
    const lightSun = sceneElements.sceneGraph.getObjectByName("sunPivot");
    const lightMoon = sceneElements.sceneGraph.getObjectByName("moonPivot");
    lightSun.rotation.x -= 0.005;
    lightMoon.rotation.x -= 0.005; */

    var disp;

    const bus = sceneElements.sceneGraph.getObjectByName("bus");

    if (bus.position.z > -2820){  
        if (bus.position.z == 0)  {
            // stop
            setTimeout(function(){bus.position.z -=0.1 }, 5000); //wait 5 seconds
        } else { 
            bus.position.z -= 10;
        }

    }  else { 
        const currz = bus.position.z; 
        if (currz <= -2820){ bus.position.set(0, 0, 1000)}
    }

    // CONTROLING THE CAR WITH THE KEYBOARD
    if (car.position.x < 1340 && car.position.x > -1740 && car.position.z < 1940  && car.position.z > -1940){

        if (keyShift){ disp=18; } else { disp=10; }

        if (keyW) { 
            car.translateX(disp*1.2);
        }
        if (keyA) {
            car.rotation.y += 0.1;
            car.translateZ(-disp);
            car.translateX(disp);
        }
        if (keyS) {
            car.translateX(-disp*1.2);
        }
        if (keyD) {
            car.rotation.y -= 0.1;
            car.translateZ(disp);
            car.translateX(disp);
        }

    } else {
        const currx = car.position.x;
        const currz = car.position.z;

        if (currx >= 1340){ car.position.set( (-currx-400 ) +3.51, 0, currz ) } 
        if (currx <= -1740) { car.position.set( (-currx-400 ) -3.51, 0, currz )  }
        if (currz >= 1940){ car.position.set( currx, 0, -currz+3.51 )  } 
        if (currz <= -1940) { car.position.set( currx, 0, -currz-3.51 )  }
    }

    var r = car_colors[Math.floor(Math.random()*car_colors.length)];

    car.on('click', function(ev) {});    
    const car_main = sceneElements.sceneGraph.getObjectByName("car_main");
    sceneElements.sceneGraph.on('click', ev => {
        car_main.material.color.setHex(r);
    })

    // Rendering
    helper.render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}