import TemporaryLayersParallax from '../parallax/temporaryLayersParallax';

import './planets.css';

export default function registerPlanetsInteractivity(parallax: TemporaryLayersParallax) {
  const goBackButton = document.getElementById('go-back-button')!;
  const planets = document.getElementsByClassName('planet');

  goBackButton.style.display = 'none';

  const horizontalDistance = 1900;
  const verticalDistance = 1000;

  const planetsLockPositions = [
    { x: 0, y: verticalDistance },
    { x: -horizontalDistance, y: 0 },
    { x: 0, y: -verticalDistance },
    { x: horizontalDistance, y: 0 },
  ];

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];

    const focusPlanet = () => {
      parallax.setOrigin(planetsLockPositions[i]);
      parallax.setZoom(3);

      goBackButton.style.display = 'block';

      const layerElt = parallax.createTemporyLayer();
      layerElt.classList.add('fade-initial-0');
      layerElt.classList.add('fade-in');
      layerElt.appendChild(goBackButton);

      planet.classList.add('active-planet');
    };

    const unfocusPlanet = () => {
      parallax.setOrigin({ x: 0, y: 0 });
      parallax.setZoom(1);

      goBackButton.removeEventListener('click', unfocusPlanet);

      parallax.deleteAllTemporaryLayers();

      setTimeout(() => {
        planet.classList.remove('active-planet');
      }, 1000);
    };

    planet.addEventListener('click', () => {
      if (planet.classList.contains('active-planet')) return;
      focusPlanet();
      goBackButton.addEventListener('click', unfocusPlanet);
    });
  }
}
