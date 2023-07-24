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
   * Speed of the parallax animation on touch devices
   *
   * @default 20
   */
  touchDeviceSensitivity: number;
  /**
   * Affect the speed of the animation.
   * The higher the factor, the faster the animation.
   *
   * The interplation factor is between 0 and 1.
   *
   * @default 0.1
   */
  animationInterpolationFactor: number;
  /**
   * If the animation should be inverted (The layers will move in the opposite direction)

   * @default false
   */
  inverted: boolean;
  /**
   * How much the different layers should be offset from the origin
   * after changing the default origin
   * (Last layer will always be unchanged to preserve background)
   *
   * @defaul
   */
  originOffsetDepthDampingFactor: number;
  /**
   * Elements that should be linked to a specific layer
   * The key is the id of the element, and the value is the layer number
   */
  linkedElements: {
    [key: string]: number;
  };
}

export interface OptionalParallaxOptions extends Partial<ParallaxOptions> {
  layerCount: number;
}

export interface Layer {
  element: HTMLElement;
  size: Size;

  position: Position;
  targetPosition: Position;

  scale: number;
  targetScale: number;
}

export default class Parrallax {
  protected options: ParallaxOptions;
  protected layers: Layer[] = [];

  protected root: HTMLElement;

  protected mousePos: Position;

  protected isTouchDevice: boolean;

  protected origin: Position = { x: 0, y: 0 };
  protected zoom: number = 1;

  // Allow smooth start of lerp values
  // Usefull to ease movement if mouse is far away from center on start of parallax.
  protected lerpInFactor: number = 0;
  protected lerpInFactorTarget: number = 0;

  constructor(options: OptionalParallaxOptions) {
    const root = document.getElementById('parallax-root');

    if (!root) throw new Error('Could not find parallax root element');

    this.root = root;
    this.options = {
      ...options,
      displacementFactor: options.displacementFactor ?? 2,
      layerScaleDifferencePx: options.layerScaleDifferencePx ?? 300,
      animationInterpolationFactor: options.animationInterpolationFactor ?? 0.1,
      inverted: options.inverted ?? false,
      originOffsetDepthDampingFactor: options.originOffsetDepthDampingFactor ?? 0.1,
      linkedElements: options.linkedElements ?? {},
      touchDeviceSensitivity: options.touchDeviceSensitivity ?? 20,
    };

    this.mousePos = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    this.isTouchDevice = 'ontouchstart' in window;

    this.init();
  }

  public getLayers() {
    return this.layers;
  }

  protected createLayer(depth: number, prepend: boolean = true) {
    const layerElt = document.createElement('div');
    layerElt.classList.add('parallax-layer');

    const size = this.getLayerSize(depth);
    const { width, height } = size;

    layerElt.style.width = `${width}px`;
    layerElt.style.height = `${height}px`;
    layerElt.style.willChange = 'transform';
    layerElt.style.setProperty('--layer-depth', `${depth}`);

    const layer = {
      element: layerElt,
      size,
      position: { x: 0, y: 0 },
      targetPosition: { x: 0, y: 0 },
      scale: 1,
      targetScale: 1,
    };

    if (prepend) this.root.prepend(layerElt);
    else this.root.appendChild(layerElt);
    return layer;
  }

  protected createLayers() {
    for (let i = 0; i < this.options.layerCount; i++) {
      const layer = this.createLayer(i);
      this.layers.push(layer);
    }
  }

  protected resizeLayer(layer: Layer, depth: number) {
    const size = this.getLayerSize(depth);
    const { width, height } = size;

    layer.element.style.width = `${width}px`;
    layer.element.style.height = `${height}px`;
    layer.size = size;
  }

  protected resizeHandler() {
    for (let i = 0; i < this.layers.length; i++) {
      this.resizeLayer(this.layers[i], i);
    }
  }

  protected addResizeListener() {
    window.addEventListener('resize', this.resizeHandler.bind(this));
  }

  protected addMouseListener() {
    console.log('Parallax started with mouse');
    document.addEventListener('mousemove', e => {
      this.mousePos = {
        x: e.clientX,
        y: e.clientY,
      };

      this.updateLayers();
    });
  }

  protected addTouchListener() {
    console.log('Parallax started for touch devices');

    let lastTouch = {
      x: 0,
      y: 0,
    };

    document.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      const touchPos = {
        x: touch.clientX,
        y: touch.clientY,
      };

      const touchDirection = {
        x: touchPos.x - lastTouch.x,
        y: touchPos.y - lastTouch.y,
      };

      const touchDirectionMagnitude = Math.sqrt(touchDirection.x ** 2 + touchDirection.y ** 2);
      const normalizedTouchDirection = {
        x: touchDirection.x / touchDirectionMagnitude,
        y: touchDirection.y / touchDirectionMagnitude,
      };

      console.log(normalizedTouchDirection);

      const sensitivity = this.options.touchDeviceSensitivity / window.devicePixelRatio;

      this.mousePos = {
        x: this.mousePos.x - normalizedTouchDirection.x * sensitivity,
        y: this.mousePos.y - normalizedTouchDirection.y * sensitivity,
      };

      this.mousePos.x = Math.max(0, Math.min(this.mousePos.x, window.innerWidth));
      this.mousePos.y = Math.max(0, Math.min(this.mousePos.y, window.innerHeight));

      this.updateLayers();
      lastTouch = { ...touchPos };
    });
  }

  protected linkInitialElements() {
    const linkedElements = this.options.linkedElements;
    for (const key in linkedElements) {
      const layer = linkedElements[key];
      this.addIdToLayer(key, layer);
    }
  }

  protected init() {
    this.createLayers();
    this.addResizeListener();
    this.updateLayers();
    this.linkInitialElements();

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      this.moveLayerToPosition(layer, layer.targetPosition, layer.targetScale);
    }

    this.animationLoop();
  }

  public startInteraction() {
    if (this.isTouchDevice) this.addTouchListener();
    else this.addMouseListener();
    this.lerpInFactorTarget = 1;
  }

  protected getLayerPaddingToScreen(layer: number): Size {
    const halfScreenWidth = window.innerWidth / 2;
    const halfScreenHeight = window.innerHeight / 2;

    const unitWidth = this.options.displacementFactor * halfScreenWidth - halfScreenWidth;
    const unitHeight = this.options.displacementFactor * halfScreenHeight - halfScreenHeight;

    const layerInverse = this.options.layerCount - layer - 1;
    const layerAddedScale = this.options.layerScaleDifferencePx * layerInverse;

    return {
      width: unitWidth + layerAddedScale,
      height: unitHeight + layerAddedScale,
    };
  }

  protected getLayerSize(layer: number): Size {
    const layerPaddingToScreen = this.getLayerPaddingToScreen(layer);
    return {
      width: window.innerWidth + 2 * layerPaddingToScreen.width,
      height: window.innerHeight + 2 * layerPaddingToScreen.height,
    };
  }

  protected getLayerCenteredPosition(layer: number, centMousePos: Position): Position {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const layerPaddingToScreen = this.getLayerPaddingToScreen(layer);

    if (this.options.inverted) {
      centMousePos.x = -centMousePos.x;
      centMousePos.y = -centMousePos.y;
    }

    const res = {
      x: (centMousePos.x * layerPaddingToScreen.width) / (screenWidth / 2),
      y: (centMousePos.y * layerPaddingToScreen.height) / (screenHeight / 2),
    };

    return res;
  }

  protected getLayerScreenPosition(layer: number, centMousPos: Position): Position {
    const { x, y } = this.getLayerCenteredPosition(layer, centMousPos);
    const { width, height } = this.getLayerPaddingToScreen(layer);

    return {
      x: x - width,
      y: y - height,
    };
  }

  protected moveLayerToPosition(layer: Layer, position: Position, scale: number) {
    layer.element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`;
    layer.position = position;
    layer.scale = scale;
  }

  protected animationLoop() {
    const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
    const lerpPosition = (start: Position, end: Position, t: number) => ({
      x: lerp(start.x, end.x, t),
      y: lerp(start.y, end.y, t),
    });

    const animate = () => {
      this.lerpInFactor = lerp(this.lerpInFactor, this.lerpInFactorTarget, 0.02);
      const lerpValue = this.options.animationInterpolationFactor * this.lerpInFactor;

      const layers = this.getLayers();
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const newPosition = lerpPosition(layer.position, layer.targetPosition, lerpValue);
        const newScale = lerp(layer.scale, layer.targetScale, lerpValue);
        this.moveLayerToPosition(layer, newPosition, newScale);
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  protected updateLayers() {
    for (let i = 0; i < this.layers.length; i++) {
      const centeredMousePos = {
        x: this.mousePos.x - window.innerWidth / 2,
        y: this.mousePos.y - window.innerHeight / 2,
      };

      const layer = this.layers[i];
      const { x, y } = this.getLayerScreenPosition(i, centeredMousePos);

      const offsetAccent = (this.layers.length - i - 1) * this.options.originOffsetDepthDampingFactor;
      layer.targetPosition.x = this.origin.x * offsetAccent + x;
      layer.targetPosition.y = this.origin.y * offsetAccent + y;
      layer.targetScale = this.zoom;
    }
  }

  public addElementToLayer(element: HTMLElement, layer: number): Parrallax {
    if (layer < 0 || layer > this.options.layerCount) throw new Error(`Layer must be between 0 and ${this.options.layerCount}`);

    const layerRoot = this.layers[layer];
    layerRoot.element.appendChild(element);

    return this;
  }

  public addIdToLayer(id: string, layer: number): Parrallax {
    if (layer < 0 || layer > this.options.layerCount) throw new Error(`Layer must be between 0 and ${this.options.layerCount}`);

    const elt = document.getElementById(id);
    if (!elt) throw new Error(`Could not find element with id ${id}`);

    const layerRoot = this.layers[layer];
    layerRoot.element.appendChild(elt);

    return this;
  }

  public setDevMode(active: boolean): void {
    if (active) {
      this.root.classList.add('dev-mode');
    } else {
      this.root.classList.remove('dev-mode');
    }
  }

  public setOrigin(origin: Position) {
    this.origin = origin;
    this.updateLayers();
  }

  public setZoom(zoom: number) {
    this.zoom = zoom;

    this.origin = {
      x: this.origin.x * zoom,
      y: this.origin.y * zoom,
    };
    this.updateLayers();
  }

  public isTouchDeviceMode() {
    return this.isTouchDevice;
  }
}
