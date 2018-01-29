function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
                            "keydown", key.downHandler.bind(key), false
                            );
    window.addEventListener(
                            "keyup", key.upHandler.bind(key), false
                            );

    return key;
}

var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    tab = keyboard(9);

var moveUp = 0,
    moveDown = 0,
    moveLeft = 0,
    moveRight = 0;

left.press = function() {
    moveLeft = 1;
};

left.release = function() {
};

right.press = function() {
    moveRight = 1;
};

right.release = function() {
};

up.press = function() {
    moveUp = 1;
};

up.release = function() {
};

down.press = function() {
    moveDown = 1;
};

down.release = function() {
};


tab.press = function() {
    changeBasis();
};





// A FUNCTION
function mouseDown(event) {
    //console.log(event);

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    // GUI

    // WORLD
    var worldX = mouse.x;
    var worldY = mouse.y;

    var a0 = new THREE.Vector3();
    a0.x = characterState[currentBasis].sprite.position.x;
    a0.y = characterState[currentBasis].sprite.position.y;
    a0.z = characterState[currentBasis].sprite.position.z;
    a0.applyMatrix4(camera.matrixWorldInverse);
    a0.applyMatrix4(camera.projectionMatrix);


    var up = worldY - a0.y;
    var ac = worldX - a0.x;
    if (Math.abs(up) > Math.abs(ac)) {
        if (worldY > a0.y) moveUp = true;
        if (worldY < a0.y) moveDown = true;
    } else {
        if (worldX > a0.x) moveRight = true;
        if (worldX < a0.x) moveLeft = true;
    }
}
