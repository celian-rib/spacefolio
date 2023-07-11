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

    this.init();
  }

  public getLayers() {
    return this.layers;
  }

  private createLayers() {
    for (let i = 0; i < this.options.layerCount; i++) {
      const layer = document.createElement('div');
      layer.classList.add('parallax-layer');

      const { width, height } = this.getLayerSize(i);

      layer.style.width = `${width}px`;
      layer.style.height = `${height}px`;

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

      if (!this.lockedPosition)
        this.updateLayers(mousePos);
    });
  }

  private init() {
    this.createLayers();
    this.addMouseListener();
  }

  private getLayerPaddingToScreen(layer: number): Size {
    const halfScreenWidth = window.innerWidth / 2;
    const halfScreenHeight = window.innerHeight / 2;

    const unitWidth = (this.options.displacementFactor * halfScreenWidth) - halfScreenWidth;
    const unitHeight = (this.options.displacementFactor * halfScreenHeight) - halfScreenHeight;

    const layerInverse = this.options.layerCount - layer - 1;
    const layerAddedScale = this.options.layerScaleDifferencePx * layerInverse;

    return {
      width: unitWidth + layerAddedScale,
      height: unitHeight + layerAddedScale,
    }
  }

  private getLayerSize(layer: number): Size {
    const layerPaddingToScreen = this.getLayerPaddingToScreen(layer);
    return {
      width: window.innerWidth + (2 * layerPaddingToScreen.width),
      height: window.innerHeight + (2 * layerPaddingToScreen.height),
    }
  }

  private getLayerCenteredPosition(layer: number, centMousePos: Position): Position {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const layerPaddingToScreen = this.getLayerPaddingToScreen(layer);

    if (this.options.inverted) {
      centMousePos.x = -centMousePos.x;
      centMousePos.y = -centMousePos.y;
    }

    const res = {
      x: (centMousePos.x * layerPaddingToScreen.width) / (screenWidth / 2),
      y: (centMousePos.y * layerPaddingToScreen.height) / (screenHeight / 2)
    }

    return res;
  }

  private getLayerScreenPosition(layer: number, centMousPos: Position): Position {
    const { x, y } = this.getLayerCenteredPosition(layer, centMousPos);
    const { width, height } = this.getLayerPaddingToScreen(layer);

    return {
      x: x - width,
      y: y - height,
    }
  }

  private updateLayers(mousePos: Position, animationDuration: number | null = null) {
    const duration = animationDuration ?? this.options.animationDuration;
    
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];

      const centeredMousePos = {
        x: mousePos.x - (window.innerWidth / 2),
        y: mousePos.y - (window.innerHeight / 2),
      };

      const { x, y } = this.getLayerScreenPosition(i, centeredMousePos);

      layer.animate({
        transform: `translate(${x}px, ${y}px)`,
      }, {
        duration: duration + (100 * i),
        fill: "forwards"
      });
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

  public getRoot(): HTMLElement {
    return this.root;
  }

  public lockPosition(pos: Position, animationDuration: number = 1000) {
    this.lockedPosition = pos;
    this.updateLayers(pos, animationDuration);
  }
}