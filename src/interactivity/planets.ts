import animateText from '../effects/animatedText';
import TemporaryLayersParallax from '../parallax/temporaryLayersParallax';

import './planets.css';

const PLANET_DISPOSITION_CIRCLE_RADIUS = 450;

const planets = document.querySelectorAll('.planet');

function getPlanetPositionOffset(index: number) {
  const offsetAngle = (Math.PI / 4) * 5;
  const angle = (index / planets.length) * 2 * Math.PI + offsetAngle;
  const x = PLANET_DISPOSITION_CIRCLE_RADIUS * Math.cos(angle);
  const y = PLANET_DISPOSITION_CIRCLE_RADIUS * Math.sin(angle);
  return { x, y };
}

planets.forEach((_planet, index) => {
  const planet = _planet as HTMLElement;
  const { x, y } = getPlanetPositionOffset(index);
  planet.style.setProperty('--x', `${x}px`);
  planet.style.setProperty('--y', `${y}px`);
});

function getPlanetContentId(planet: Element) {
  const contentId = planet.computedStyleMap().get('--content')?.toString();
  return contentId;
}

function getPlanetContentElt(planet: Element) {
  const contentId = getPlanetContentId(planet);
  if (contentId == null) return null;
  return document.getElementById(contentId);
}

export default function registerPlanetsInteractivity(parallax: TemporaryLayersParallax) {
  const goBackButton = document.getElementById('go-back-button')!;
  const planets = document.getElementsByClassName('planet');

  goBackButton.style.display = 'none';

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];

    const focusPlanet = () => {
      const planetPosition = getPlanetPositionOffset(i);
      const newOrigin = {
        x: planetPosition.x * -4,
        y: planetPosition.y * -4,
      };
      parallax.setOrigin(newOrigin);
      parallax.setZoom(3);

      goBackButton.style.display = 'block';

      const layerElt = parallax.createTemporyLayer();
      layerElt.classList.add('fade-initial-0');
      layerElt.classList.add('fade-in');
      layerElt.appendChild(goBackButton);

      planet.classList.add('active-planet');

      const contentBody = getPlanetContentElt(planet);
      if (contentBody == null) return;
      animateText(contentBody);
      layerElt.appendChild(contentBody);
      contentBody.style.display = 'block';
    };

    const unfocusPlanet = () => {
      parallax.setOrigin({ x: 0, y: 0 });
      parallax.setZoom(1);

      window.removeEventListener('popstate', unfocusPlanet);
      goBackButton.removeEventListener('click', unfocusPlanet);
      goBackButton.style.display = 'none';

      parallax.deleteAllTemporaryLayers();

      setTimeout(() => {
        planet.classList.remove('active-planet');
      }, 1000);

      const contentBody = getPlanetContentElt(planet);
      if (contentBody == null) return;
      contentBody.style.display = 'none';
    };

    planet.addEventListener('click', () => {
      if (planet.classList.contains('active-planet')) return;
      focusPlanet();
      goBackButton.addEventListener('click', unfocusPlanet);
      const contentId = getPlanetContentId(planet);

      history.pushState({ contentId }, '');
      window.addEventListener('popstate', unfocusPlanet);
    });
  }
}
