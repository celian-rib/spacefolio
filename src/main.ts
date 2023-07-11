import './style.css'
import './inputs.css'
import './parallax/parallax.css';

import './interactivity/direction.ts';

import Parallax from './parallax/parallax.ts';

import registerDevMode from './interactivity/devMode.ts';
import registerPlanetsInteractivity from './interactivity/planets.ts';
import addStarsToParallax from './interactivity/stars.ts';

const parallax = new Parallax({
  layerCount: 5,
  displacementFactor: 1.4,
  layerScaleDifferencePx: 110,
  animationDuration: 3000,
  inverted: true,
});

function linkElementsToParallaxLayers(parallax: Parallax) {
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
}

addStarsToParallax(parallax, 300);
registerDevMode(parallax);
registerPlanetsInteractivity(parallax);
linkElementsToParallaxLayers(parallax);
