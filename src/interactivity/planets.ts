import './planets.css';

import Parrallax from '../parallax/parallax';

// const LOCK_ANIMATION_DURATION = 100;

// const footer = document.querySelector('footer')!;
// const section = document.querySelector('section')!;

export default function registerPlanetsInteractivity(parallax: Parrallax) {
  const planets = document.querySelectorAll('.planet');

  const horixontalDistance = 2000;
  const verticalDistance = 1900;
  const planetsLockPositions = [
    { x: 0, y: verticalDistance },
    { x: -horixontalDistance, y: 0 },
    { x: 0, y: -verticalDistance },
    { x: horixontalDistance, y: 0 },
  ];

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    planet.addEventListener('click', () => {
      if (planet.classList.contains('active-planet')) {
        parallax.setOrigin({ x: 0, y: 0 });
        parallax.setZoom(1);
        planet.classList.remove('active-planet');
        return;
      }
      parallax.setOrigin(planetsLockPositions[i]);
      parallax.setZoom(3.5);
      planet.classList.add('active-planet');
    });
  }

  const sectionBtn = document.querySelector('section button')!;
  sectionBtn.addEventListener('click', () => {
    // parallax.unlockPosition();
    // section.classList.remove('fade-in');
    // footer.classList.remove('fade-out');
    // parallaxTopLayer.classList.remove('fade-out');
    // for (let i = 0; i < planets.length; i++) {
    //   const planet = planets[i];
    //   planet.classList.remove('active-planet');
    // }
  });
}
