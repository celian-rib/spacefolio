import Parrallax from '../parallax/parallax';

const devModeToggle = document.querySelector('#dev-mode-toggle') as HTMLInputElement;

export default function registerDevMode(parallax: Parrallax) {
  devModeToggle.addEventListener('change', () => {
    parallax.setDevMode(devModeToggle.checked);
  });
}
