// 1. Initialize the Fluid Background
const liquidAnim = lottie.loadAnimation({
    container: document.getElementById('liquid-bg'),
    renderer: 'svg',
    loop: false,
    autoplay: false, 
    path: 'data.json',
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
});

// 2. Initialize the Interactive Buttons
const btnAnim = lottie.loadAnimation({
    container: document.getElementById('btn-lottie'),
    renderer: 'svg',
    loop: false,
    autoplay: false, 
    path: 'buttons.json',
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
});

let time1 = 0; 
// ... rest of your code continues below normally ...
let time2 = 0;
let increment = 0;
let activePlayer = 0; 
let timerInterval;
let wakeLock = null; 
let isPaused = false;
let isSystemInitialized = false; 

const p1Display = document.getElementById('player1');
const p2Display = document.getElementById('player2');
const menuOverlay = document.getElementById('menu-overlay');
const presetBtns = document.querySelectorAll('.preset-btn:not(#customBtn)');
const customBtn = document.getElementById('customBtn');

const centerControls = document.getElementById('center-controls');
const pauseBtn = document.getElementById('pauseBtn');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

let audioCtx;

function initAndStart() {
    if (!isSystemInitialized) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        enableWakeLockAndFullscreen(); 

        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                        isSystemInitialized = true;
                        startGame();
                    } else {
                        alert("Sensor permission is required.");
                    }
                })
                .catch(console.error);
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
            isSystemInitialized = true;
            startGame();
        }
    } else {
        startGame();
    }
}

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mins = parseInt(btn.getAttribute('data-time'));
        time1 = mins * 60;
        time2 = mins * 60;
        increment = parseInt(btn.getAttribute('data-inc'));
        updateDisplay();
        initAndStart();
    });
});

customBtn.addEventListener('click', () => {
    let customMin = prompt("Enter Base Time (Minutes):", "5");
    let customInc = prompt("Enter Increment (Seconds):", "0");

    if (customMin !== null && !isNaN(customMin)) {
        time1 = parseInt(customMin) * 60;
        time2 = parseInt(customMin) * 60;
        increment = parseInt(customInc) || 0;
        updateDisplay();
        initAndStart();
    }
});

pauseBtn.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        
        // 1. Play the "Split" animation (Frames 0 to 24)
        btnAnim.playSegments([0, 24], true);
        
        // 2. Hide Pause hitbox, reveal Play and Stop hitboxes
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'block';
        stopBtn.style.display = 'block';
    }
});

playBtn.addEventListener('click', () => {
    isPaused = false;
    
    // 1. Instantly reset to Frame 0 (Pause button state)
    btnAnim.goToAndStop(0, true);
    
    // 2. Hide Play/Stop hitboxes, bring back Pause
    playBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    
    setTimeout(() => { timerInterval = setInterval(tick, 1000); }, 300);
});

stopBtn.addEventListener('click', () => {
    isPaused = false;
    clearInterval(timerInterval);
    
    // 1. Instantly reset to Frame 0 (Pause button state)
    btnAnim.goToAndStop(0, true);
    
    // 2. Reset hitboxes
    playBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    
    // 3. Return to time selection menu
    centerControls.style.display = 'none';
    menuOverlay.style.display = 'flex';
    activePlayer = 0;
});

function playThump() {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);

    if (navigator.vibrate) navigator.vibrate(50);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    p1Display.textContent = formatTime(time1);
    p2Display.textContent = formatTime(time2);

    if (activePlayer === 1) {
        p1Display.classList.add('active');
        p2Display.classList.remove('active');
    } else if (activePlayer === 2) {
        p2Display.classList.add('active');
        p1Display.classList.remove('active');
    }
}

function tick() {
    if (activePlayer === 1 && time1 > 0) time1--;
    else if (activePlayer === 2 && time2 > 0) time2--;
    updateDisplay();
}

function switchPlayer(newPlayer) {
    if (activePlayer !== newPlayer) {
        if (activePlayer === 1) time1 += increment;
        else if (activePlayer === 2) time2 += increment;

        activePlayer = newPlayer;
        playThump(); 
        updateDisplay();

        // 🟢 THE NEW FLIP LOGIC
        const liquidContainer = document.getElementById('liquid-bg');

        // Always force the animation to play forward from the very beginning
        liquidAnim.setDirection(1);

        if (activePlayer === 1) {
            // Player 1 is active (Bottom of screen)
            // Keep container normal, play from frame 0
            liquidContainer.classList.remove('flipped');
            // 🟢 CHANGED: We now ADD the 180-degree flip here so the orange falls to the opposite side
            liquidContainer.classList.add('flipped');
            liquidAnim.goToAndPlay(0, true); 

        } else if (activePlayer === 2) {
            // Player 2 is active (Top of screen)
            // Flip container 180deg, play from frame 0
            liquidContainer.classList.add('flipped');
            // 🟢 CHANGED: We REMOVE the flip here
            liquidContainer.classList.remove('flipped');
            liquidAnim.goToAndPlay(0, true); 
        }
    }
}

function handleOrientation(event) {
    if (isPaused) return; 

    const tilt = event.beta; 
    if (tilt > 5) {
        switchPlayer(2); 
    } else if (tilt < -5) {
        switchPlayer(1); 
    }
}

async function enableWakeLockAndFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(e => console.log(e));
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen().catch(e => console.log(e)); 
    }
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) {}
}

function startGame() {
    menuOverlay.style.display = 'none';
    centerControls.style.display = 'flex';

    activePlayer = 1; 
    updateDisplay();

    timerInterval = setInterval(tick, 1000);
}
