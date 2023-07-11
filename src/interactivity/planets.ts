import './planets.css'

import Parrallax from "../parallax/parallax";

const LOCK_ANIMATION_DURATION = 100;

const footer = document.querySelector('footer')!;
const section = document.querySelector('section')!;

export default function registerPlanetsInteractivity(parallax: Parrallax) {
  const planets = document.querySelectorAll('.direction');
  const parallaxTopLayer = parallax.getLayers()[0];
  parallaxTopLayer.classList.add('fade-initial-1');

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const planetsLockPositions = [
    { x: screenWidth / 2, y: screenHeight * 0.15 },
    { x: screenWidth * 0.85, y: screenHeight / 2 },
    { x: screenWidth / 2, y: screenHeight * 0.85 },
    { x: screenWidth * 0.15, y: screenHeight / 2 },
  ]

  for (let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    planet.addEventListener('click', () => {
      parallax.lockPosition(planetsLockPositions[i], LOCK_ANIMATION_DURATION);
      planet.classList.add('active-planet');

      parallaxTopLayer.classList.add('fade-out');
      footer.classList.add('fade-out');
      section.classList.add('fade-in');
    });
  }

  const sectionBtn = document.querySelector('section button')!;
  sectionBtn.addEventListener('click', () => {
    parallax.unlockPosition();

    section.classList.remove('fade-in');
    footer.classList.remove('fade-out');

    parallaxTopLayer.classList.remove('fade-out');

    for (let i = 0; i < planets.length; i++) {
      const planet = planets[i];
      planet.classList.remove('active-planet');
    }
  });
}