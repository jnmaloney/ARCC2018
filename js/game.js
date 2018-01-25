// MAIN

// standard global variables
var container, scene, camera, renderer;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var character = { x: 45, y: 45, sprite: undefined };
var room = [];
var tiles = [];
var w = 100;
var h = 100;
var materials = [];


var characterState = [character];
var currentBasis = 0;

// SOME QUANTUM STUFF
var beamSplit() {
    var a = { x: character.x, y: character.y, sprite: undefined, basis: 0 };
    var b = { x: character.x, y: character.y, sprite: undefined, basis: 1 };
    characterState = [a, b];
}


var beamCombine() {
    characterState = [character];
    currentBasis = 0;
}


function checkBeamSplit(i, j) {
    var t = 100 * i + j;
    var n = mapLayers[t];
    if (n == 1) return true;
    return false;
}


function changeBasis() { 

    currentBasis = (currentBasis + 1) % (characterState.length);

}



// - - - - 
init();
animate();


// SOMETHING
function MapObjectFactory(i, j, t) {
    var box = {};
    var m = materials[t % 3]; 
    
    var x = i;
    var y = j;
    
    box.sprite = createSprite(x * 50, y * 50, m); 
    box.move = (t == 1);
    box.pos = [i, j];
    box.col = t;
    
    var t = (x) * w + (y);
    room[t] = box;
    
    return box;
}


// A FUNCTION
function mouseDown(event) {
    //console.log(event);
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    // GUI

    // WORLD
    var worldX = mouse.x;
    var worldY = mouse.y;
    
    var a = character.sprite.position;
    a.applyMatrix4(camera.matrixWorldInverse);
    a.applyMatrix4(camera.projectionMatrix);
    console.log(a);
    
    
    //var proj = toScreenPosition(character.sprite.position);
    
    var up = worldY - a.y;
    var ac = worldX - a.x;
    if (Math.abs(up) > Math.abs(ac)) {
        if (worldY > a.y) moveUp = true;
        if (worldY < a.y) moveDown = true;
    } else {
        if (worldX > a.x) moveRight = true;
        if (worldX < a.x) moveLeft = true;
    }
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
	camera.position.set(0,4000,4000);
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
	materials[11] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x535376 } );
	materials[12] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x00ffff } );
	materials[13] = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide, color: 0x6666ff } );
	//var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);

	
	////////////
	// CUSTOM //
	////////////
	
	var crateTexture = THREE.ImageUtils.loadTexture( 'images/Box.png' );
	var charTexture = THREE.ImageUtils.loadTexture( 'images/character pink girl sm.png' );
		
    materials[0] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xffffff } );
   	materials[1] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x535376 } ); // Wall
   	materials[2] = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x00ffff } ); 

   	var charMaterial = new THREE.SpriteMaterial( { map: charTexture, useScreenCoordinates: false } );		
	
	character.sprite = 
	    createSprite( -1, -1, charMaterial );
    var x = character.x * 50;
    var y = character.y * 50;
    character.sprite.position.set( x, 50, y );
	
	
	doSetup('untitled.json');
}


function createBox(x, y, material) {
     
    // Create sprite
    var m = materials[material % 3]; 
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
    if (q != undefined) console.log(j + ' ' + q + ' ' + room[j].col);
    if (q == room[j].col) {
        blockDrop(x1, y1);
    }
}


function squareColour(i, j) {
    var t = i * 100 + j;
    return mapLayers[t] % 3;
}


function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
    // Movement and shifting 

    var newX = character.x, 
        newY = character.y;
        
    var overX = character.x, 
        overY = character.y;

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
    
    if (character.x == newX &&
        character.y == newY) return;
    
    if (checkSpace(newX, newY) == undefined) {
        character.x = newX;
        character.y = newY;
                    
    } else if (checkSpace(newX, newY).move) {
    } else {
        if (checkSpace(overX, overY) == undefined) {
            pushTo(newX, newY, overX, overY);
            character.x = newX;
            character.y = newY;
        }
    }
    
    // Check new space (and one after it)
    // 1. move
    // 2. move and push
    // 3. cancel move
    
    var x = character.x * 50;
    var y = character.y * 50;
    character.sprite.position.set( x, 50, y );
    
    checkBeamSplit(character.x, character.y);


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
                MapObjectFactory(i, j, data[t] % 3);
            }
            
            var floorTile = data1[t];
            if (floorTile > 0) console.log(t);
            
            var floorGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	        var floor = new THREE.Mesh(floorGeometry, materials[10 + (floorTile % 4)]);
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

