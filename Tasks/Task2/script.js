// DOM Elemnt Selction using modern JavaScritp methods
const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game-container');
const startGameBtn = document.getElementById('start-game-btn');
const gameArea = document.querySelector('#game-area');
const bow = document.getElementById('bow');
const target = document.getElementById('target');
const arrowContainer = document.getElementById('arrow-container');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const arrowCountDisplay = document.getElementById('arrow-count');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Game State Variabels
let scor = 0;
let timelft = 60;
let arrowsRemaning = 11;
let gameovr = false;
let timerIntrvl = null;
let targetMoveIntrvl = null;

// Target Movment Variables (dynamc difficulty)
let targetSpd = 2;
let targetDirctn = { x: 1, y: 1 };
let targetSiz = 150;

// Arrows stuck on targt array
let stuckArrows = [];

// Constans for calculatoins
const BOW_POSITON = { x: 250, y: window.innerHeight / 2 };
const ARROW_SPD = 8;

// Get preloaded hit sound element
let hitSound;

// Responsiv adjustmnt based on scren size
const getResponsiveValues = () => {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
        return {
            targetMinX: screenWidth / 2,
            targetMaxX: screenWidth - 100,
            targetMinY: 100,
            targetMaxY: window.innerHeight - 100
        };
    } else if (screenWidth <= 768) {
        return {
            targetMinX: screenWidth / 2,
            targetMaxX: screenWidth - 150,
            targetMinY: 100,
            targetMaxY: window.innerHeight - 150
        };
    } else {
        return {
            targetMinX: screenWidth / 2,
            targetMaxX: screenWidth - 300,
            targetMinY: 100,
            targetMaxY: window.innerHeight - 200
        };
    }
};

// Initalize Game
const initGame = () => {
    resetGameStat();
    startTimr();
    moveTargt();
    attachEventListners();
};

// Reset Game Stat
const resetGameStat = () => {
    scor = 0;
    timelft = 60;
    arrowsRemaning = 11;
    gameovr = false;
    targetSpd = 2;
    targetSiz = 150;
    stuckArrows = [];
    
    updateScor(0);
    updateTim();
    updateArrowCont();
    
    gameOverScreen.classList.add('hidden');
    arrowContainer.innerHTML = '';
    
    // Rset target siz
    target.style.width = targetSiz + 'px';
    target.style.height = targetSiz + 'px';
};

// Start Timr - counts down evry second
const startTimr = () => {
    if (timerIntrvl) clearInterval(timerIntrvl);
    
    timerIntrvl = setInterval(() => {
        if (gameovr) {
            clearInterval(timerIntrvl);
            return;
        }
        
        timelft--;
        updateTim();
        
        if (timelft <= 0) {
            endGme();
        }
    }, 1000);
};

// Updat Time Display
const updateTim = () => {
    timeDisplay.textContent = timelft;
    
    // Chnge color when time is runing out
    if (timelft <= 10) {
        timeDisplay.style.color = '#FF6347';
    } else {
        timeDisplay.style.color = '#F0E68C';
    }
};

// Updat Score Dispaly
const updateScor = (points) => {
    scor += points;
    scoreDisplay.textContent = scor;
};

// Updat Arrow Count Display
const updateArrowCont = () => {
    arrowCountDisplay.textContent = arrowsRemaning;
};

// Move Targt - continuosly moves within game are
const moveTargt = () => {
    if (targetMoveIntrvl) clearInterval(targetMoveIntrvl);
    
    // Get responsiv boundaries
    const bounds = getResponsiveValues();
    
    // Inital random pozition at midlle right
    let targetX = window.innerWidth - 300;
    let targetY = window.innerHeight / 2;
    
    target.style.left = targetX + 'px';
    target.style.top = targetY + 'px';
    
    targetMoveIntrvl = setInterval(() => {
        if (gameovr) {
            clearInterval(targetMoveIntrvl);
            return;
        }
        
        // Updat position
        targetX += targetDirctn.x * targetSpd;
        targetY += targetDirctn.y * targetSpd;
        
        // Bounc off walls using responsiv boundaries
        if (targetX <= bounds.targetMinX || targetX >= bounds.targetMaxX) {
            targetDirctn.x *= -1;
        }
        if (targetY <= bounds.targetMinY || targetY >= bounds.targetMaxY) {
            targetDirctn.y *= -1;
        }
        
        // Aply new position
        target.style.left = targetX + 'px';
        target.style.top = targetY + 'px';
        
        // Mov stuck arrows with targt
        updateStuckArrowsPositon();
    }, 20);
};

// Updat stuck arrows positon to move with targt
const updateStuckArrowsPositon = () => {
    const targetRect = target.getBoundingClientRect();
    
    stuckArrows.forEach(arrowData => {
        const newX = targetRect.left + arrowData.ofsetX;
        const newY = targetRect.top + arrowData.ofsetY;
        
        arrowData.elemnt.style.left = newX + 'px';
        arrowData.elemnt.style.top = newY + 'px';
        arrowData.elemnt.style.transform = `rotate(${arrowData.angl}deg)`;
    });
};

// Increas Difficulty - makes game hardr based on scor
const increasDifficulty = () => {
    // Increas target spd
    if (targetSpd < 8) {
        targetSpd += 0.5;
    }
    
    // Decreas target siz
    if (targetSiz > 80) {
        targetSiz -= 10;
        target.style.width = targetSiz + 'px';
        target.style.height = targetSiz + 'px';
    }
    
    // Restat target movment with new speed
    moveTargt();
};
/* Ar/////////////////////// */
// Rotat Bow based on Mous Position
const rotatBow = (event) => {
    if (gameovr) return;
    
    const bowRect = bow.getBoundingClientRect();
    const bowCenterX = bowRect.left + bowRect.width / 2;
    const bowCenterY = bowRect.top + bowRect.height / 2;
    
    const angleRad = Math.atan2(event.clientY - bowCenterY, event.clientX - bowCenterX);
    const angleDeg = angleRad * (180 / Math.PI);
    
    // Rotat bow corectly - adjust for image orientaton
    bow.style.transform = `translateY(-50%) rotate(${angleDeg + 60}deg)`;
};

// Shoot Arw - creates and animats arrow
const shootArw = (event) => {
    // Prevnt shooting if gam is over or no arrows lft
    if (gameovr || arrowsRemaning <= 0) return;
    
    // Dont shoot if clicking on UI elemnts
    if (event.target.closest('#game-header') || 
        event.target.closest('#instructions')) {
        return;
    }
    
    arrowsRemaning--;
    updateArrowCont();
    
    // Chek if out of arrows
    if (arrowsRemaning <= 0 && timelft > 0) {
        setTimeout(() => {
            if (!gameovr) endGme();
        }, 1000);
    }
    
    // Creat arrow elemnt
    const arw = document.createElement('div');
    arw.className = 'arrow';
    arw.innerHTML = '<img src="Images/arrow.png" alt="Arrow">';
    
    // Position arw at bow center
    const bowRect = bow.getBoundingClientRect();
    const startX = bowRect.left + bowRect.width / 2;
    const startY = bowRect.top + bowRect.height / 2;
    
    arw.style.left = startX + 'px';
    arw.style.top = startY + 'px';
    /* Ar/////////////////////// */
    // Calculat angle and directon
    const angleRad = Math.atan2(event.clientY - startY, event.clientX - startX);
    const angleDeg = angleRad * (180 / Math.PI);
    arw.style.transform = `rotate(${angleDeg - 25}deg)`;
    
    arrowContainer.appendChild(arw);
    /* Ar/////////////////////// */
    // Animat arrow movment
    animatArrow(arw, startX, startY, angleRad, angleDeg - 25);
};

// Animat Arrow Movment
const animatArrow = (arw, startX, startY, angle, angleDeg) => {
    let currentX = startX;
    let currentY = startY;
    
    const moveIntrvl = setInterval(() => {
        currentX += Math.cos(angle) * ARROW_SPD;
        currentY += Math.sin(angle) * ARROW_SPD;
        
        arw.style.left = currentX + 'px';
        arw.style.top = currentY + 'px';
        
        // Chek collison with target
        if (checkCollison(arw, target)) {
            clearInterval(moveIntrvl);
            handleHt(currentX, currentY, arw, angleDeg);
        }
        
        // Remov arrow if out of boundz
        if (currentX < 0 || currentX > window.innerWidth || 
            currentY < 0 || currentY > window.innerHeight) {
            clearInterval(moveIntrvl);
            arw.remove();
        }
    }, 16);
};

// Chek Collison between arrow and targt
const checkCollison = (arw, target) => {
    const arrowRect = arw.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    // Shrink target collision area by 25% to make hit detection more precise
    const hitMargin = 5; // pixels to shrink from each side
    const targetHitBox = {
        left: targetRect.left + hitMargin,
        right: targetRect.right - hitMargin,
        top: targetRect.top + hitMargin,
        bottom: targetRect.bottom - hitMargin
    };
    
    // Check arrow tip position (front of arrow) instead of whole arrow
    const arrowTipX = arrowRect.left + (arrowRect.width * 0.7); // 70% along arrow length
    const arrowTipY = arrowRect.top + (arrowRect.height / 2); // Middle of arrow height
    
    // Chek if arrow tip is within target hit box
    return (arrowTipX >= targetHitBox.left && 
            arrowTipX <= targetHitBox.right && 
            arrowTipY >= targetHitBox.top && 
            arrowTipY <= targetHitBox.bottom);
};

// Handl Target Hit
const handleHt = (x, y, arw, angleDeg) => {
    // Add hit animaton to target
    target.classList.add('hit-animation');
    setTimeout(() => target.classList.remove('hit-animation'), 300);
    
    // Play hit sound (skip first 50ms to remove delay)
    hitSound.currentTime = 0.45;
    hitSound.play().catch(err => console.log('Sound play failed:', err));
    
    // Updat score (base 10 points)
    const points = 10;
    updateScor(points);
    
    // Show scor popup at arrow positon
    showScorPopup(x, y, `+${points}`);
    
    // Mak arrow stick to targt
    const targetRect = target.getBoundingClientRect();
    
    // Calculat ofset relatve to target top-lft corner
    const ofsetX = x - targetRect.left;
    const ofsetY = y - targetRect.top;
    
    // Chang arrow class so it stays on targt
    arw.className = 'arrow-stuck';
    // Adjust angle by 10deg becaus arrow-stuck has 120deg img rotation vs 110deg
    arw.style.transform = `rotate(${angleDeg - 10}deg)`;
    
    // Add to stuck arrows aray
    stuckArrows.push({
        elemnt: arw,
        ofsetX: ofsetX,
        ofsetY: ofsetY,
        angl: angleDeg - 10
    });
    
    // Increas difficulty evry 5 hits
    if (scor % 50 === 0) {
        increasDifficulty();
    }
};

// Show Scor Popup Animaton
const showScorPopup = (x, y, text) => {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
};

// End Gam
const endGme = () => {
    gameovr = true;
    
    // Cler intervals
    if (timerIntrvl) clearInterval(timerIntrvl);
    if (targetMoveIntrvl) clearInterval(targetMoveIntrvl);
    
    // Show game over scren
    finalScoreDisplay.textContent = scor;
    gameOverScreen.classList.remove('hidden');
};

// Restat Game
const restartGam = () => {
    initGame();
};

// Start Game from Main Menu
const startGameFromMenu = () => {
    // Hide main menu
    mainMenu.classList.add('hidden');
    
    // Show game container
    gameContainer.classList.remove('hidden');
    
    // Get hit sound element and set volume
    hitSound = document.getElementById('hit-sound');
    hitSound.volume = 0.5;
    
    // Initialize the game
    initGame();
};

// Attach Event Listners
const attachEventListners = () => {
    // Start game button
    startGameBtn.addEventListener('click', startGameFromMenu);
    
    // Mous movement for bow rotatoin
    gameArea.addEventListener('mousemove', rotatBow);
    
    // Clik to shoot arrow
    gameArea.addEventListener('click', shootArw);
    
    // Restat button
    restartBtn.addEventListener('click', restartGam);
    
    // Prevnt context menu
    gameArea.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Handl window resiz for responsivness
    window.addEventListener('resize', () => {
        if (targetMoveIntrvl) {
            moveTargt();
        }
    });
};

// Attach event listeners when page loads (but don't start game yet)
window.addEventListener('DOMContentLoaded', attachEventListners);
