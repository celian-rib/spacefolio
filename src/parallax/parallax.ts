export interface Position {
    x: number;
    y: number;
}

export interface ParallaxOptions {
    layerCount: number;
    speedFactor: number;
    depthScale: number;
    animationDuration: number;
}

interface OptionalParallaxOptions extends Omit<ParallaxOptions, 'speedFactor' | 'animationDuration' | 'depthScale'> {
    speedFactor?: number;
    depthScale?: number;
    animationDuration?: number;
}

export default class Parrallax {
    private options: ParallaxOptions;
    private layers: HTMLElement[] = [];
    private root: HTMLElement;

    constructor(options: OptionalParallaxOptions) {
        const root = document.getElementById('parallax-root');

        if (!root)
            throw new Error('Could not find parallax root element');

        this.root = root;
        this.options = {
            ...options,
            speedFactor: options.speedFactor ?? 0.5,
            depthScale: options.depthScale ?? 300,
            animationDuration: options.animationDuration ?? 0.5,
        };

        this.init();
    }

    public getLayers() {
        return this.layers;
    }

    private addLayers() {
        for (let i = 0; i < this.options.layerCount; i++) {
            const layer = document.createElement('div');
            layer.classList.add('parallax-layer');

            const invIdx = (this.options.layerCount - i);
            layer.style.width = `calc(100vw + ${invIdx * this.options.depthScale}px)`;
            layer.style.height = `calc(100vh + ${invIdx * this.options.depthScale}px)`;
            this.layers.push(layer);
            this.root.prepend(layer);
        }
    }

    private addMouseListener() {
        document.addEventListener('mousemove', (e) => {
            const mousePos = {
                x: e.clientX,
                y: e.clientY,
            };

            this.updateLayers(mousePos);
        });
    }

    private init() {
        this.addLayers();
        this.addMouseListener();
    }

    private updateLayers(mousePos: Position) {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];

            const centerMouseX = mousePos.x - (window.innerWidth / 2);
            const centerMouseY = mousePos.y - (window.innerHeight / 2);

            const invIdx = (this.options.layerCount - i);
            const layerFactor = invIdx + 1;
            const x = centerMouseX * (this.options.speedFactor * layerFactor);
            const y = centerMouseY * (this.options.speedFactor * layerFactor);

            const scaleDisplacement = -invIdx * (this.options.depthScale / 2);

            const finalX = x + scaleDisplacement;
            const finalY = y + scaleDisplacement;

            layer.animate({
                left: `${finalX}px`,
                top: `${finalY}px`
            }, {
                duration: 2000 + (100 * i),
                fill: "forwards"
            });

            layer.style.setProperty('--layer-x', `${finalX}`);
            layer.style.setProperty('--layer-y', `${finalY}`);
        }
    }

    public addElementToLayer(element: HTMLElement, layer: number): Parrallax {
        if (layer < 0 || layer > this.options.layerCount)
            throw new Error(`Layer must be between 0 and ${this.options.layerCount}`);

        const layerRoot = this.layers[layer];
        layerRoot.appendChild(element);

        return this;
    }

    public addIdToLayer(id: string, layer: number): Parrallax {
        if (layer < 0 || layer > this.options.layerCount)
            throw new Error(`Layer must be between 0 and ${this.options.layerCount}`);

        const elt = document.getElementById(id);
        if (!elt)
            throw new Error(`Could not find element with id ${id}`);

        const layerRoot = this.layers[layer];
        layerRoot.appendChild(elt);

        return this;
    }
}