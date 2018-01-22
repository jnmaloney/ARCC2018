/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	var frustumSize = 1000;
	camera = new THREE.OrthographicCamera( frustumSize * ASPECT / - 2, frustumSize * ASPECT / 2, frustumSize / 2, frustumSize / - 2, 1e1, 1e5 );
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
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	////////////
	// CUSTOM //
	////////////
	
	var ballTexture = THREE.ImageUtils.loadTexture( 'images/redball.png' );
	var crateTexture = THREE.ImageUtils.loadTexture( 'images/Box.png' );
	var charTexture = THREE.ImageUtils.loadTexture( 'images/character pink girl sm.png' );
	
	var ballMaterial = new THREE.SpriteMaterial( { map: ballTexture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft  } );
	var sprite = new THREE.Sprite( ballMaterial );
	sprite.position.set( 50, 50, 0 );
	sprite.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite );
	
	var ballMaterial = new THREE.SpriteMaterial( { map: ballTexture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.bottomRight } );
	var sprite = new THREE.Sprite( ballMaterial );
	sprite.position.set( window.innerWidth - 50, window.innerHeight - 50, 0 );
	sprite.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite );
		
    var crateMaterial1 = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xff8888 } );
 	var crateMaterial2 = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0x00ffff } );
   	var crateMaterial3 = new THREE.SpriteMaterial( { map: crateTexture, useScreenCoordinates: false, color: 0xff8888 } );
   	var charMaterial = new THREE.SpriteMaterial( { map: charTexture, useScreenCoordinates: false } );
		
	createSprite( -100, 0, crateMaterial1 );
	createSprite( 0, 0, crateMaterial2 );
	createSprite( 100, 0, crateMaterial3 );
	
	createSprite( -120, -200, charMaterial );
	
}


function createSprite(x, y, material) {

	var sprite = new THREE.Sprite( material );
	sprite.position.set( x, 50, y );
	sprite.scale.set( 0.064, 0.064, 1.0 ); // imageWidth, imageHeight
	scene.add( sprite );

}


function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
	{ 
		// do something
	}
	
	controls.update();
	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}

