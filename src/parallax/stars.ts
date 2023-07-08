import Parrallax from "./parallax";

function createStarElt(layerRoot: SVGElement, layerDepth: number, layerCount: number) {
    const pos = {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
    }

    const svgns = "http://www.w3.org/2000/svg";

    const size = 1 - (layerDepth / (layerCount + 1));

    const star = document.createElementNS(svgns, 'rect');
    star.setAttribute('x', `${pos.x}`);
    star.setAttribute('y', `${pos.y}`);
    star.setAttribute('width', `${size / 2}px`);
    star.setAttribute('height', `${size / 2}px`);
    star.setAttribute('fill', 'white');

    layerRoot.appendChild(star);
    return star;
}

function createLayerStars(layer: HTMLElement, starCount: number, layerDepth: number, layerCount: number) {
    const svgns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('viewBox', `0 0 100 100`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const opacity = 1 - (layerDepth / (layerCount + 1));
    svg.style.opacity = `${opacity}`;

    layer.appendChild(svg);

    for (let i = 0; i < starCount; i++)
        createStarElt(svg, layerDepth, layerCount);
}

export function addStarsToParallax(parralax: Parrallax, starCount: number) {
    const starsPerLayer = Math.floor(starCount / (parralax.getLayers().length - 1));
    for (let i = 1; i < parralax.getLayers().length; i++) {
        const layer = parralax.getLayers()[i];
        createLayerStars(layer, starsPerLayer, i, parralax.getLayers().length);
    }
}