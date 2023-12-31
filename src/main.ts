import './style.css';
import './content.css';
import './parallax/parallax.css';

import TemporaryLayersParallax from './parallax/temporaryLayersParallax.ts';

import './effects/animatedText.ts';
import './effects/planetsDistances.ts';
import './effects/loadOverlay.ts';
import './effects/dateSinceText.ts';

import addStarsToParallax from './effects/stars.ts';
import startLoadOverlay from './effects/loadOverlay.ts';
import animateText from './effects/animatedText.ts';

import registerPlanetsInteractivity from './interactivity/planets.ts';
import initializeProjects from './interactivity/projects.ts';

const parallax = new TemporaryLayersParallax({
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
    'bg-gaz-planet': 3,
    'bg-black-hole': 3,
    'bg-asteroid-1': 2,
    'bg-asteroid-2': 2,
  },
});

addStarsToParallax(parallax, 300);
registerPlanetsInteractivity(parallax);
animateText(parallax.getLayers()[0].element);
initializeProjects();

startLoadOverlay(() => {
  parallax.startInteraction();
}, 3000);
