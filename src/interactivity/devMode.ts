import Parrallax from "../parallax/parallax";

const devModeToggle = document.querySelector('#dev-mode-toggle') as HTMLInputElement;

export default function registerDevMode(parallax: Parrallax) {
  devModeToggle.addEventListener('change', () => {
    if (devModeToggle.checked) {
      parallax.getRoot().classList.add('dev-mode');
    } else {
      parallax.getRoot().classList.remove('dev-mode');
    }
  });
}
