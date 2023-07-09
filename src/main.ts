import './style.css'
import './parallax/parallax.css';

import Parallax from './parallax/parallax.ts';
import { addStarsToParallax } from './parallax/stars.ts';

const parallax = new Parallax({
  layerCount: 5,
  speedFactor: -0.2,
  animationDuration: 3000,
});

addStarsToParallax(parallax, 300);

parallax.addIdToLayer('title', 0);
parallax.addIdToLayer('dir-1', 1);
parallax.addIdToLayer('dir-2', 1);
parallax.addIdToLayer('dir-3', 1);
parallax.addIdToLayer('dir-4', 1);

const directions = document.querySelectorAll('.direction p');

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i];
    const pos = {
      x: direction.getBoundingClientRect().x,
      y: direction.getBoundingClientRect().y,
    }

    const distanceToMouse = Math.sqrt(Math.pow(e.clientX - pos.x, 2) + Math.pow(e.clientY - pos.y, 2));

    const distText = Math.floor(Math.max(Math.pow(distanceToMouse - 10, 2), 0));
    direction.innerHTML = `${distText}<span>km</span>`;
  }
});