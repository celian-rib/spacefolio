import './style.css';
import './parallax/parallax.css';

import Parallax from './parallax/parallax.ts';

import './effects/animatedText.ts';
import './effects/planetsDistances.ts';
import './effects/loadOverlay.ts';

import addStarsToParallax from './effects/stars.ts';

import registerPlanetsInteractivity from './interactivity/planets.ts';

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

  parallax.addIdToLayer('planet-1', 1);
  parallax.addIdToLayer('planet-2', 1);
  parallax.addIdToLayer('planet-3', 1);
  parallax.addIdToLayer('planet-4', 1);

  parallax.addIdToLayer('bg-gaz-planet', 3);
  parallax.addIdToLayer('bg-black-hole', 3);

  parallax.addIdToLayer('bg-asteroid-1', 2);
  parallax.addIdToLayer('bg-asteroid-2', 2);
}

addStarsToParallax(parallax, 300);
registerPlanetsInteractivity(parallax);
linkElementsToParallaxLayers(parallax);

setTimeout(() => {
  parallax.startInteraction();
}, 3000);
