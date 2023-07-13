import { Position, Size } from "../parallax";

export interface ComputationModule {
    getLayerPaddingToScreen(layer: number): Size;
    getLayerSize(layer: number): Size;
    getLayerCenteredPosition(layer: number, centMousePos: Position): Position;
    getLayerScreenPosition(layer: number, centMousPos: Position): Position;
}

export declare const ComputationModuleLoad: Promise<ComputationModule>;

export default ComputationModuleLoad
