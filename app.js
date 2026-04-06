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
