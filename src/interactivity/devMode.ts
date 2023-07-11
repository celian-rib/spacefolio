import Parrallax from "../parallax/parallax";

const devModeToggle = document.querySelector('#dev-mode-toggle') as HTMLInputElement;
const devInfo = document.querySelector('#dev-info') as HTMLDivElement;
devInfo.style.display = 'none';

export default function registerDevMode(parallax: Parrallax) {
  devModeToggle.addEventListener('change', () => {
    if (devModeToggle.checked) {
      parallax.getRoot().classList.add('dev-mode');
      devInfo.style.display = 'block';
    } else {
      parallax.getRoot().classList.remove('dev-mode');
      devInfo.style.display = 'none';
    }
  });
}
