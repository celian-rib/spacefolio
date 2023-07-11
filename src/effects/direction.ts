const directions = document.querySelectorAll('.direction');

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < directions.length; i++) {
    const direction = directions[i];

    const planetImg = direction.querySelector('img')!;
    const pos = {
      x: planetImg.getBoundingClientRect().x + (planetImg.width / 2),
      y: planetImg.getBoundingClientRect().y + (planetImg.height / 2),
    }

    const planetRadius = planetImg.width / 4;

    let distanceToMouse = Math.sqrt(Math.pow(e.clientX - pos.x, 2) + Math.pow(e.clientY - pos.y, 2)) - planetRadius;
    const text = direction.querySelector('p')!;

    if (distanceToMouse < planetRadius) {
      text.innerHTML = `click to land`;
    } else {
      distanceToMouse = Math.max((distanceToMouse * 10) - 500, 0);

      const distText = Math.floor(distanceToMouse);

      text.innerHTML = `${distText}<span>km</span>`;
    }
  }
});
