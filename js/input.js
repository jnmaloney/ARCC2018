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




