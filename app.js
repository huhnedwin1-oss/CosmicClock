// 1. Initialize and load the Lottie Animation
const liquidAnim = lottie.loadAnimation({
    container: document.getElementById('liquid-bg'), 
    renderer: 'svg',
    loop: false, // We only want it to slosh once per tap
    autoplay: false, // Wait for the user to tap to start
    path: 'data.json' // Make sure your Bodymovin file is named exactly this!
});

// 2. Track where the liquid is
let isLiquidAtBottom = false;

// 3. Listen for taps on the screen
document.getElementById('app-wrapper').addEventListener('click', (event) => {
    
    // Ignore the tap if the user specifically clicked the Pause button
    if (event.target.id === 'pause-btn') {
        console.log("Pause button tapped!"); 
        // You will add your actual timer pause logic here later
        return; 
    }

    // Toggle the fluid direction based on its current state
    if (!isLiquidAtBottom) {
        // Play Forward (Fluid sloshes to the bottom)
        liquidAnim.setDirection(1);
        liquidAnim.play();
        isLiquidAtBottom = true;
    } else {
        // Play Backward (Fluid sloshes back to the top)
        liquidAnim.setDirection(-1);
        liquidAnim.play();
        isLiquidAtBottom = false;
    }
});
