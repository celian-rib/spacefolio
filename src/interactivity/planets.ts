import animateText from '../effects/animatedText';
import TemporaryLayersParallax from '../parallax/temporaryLayersParallax';

import './planets.css';

const PLANET_DISPOSITION_CIRCLE_RADIUS = 450;

const goBackButton = document.getElementById('go-back-button')!;
const planets = document.querySelectorAll('.planet');

setPlanetsPositions();

function setPlanetsPositions() {
  planets.forEach((_planet, index) => {
    const planet = _planet as HTMLElement;
    const { x, y } = getPlanetPositionOffset(index);
    planet.style.setProperty('--x', `${x}px`);
    planet.style.setProperty('--y', `${y}px`);
  });
}

function getPlanetPositionOffset(index: number) {
  const offsetAngle = (Math.PI / 4) * 5;
  const angle = (index / planets.length) * 2 * Math.PI + offsetAngle;
  const x = PLANET_DISPOSITION_CIRCLE_RADIUS * Math.cos(angle);
  const y = PLANET_DISPOSITION_CIRCLE_RADIUS * Math.sin(angle);
  return { x, y };
}

function getPlanetContentId(planet: Element) {
  const contentId = planet.computedStyleMap().get('--content')?.toString();
  return contentId;
}

function getPlanetContentElt(planet: Element) {
  const contentId = getPlanetContentId(planet);
  if (contentId == null) return null;
  return document.getElementById(contentId);
}

function parallaxZoomToPlanet(planetIndex: number, parallax: TemporaryLayersParallax) {
  const planetPosition = getPlanetPositionOffset(planetIndex);
  const newOrigin = {
    x: planetPosition.x * -4,
    y: planetPosition.y * -4,
  };
  parallax.setOrigin(newOrigin);
  parallax.setZoom(3);
}

function parallaxZoomReset(parallax: TemporaryLayersParallax) {
  parallax.setOrigin({ x: 0, y: 0 });
  parallax.setZoom(1);
}

function showGoBackButton() {
  goBackButton.style.display = 'block';
}

function hideGoBackButton() {
  goBackButton.style.display = 'none';
}

function createContentParallaxLayer(parallax: TemporaryLayersParallax, contentBody: HTMLElement | null) {
  const layerElt = parallax.createTemporyLayer();
  layerElt.classList.add('fade-initial-0');
  layerElt.classList.add('fade-in');
  layerElt.appendChild(goBackButton);

  if (contentBody == null) return;
  animateText(contentBody);
  layerElt.appendChild(contentBody);
  contentBody.style.display = 'block';
}

function createFocusedStateListener(unfocus: () => void) {
  goBackButton.addEventListener('click', unfocus);
  history.pushState({}, '');
  window.addEventListener('popstate', unfocus);
}

function deleteFocusedStateListeners(unfocus: () => void) {
  window.removeEventListener('popstate', unfocus);
  goBackButton.removeEventListener('click', unfocus);
  goBackButton.style.display = 'none';
}

function hidePlanetContent(planet: Element) {
  const contentBody = getPlanetContentElt(planet);
  if (contentBody == null) return;
  contentBody.style.display = 'none';
}

function isPlanetFocused(planet: Element) {
  return planet.classList.contains('active-planet');
}

export default function registerPlanetsInteractivity(parallax: TemporaryLayersParallax) {
  const planets = document.getElementsByClassName('planet');
  hideGoBackButton();

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];

    const focusPlanet = (): void => {
      parallaxZoomToPlanet(i, parallax);
      showGoBackButton();
      createContentParallaxLayer(parallax, getPlanetContentElt(planet));
      planet.classList.add('active-planet');
    };

    const unfocusPlanet = (): void => {
      parallaxZoomReset(parallax);
      deleteFocusedStateListeners(unfocusPlanet);
      parallax.deleteAllTemporaryLayers();
      hidePlanetContent(planet);
      setTimeout(() => planet.classList.remove('active-planet'), 1000);
    };

    planet.addEventListener('click', () => {
      if (!isPlanetFocused(planet)) {
        focusPlanet();
        createFocusedStateListener(unfocusPlanet);
      }
    });
  }
}
