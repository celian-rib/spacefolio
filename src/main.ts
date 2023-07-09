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

parallax.addIdToLayer('bg-gaz-planet', 3);
parallax.addIdToLayer('bg-black-hole', 3);

parallax.addIdToLayer('bg-asteroid-1', 2);
parallax.addIdToLayer('bg-asteroid-2', 2);

const directions = document.querySelectorAll('.direction');

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i];

    // get image in direction
    const planetImg = direction.querySelector('img')!;
    const pos = {
      x: planetImg.getBoundingClientRect().x + (planetImg.width / 2),
      y: planetImg.getBoundingClientRect().y + (planetImg.height / 2),
    }

    const planetRadius = planetImg.width / 4;

    let distanceToMouse = Math.sqrt(Math.pow(e.clientX - pos.x, 2) + Math.pow(e.clientY - pos.y, 2)) - planetRadius;
    const text = direction.querySelector('p')!;

    if (distanceToMouse < planetRadius) {
      text.innerHTML = `click to land`;
    } else {
      distanceToMouse = Math.max((distanceToMouse * 10) - 500, 0);

      const distText = Math.floor(distanceToMouse);

      text.innerHTML = `${distText}<span>km</span>`;
    }
  }
});