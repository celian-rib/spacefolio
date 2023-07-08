import './style.css'
import './parallax/parallax.css';

import Parallax from './parallax/parallax.ts';
import { addStarsToParallax } from './parallax/stars.ts';

const parallax = new Parallax({
  layerCount: 4,
  speedFactor: -0.2,
});

addStarsToParallax(parallax, 300);

parallax.addIdToLayer('title', 0);
