import Parrallax, { Layer, OptionalParallaxOptions } from './parallax';

export default class TemporaryLayersParallax extends Parrallax {
  private temporaryLayers: Layer[] = [];

  constructor(options: OptionalParallaxOptions) {
    super(options);
  }

  protected override init() {
    this.temporaryLayers = [];
    super.init();
  }

  public getLayers() {
    return [...this.temporaryLayers, ...super.getLayers()];
  }

  protected override resizeHandler(): void {
    super.resizeHandler();
    for (let i = 0; i < this.temporaryLayers.length; i++) {
      super.resizeLayer(this.temporaryLayers[i], i);
    }
  }

  protected override updateLayers() {
    super.updateLayers();
    for (let i = 0; i < this.temporaryLayers.length; i++) {
      const centeredMousePos = {
        x: this.mousePos.x - window.innerWidth / 2,
        y: this.mousePos.y - window.innerHeight / 2,
      };
      const layer = this.temporaryLayers[i];
      const { x, y } = this.getLayerScreenPosition(i, centeredMousePos);

      const offsetAccent = (this.layers.length - i - 1) * this.options.originOffsetDepthDampingFactor;
      layer.targetPosition.x = offsetAccent + x;
      layer.targetPosition.y = offsetAccent + y;
      layer.targetScale = 1;
    }
  }

  public createTemporyLayer(): HTMLElement {
    const layer = this.createLayer(0, false);
    this.temporaryLayers.push(layer);
    this.updateLayers();
    return layer.element;
  }

  public deleteAllTemporaryLayers() {
    for (let i = 0; i < this.temporaryLayers.length; i++) {
      const layer = this.temporaryLayers[i];
      layer.element.remove();
    }

    this.temporaryLayers = [];
  }
}
