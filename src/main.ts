import './style.css'
import './inputs.css'
import './parallax/parallax.css';

import './effects/direction.ts';

import Parallax from './parallax/parallax.ts';
import { addStarsToParallax } from './parallax/stars.ts';

const parallax = new Parallax({
  layerCount: 5,
  displacementFactor: 1.4,
  layerScaleDifferencePx: 110,
  animationDuration: 3000,
  inverted: true,
});

addStarsToParallax(parallax, 300);

parallax.addIdToLayer('background-texture', 4);

parallax.addIdToLayer('title', 0);
parallax.addIdToLayer('dir-1', 1);
parallax.addIdToLayer('dir-2', 1);
parallax.addIdToLayer('dir-3', 1);
parallax.addIdToLayer('dir-4', 1);

parallax.addIdToLayer('bg-gaz-planet', 3);
parallax.addIdToLayer('bg-black-hole', 3);

parallax.addIdToLayer('bg-asteroid-1', 2);
parallax.addIdToLayer('bg-asteroid-2', 2);


const devModeToggle = document.querySelector('#dev-mode-toggle') as HTMLInputElement;

devModeToggle.addEventListener('change', () => {
  if (devModeToggle.checked) {
    parallax.getRoot().classList.add('dev-mode');
  } else {
    parallax.getRoot().classList.remove('dev-mode');
  }
});
