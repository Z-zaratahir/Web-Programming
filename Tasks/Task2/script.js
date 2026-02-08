let box = document.getElementById("box");
let position = 0;
let direction = 1; // 1 = right, -1 = left
let intervalId = null;
let speed = 2; // pixels per frame
let intervalTime = 10; // milliseconds

function toggleMove() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        return;
    }

    intervalId = setInterval(() => {
        position += direction * speed;

        if (position >= 450) {
            direction = -1;
        } else if (position <= 0) {
            direction = 1;
        }

        box.style.left = position + "px";
    }, intervalTime);
}

function speedUp() {
    speed += 1;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        toggleMove(); // Restart with new speed
    }
}

function slowDown() {
    if (speed > 1) {
        speed -= 1;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            toggleMove(); // Restart with new speed
        }
    }
}
