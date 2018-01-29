// MAIN

// standard global variables
var container, scene, camera, renderer;
var cameraOffset = new THREE.Vector3(0, 4000, 4000);
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var character = { x: 45, y: 45, sprite: undefined };
var a = { x: character.x, y: character.y, sprite: undefined, basis: 0 };
var b = { x: character.x, y: character.y, sprite: undefined, basis: 1 };

var room = [];
var tiles = [];
var w = 100;
var h = 100;
var materials = [];


var characterState = [character];
var currentBasis = 0;

var transitions = [];


// TRANSITION ANIMATION
function startTransition(obj, to, time) {

    var t = clock.getElapsedTime();
    transition = {
        object: obj,
        origin: obj.position,
        target: to,
        t0: t,
        t1: t + time,
    };

    transitions.push(transition);
}


function doTransitions() {
//clock.update();
    var t = clock.getElapsedTime();
    var t0;
    var tf;
    var x0, y0, z0;
    var x1, y1, z1;

    var w0, w1;

    var flags = [];

    for (var i in transitions) {

        t0 = transitions[i].t0;
        tf = transitions[i].t1;

        x0 = transitions[i].origin.x;
        y0 = transitions[i].origin.y;
        z0 = transitions[i].origin.z;

        x1 = transitions[i].target.x;
        y1 = transitions[i].target.y;
        z1 = transitions[i].target.z;

        if (t > tf) {
            w0 = 0;
            w1 = 1;
            // Remove
            flags[i] = true;
        } else {
            w0 = (t - t0) / (tf - t0);
            w1 = 1.0 - w0;
        }
        var x = w0 * x0 + w1 * x1;
        var y = w0 * y0 + w1 * y1;
        var z = w0 * z0 + w1 * z1;

        // Set position
        transitions[i].object.position.set(x, y, z);

        // Remove flags
        for (var i in flags) {
            if (flags[i]) {
                transitions.splice(i, 1);
            }
        }
    }
}




// SOME QUANTUM STUFF
function beamSplit() {

    if (characterState.length > 1) return;

    a.x = character.x;
    a.y = character.y;

    b.x = character.x;
    b.y = character.y;

    a.sprite.position.set(a.x * 50, 50, a.y * 50);
    b.sprite.position.set(b.x * 50, 50, b.y * 50);

    characterState = [a, b];

    ui_update();
    scene.remove(character.sprite);
    scene.add(a.sprite);
    scene.add(b.sprite);

}


function beamCombine() {
    characterState = [character];
    currentBasis = 0;

    ui_update();
    scene.remove(a.sprite);
    scene.remove(b.sprite);
    scene.add(character.sprite);
}


function checkBeamSplit(i, j) {
    if (characterState.length > 1) return;
    var t = 100 * j + i;
    var n = mapLayers[t];

    if (n == 1) return true;
    return false;
}


function checkBeamCombine(i, j) {
    if (characterState.length < 2) return;
            var t = 100 * j + i;
            var n = mapLayers[t];
            if (n != 1) return;
    if (a.x == b.x && a.y == b.y) {
        beamCombine();
    }
}


function changeBasis() {


            // Camera set up
            var controlCharacter = characterState[currentBasis];
            var dx = camera.position.x - controlCharacter.x * 50;
            var dy = camera.position.y;
            var dz = camera.position.z - controlCharacter.y * 50;


    currentBasis = (currentBasis + 1) % (characterState.length);

    ui_update();




    // The camera update
    controlCharacter = characterState[currentBasis];
    var x = controlCharacter.x * 50;
    var y = controlCharacter.y * 50;
    camera.position.set(dx + x, dy, dz + y);

}


// QUANTUM UI
var stateSprite0,
    stateSprite1,
    stateSprite2,
    stateSprite1a,
    stateSprite2a;

function ui_init() {

    var ballTexture = THREE.ImageUtils.loadTexture( 'images/state.png' );
    var ballTexture_a = THREE.ImageUtils.loadTexture( 'images/state_a.png' );

	var ballMaterial0 = new THREE.SpriteMaterial( { map: ballTexture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, color: 0xbfbfbf  } );
	var ballMaterial1 = new THREE.SpriteMaterial( { map: ballTexture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, color: 0xef1d1d  } );
	var ballMaterial2 = new THREE.SpriteMaterial( { map: ballTexture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, color: 0x1def1d  } );
	var ballMaterial1a = new THREE.SpriteMaterial( { map: ballTexture_a, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, color: 0xef1d1d  } );
	var ballMaterial2a = new THREE.SpriteMaterial( { map: ballTexture_a, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft, color: 0x1def1d  } );


	stateSprite0 = new THREE.Sprite( ballMaterial0 );
	stateSprite0.position.set( 55, 25, 0 );
	stateSprite0.scale.set( 66, 36, 1.0 ); // imageWidth, imageHeight
    scene.add(stateSprite0);

	stateSprite1 = new THREE.Sprite( ballMaterial1 );
	stateSprite1.position.set( 55, 25, 0 );
	stateSprite1.scale.set( 66, 36, 1.0 ); // imageWidth, imageHeight

	stateSprite2 = new THREE.Sprite( ballMaterial2 );
	stateSprite2.position.set( 155, 25, 0 );
	stateSprite2.scale.set( 66, 36, 1.0 ); // imageWidth, imageHeight

	stateSprite1a = new THREE.Sprite( ballMaterial1a );
	stateSprite1a.position.set( 55, 25, 0 );
	stateSprite1a.scale.set( 66, 36, 1.0 ); // imageWidth, imageHeight

	stateSprite2a = new THREE.Sprite( ballMaterial2a );
	stateSprite2a.position.set( 155, 25, 0 );
	stateSprite2a.scale.set( 66, 36, 1.0 ); // imageWidth, imageHeight
}


function ui_update() {

    scene.remove(stateSprite0);
    scene.remove(stateSprite1);
    scene.remove(stateSprite2);
    scene.remove(stateSprite1a);
    scene.remove(stateSprite2a);

    if (characterState.length == 1) {
        scene.add(stateSprite0);
    } else if (currentBasis == 0) {
        scene.add(stateSprite1);
        scene.add(stateSprite2a);
    } else {
        scene.add(stateSprite1a);
        scene.add(stateSprite2);
    }
}

// - - - -
init();
animate();
ui_init();


// SOMETHING
function MapObjectFactory(i, j, t) {
    var box = {};
    var m = materials[t % 6];

    var x = i;
    var y = j;

    box.sprite = createSprite(x * 50, y * 50, m);
    box.move = (t == 4);
    box.pos = [i, j];
    box.col = t;

    var t = (x) * w + (y);
    room[t] = box;

    return box;
}


// PROJ
function toScreenPosition(vector)
{
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
};


// FUNCTIONS
function init()
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1e1, FAR = 1e5;
	var frustumSize = 1000;
	camera = new THREE.OrthographicCamera( frustumSize * ASPECT / - 2, frustumSize * ASPECT / 2, frustumSize / 2, frustumSize / - 2, NEAR, FAR );
	scene.add(camera);
	camera.position.set(0, 4000, 4000); // ? cameraOffset + scene.position ?
	camera.lookAt(scene.position);
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

    container.addEventListener("mousedown", function (e) {
            mouseDown(e);
        }, false);
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	//floorTexture.repeat.set( 1, 1 );
	materials[10] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	materials[11] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0xff4444 } );
	materials[12] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x00ffff } );
	materials[13] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x6666ff } );
	materials[14] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x535376 } );
    materials[15] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0xff0f00 } );

	////////////
	// CUSTOM //
	////////////

	var crateTexture = THREE.ImageUtils.loadTexture( 'images/Box.png' );
	var charTexture = THREE.ImageUtils.loadTexture( 'images/character pink girl sm.png' );

    materials[0] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xffffff } );
   	materials[1] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xff4444 } ); // Wall
   	materials[2] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x00ffff } );
   	materials[3] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x6666ff } );
   	materials[4] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x535376 } );
    materials[5] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xff0f00 } );

   	var charMaterial = new THREE.SpriteMaterial( { map: charTexture, useScreenCoordinates: false } );

	character.sprite =
	    createSprite( -1, -1, charMaterial );
    var x = character.x * 50;
    var y = character.y * 50;
    character.sprite.position.set( x, 50, y );

	var charMaterial1 = new THREE.SpriteMaterial( { map: charTexture, useScreenCoordinates: false, color: 0xef1d1d } );
	var charMaterial2 = new THREE.SpriteMaterial( { map: charTexture, useScreenCoordinates: false, color: 0x1def1d } );
	a.sprite = createSprite( -1, -1, charMaterial1 );
	b.sprite = createSprite( -1, -1, charMaterial2 );


	doSetup('level2.json');
}


function createBox(x, y, material) {

    // Create sprite
    var m = materials[material % 6];
    var s = createSprite(x * 50, y * 50, m);

    // Insert block
    var i = (x) * w + (y);
    room[i] = s;
}


function createSprite(x, y, material) {

	var sprite = new THREE.Sprite( material );
	sprite.position.set( x, 50, y );
	sprite.scale.set( 0.064, 0.064, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite );
    return sprite;
}


function checkSpace(x, y) {
    var i = (x) * w + (y);
    return room[i];

}


function pushTo(x0, y0, x1, y1) {
    var i = (x0) * w + (y0);
    var j = (x1) * w + (y1);
    room[j] = room[i];
    room[i] = undefined;

    var x = x1 * 50;
    var y = y1 * 50;
    // TODO Move sprite
    room[j].sprite.position.set( x, 50, y );

    // Check objective
    var q = squareColour(y1, x1); // ?
    //if (q != undefined) console.log(j + ' ' + q + ' ' + room[j].col);
    if (q == room[j].col) {
        blockDrop(x1, y1);
    }
}


function squareColour(i, j) {
    var t = i * 100 + j;
    return mapLayers[t] % 6;
}


function animate()
{
    requestAnimationFrame( animate );
	render();
  doTransitions();
	update();
}

function update()
{
    // Movement and shifting

    var controlCharacter = characterState[currentBasis];

    var newX = controlCharacter.x,
        newY = controlCharacter.y;

    var overX = controlCharacter.x,
        overY = controlCharacter.y;

    if (transitions.length == 0) {

      if (moveLeft) {
          newX -= 1;
          overX -= 2;
          moveLeft = 0;
      }
      if (moveRight) {
          newX += 1;
          overX += 2;
          moveRight = 0;
      }
      if (moveUp) {
          newY -= 1;
          overY -= 2;
          moveUp = 0;
      }
      if (moveDown) {
          newY += 1;
          overY += 2;
          moveDown = 0;
      }
    }

    // The camera update
    //camera.position.set( x + cameraOffset.x, cameraOffset.y, y + cameraOffset.z );
    camera.position.set(controlCharacter.sprite.position.x + 0, 4000, controlCharacter.sprite.position.z + 4000 );

    // No logic if not moving
    if (controlCharacter.x == newX &&
        controlCharacter.y == newY) return;

    // Check new space (and one after it)
    // 1. move
    // 2. move and push
    // 3. cancel move

    if (checkSpace(newX, newY) == undefined) {
        // FREE SPACE
        controlCharacter.x = newX;
        controlCharacter.y = newY;

        var p1 = { x: newX*50, y: 50, z: newY*50 };
        startTransition(controlCharacter.sprite, p1, 0.15);

    } else if (checkSpace(newX, newY).move) {
        // WALL
    } else {
        if (checkSpace(overX, overY) == undefined) {
            // PUSHABLE SPACE
            pushTo(newX, newY, overX, overY);
            controlCharacter.x = newX;
            controlCharacter.y = newY;

            var p1 = { x: newX*50, y: 50, z: newY*50 };
            startTransition(controlCharacter.sprite, p1, 0.15);
        }
    }

    // Stepping on a splitter
    if (checkBeamSplit(controlCharacter.x, controlCharacter.y)) {
        beamSplit();
    } else {
         // Check quantum tile
        checkBeamCombine(controlCharacter.x, controlCharacter.y);
    }


	if ( keyboard.pressed("z") )
	{
		// do something
	}
}

function render()
{
	renderer.render( scene, camera );
}

//-------------------------------------------------------------------------
// Block Drop
//-------------------------------------------------------------------------
function blockDrop(i, j) {
    var t = i * 100 + j;

    // Move sprite
    var x = room[t].sprite.position.x;
    var y = room[t].sprite.position.z;
    room[t].sprite.position.set( x, 0, y );

    // Remove pushable block from game board
    room[t] = undefined;

    // Move floor
    var x = tiles[t].position.x;
    var y = tiles[t].position.z;
    tiles[t].position.set( x, -50, y );
}

  //-------------------------------------------------------------------------
  // LOAD THE MAP
  //-------------------------------------------------------------------------

  function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if ((request.readyState == 4) && (request.status == 200))
        onsuccess(request);
    }
    request.open("GET", url, true);
    request.send();
  }

  function doSetup(mapname) {

    get(mapname, function(req) {
      setup(JSON.parse(req.responseText));
      //setState(state_game);
    });

  }

  var mapLayers = undefined;
  function setup(map) {

    var data    = map.layers[0].data;
    var data1   = map.layers[1].data;
    mapLayers = data1;

    for (var i = 0; i < 100; ++i) {
        for (var j = 0; j < 100; ++j) {
            var t = j * 100 + i;
            if (data[t] && data[t] > 1) {
                MapObjectFactory(i, j, data[t] % 6);
            }

            var floorTile = data1[t];

            var floorGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	        var floor = new THREE.Mesh(floorGeometry, materials[10 + (floorTile % 6)]);
	        floor.position.x = (i)*50;
	        floor.position.y = -0.5;
	        floor.position.z = (j)*50 - 25;
	        floor.rotation.x = Math.PI / 2;
	        scene.add(floor);
	        tiles.push(floor);
        }
    }

    camera.position.x += 50 * 50;
    camera.position.z += 50 * 50;
  }
