const animationPath = 'data.json';

const animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // required
  path: animationPath, // required
  renderer: 'svg', // required
  loop: true, // optional
  autoplay: true, // optional
});