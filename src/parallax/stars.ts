import Parrallax, { Position } from "./parallax";

function createStarElt(pos: Position, layerRoot: HTMLElement, layerDepth: number) {
    const star = document.createElement("div");
    
    const opacity = 1 - (layerDepth / 6);
    star.classList.add("star");
    star.style.left = `${pos.x}%`;
    star.style.top = `${pos.y}%`;

    star.style.opacity = `${opacity}`;
    star.style.transform = "scale(" + opacity + ")";

    layerRoot.appendChild(star);
    return star;
}

function createLayerStars(layer:HTMLElement, starCount: number, layerDepth: number) {
    for (let i = 0; i < starCount; i++) {

        const pos = {
            x: Math.floor(Math.random() * 100),
            y: Math.floor(Math.random() * 100),
        }

        createStarElt(pos, layer, layerDepth);
    }
}

export function addStarsToParallax(parralax: Parrallax, starCount: number) {
    const starsPerLayer = Math.floor(starCount / (parralax.getLayers().length - 1));
    for (let i = 1; i < (parralax.getLayers().length - 1); i++) {
        const layer = parralax.getLayers()[i];
        createLayerStars(layer, starsPerLayer, i);
    }
}