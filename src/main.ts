import './style.css';
import './parallax/parallax.css';

import Parallax from './parallax/parallax.ts';

import './effects/animatedText.ts';
import './effects/planetsDistances.ts';
import './effects/loadOverlay.ts';

import addStarsToParallax from './effects/stars.ts';
import startLoadOverlay from './effects/loadOverlay.ts';

import registerPlanetsInteractivity from './interactivity/planets.ts';

const parallax = new Parallax({
  layerCount: 5,
  displacementFactor: 1.4,
  layerScaleDifferencePx: 110,
  animationInterpolationFactor: 0.1,
  inverted: true,
  linkedElements: {
    title: 0,
    'background-texture': 4,
    'planet-1': 1,
    'planet-2': 1,
    'planet-3': 1,
    'planet-4': 1,
    'bg-gaz-planet': 3,
    'bg-black-hole': 3,
    'bg-asteroid-1': 2,
    'bg-asteroid-2': 2,
  },
});

addStarsToParallax(parallax, 300);
registerPlanetsInteractivity(parallax);

startLoadOverlay(() => {
  parallax.startInteraction();
}, 3000);
