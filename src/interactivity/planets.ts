import TemporaryLayersParallax from '../parallax/temporaryLayersParallax';

import './planets.css';

export default function registerPlanetsInteractivity(parallax: TemporaryLayersParallax) {
  const goBackButton = document.getElementById('go-back-button')!;
  const planets = document.getElementsByClassName('planet');

  const horixontalDistance = 2000;
  const verticalDistance = 1000;

  // const planetsLockPositions = [
  //   { x: -400, y: verticalDistance },
  //   { x: -horixontalDistance, y: 0 },
  //   { x: 400, y: -verticalDistance },
  //   { x: horixontalDistance, y: 0 },
  // ];
  const planetsLockPositions = [
    { x: 0, y: verticalDistance },
    { x: -horixontalDistance, y: 0 },
    { x: 0, y: -verticalDistance },
    { x: horixontalDistance, y: 0 },
  ];

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];

    const focusPlanet = () => {
      parallax.setOrigin(planetsLockPositions[i]);
      parallax.setZoom(3);

      goBackButton.classList.add('fade-in');
      goBackButton.classList.remove('fade-out');

      const layerElt = parallax.createTemporyLayer();
      layerElt.appendChild(goBackButton);
      layerElt.style.outline = 'solid 1px red';

      planet.classList.add('active-planet');
    };

    const unfocusPlanet = () => {
      parallax.setOrigin({ x: 0, y: 0 });
      parallax.setZoom(1);

      goBackButton.classList.remove('fade-in');
      goBackButton.classList.add('fade-out');

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
