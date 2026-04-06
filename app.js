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
            liquidAnim.goToAndPlay(0, true); 
            
        } else if (activePlayer === 2) {
            // Player 2 is active (Top of screen)
            // Flip container 180deg, play from frame 0
            liquidContainer.classList.add('flipped');
            liquidAnim.goToAndPlay(0, true); 
        }
    }
}

