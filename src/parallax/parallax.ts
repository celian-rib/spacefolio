import ComputationModuleLoad from "./computation";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ParallaxOptions {
  /**
   * Number of layers to create and animate
   */
  layerCount: number;
  /**
   * By how much the layer should move when the mouse moves

   * Eg: If the factor is 2, the initial layer will move 2 times more than the first layer
   * (Making its initial size 2 times bigger)
   * 
   * @default 2
   */
  displacementFactor: number;
  /**
   * How much the layer should scale compared to the previous layer (In added pixels,
   * relative to the previous layer)
   * If the scale is 300, the initial layer will be 300 pixels bigger than the second layer
   * 
   * @default 300
   */
  layerScaleDifferencePx: number;
  /**
   * How long the animation should last
   * 
   * @default 2000
   */
  animationDuration: number;
  /**
   * If the animation should be inverted (The layers will move in the opposite direction)

   * @default false
   */
  inverted?: boolean;
}

interface OptionalParallaxOptions extends Omit<ParallaxOptions, 'displacementFactor' | 'animationDuration' | 'layerScaleDifferencePx' | 'inverted'> {
  displacementFactor?: number;
  layerScaleDifferencePx?: number;
  animationDuration?: number;
  inverted?: boolean;
}

export default class Parrallax {
  private options: ParallaxOptions;
  private layers: HTMLElement[] = [];
  private root: HTMLElement;

  private lockedPosition?: Position;
  private isTouchDevice: boolean;

  constructor(options: OptionalParallaxOptions) {
    const root = document.getElementById('parallax-root');

    if (!root)
      throw new Error('Could not find parallax root element');

    this.root = root;
    this.options = {
      ...options,
      displacementFactor: options.displacementFactor ?? 2,
      layerScaleDifferencePx: options.layerScaleDifferencePx ?? 300,
      animationDuration: options.animationDuration ?? 2000,
      inverted: options.inverted ?? false,
    };

    this.isTouchDevice = 'ontouchstart' in window;

    this.init();
  }

  public getLayers() {
    return this.layers;
  }

  private createLayers() {
    ComputationModuleLoad.then(comp => {
      for (let i = 0; i < this.options.layerCount; i++) {
        const layer = document.createElement('div');
        layer.classList.add('parallax-layer');

        const { width, height } = comp.getLayerSize(i);

        layer.style.width = `${width}px`;
        layer.style.height = `${height}px`;

        this.layers.push(layer);
        this.root.prepend(layer);
      }
    });
  }

  private addResizeListener() {
    window.addEventListener('resize', () => {
      ComputationModuleLoad.then(comp => {
        for (let i = 0; i < this.layers.length; i++) {
          const { width, height } = comp.getLayerSize(i);
          const layer = this.layers[i];

          layer.style.width = `${width}px`;
          layer.style.height = `${height}px`;
        }
      });
    });
  }

  private addMouseListener() {
    console.log('Parallax started with mouse');
    document.addEventListener('mousemove', (e) => {
      const mousePos = {
        x: e.clientX,
        y: e.clientY,
      };

      if (!this.lockedPosition)
        this.updateLayers(mousePos);
    });
  }

  private addTouchListener() {
    console.log('Parallax started for touch devices');
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];

      const mousePos = {
        x: touch.clientX,
        y: touch.clientY,
      };

      if (!this.lockedPosition)
        this.updateLayers(mousePos);
    });
  }

  private init() {
    this.createLayers();

    this.addResizeListener();

    if (this.isTouchDevice)
      this.addTouchListener();
    else
      this.addMouseListener();

    this.updateLayers({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }, 0);
  }

  private updateLayers(mousePos: Position, animationDuration: number | null = null) {
    const duration = animationDuration ?? this.options.animationDuration;

    ComputationModuleLoad.then(comp => {
      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i];

        const { x, y } = comp.getLayerScreenPosition(i, mousePos);

        if (animationDuration == 0) {
          layer.style.transform = `translate(${x}px, ${y}px)`;
          continue;
        }

        layer.animate({
          transform: `translate(${x}px, ${y}px)`,
        }, {
          duration: duration + (100 * i),
          fill: "forwards"
        });
      }
    });
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

  public getRoot(): HTMLElement {
    return this.root;
  }

  public lockPosition(pos: Position, animationDuration: number = 1000) {
    this.lockedPosition = pos;
    this.updateLayers(pos, animationDuration);
  }

  public unlockPosition() {
    this.lockedPosition = undefined;
  }

  public isTouchDeviceMode() {
    return this.isTouchDevice;
  }
}
