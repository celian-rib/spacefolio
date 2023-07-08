import './style.css'
import './parallax/parallax.css';

import Parallax from './parallax/parallax.ts';
import { addStarsToParallax } from './parallax/stars.ts';

const parallax = new Parallax({
  layerCount: 5,
  speedFactor: -0.2,
});

addStarsToParallax(parallax, 300);
parallax.addIdToLayer('title', 0);


// function createCircle(color: string) {
//   const circle = document.createElement('div');
//   circle.style.width = '100px';
//   circle.style.height = '100px';
//   circle.style.borderRadius = '50%';
//   circle.style.position = 'absolute';
//   circle.style.top = '50%';
//   circle.style.left = '50%';
//   circle.style.backgroundColor = color;
//   return circle;
// }

// parallax.addElementToLayer(createCircle('red'), 0);
// parallax.addElementToLayer(createCircle('blue'), 1);
// parallax.addElementToLayer(createCircle('purple'), 2);
// parallax.addElementToLayer(createCircle('pink'), 3);
// parallax.addElementToLayer(createCircle('tomato'), 4);


// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
