#include <emscripten/emscripten.h>

struct Position {
    float x;
    float y;
};

struct Size {
    float width;
    float height;
};

int windowWidth;
int windowHeight;

EMSCRIPTEN_KEEPALIVE
void setWindowSize(int width, int height) {
    windowWidth = width;
    windowHeight = height;
}

EMSCRIPTEN_KEEPALIVE
struct Size getLayerPaddingToScreen(int layer, double displacementFactor,
                                    int layerCount,
                                    double layerScaleDifferencePx) {
    double halfScreenWidth = windowWidth / 2.0;
    double halfScreenHeight = windowHeight / 2.0;

    double unitWidth = (displacementFactor * halfScreenWidth) - halfScreenWidth;
    double unitHeight =
        (displacementFactor * halfScreenHeight) - halfScreenHeight;

    int layerInverse = layerCount - layer - 1;
    double layerAddedScale = layerScaleDifferencePx * layerInverse;

    struct Size layerPaddingToScreen;
    layerPaddingToScreen.width = unitWidth + layerAddedScale;
    layerPaddingToScreen.height = unitHeight + layerAddedScale;

    return layerPaddingToScreen;
}

EMSCRIPTEN_KEEPALIVE
struct Size getLayerSize(int layer, double displacementFactor, int layerCount,
                         double layerScaleDifferencePx, int screenWidth,
                         int screenHeight) {
    struct Size layerPaddingToScreen = getLayerPaddingToScreen(
        layer, displacementFactor, layerCount, layerScaleDifferencePx);

    struct Size layerSize;
    layerSize.width = screenWidth + (2.0 * layerPaddingToScreen.width);
    layerSize.height = screenHeight + (2.0 * layerPaddingToScreen.height);

    return layerSize;
}

EMSCRIPTEN_KEEPALIVE
struct Position getLayerCenteredPosition(int layer, struct Position mousePos,
                                         double displacementFactor,
                                         int layerCount,
                                         double layerScaleDifferencePx,
                                         int screenWidth, int screenHeight,
                                         int inverted) {
    struct Position centeredMousePos = { mousePos.x - (windowWidth / 2.),
                                         mousePos.y - (windowHeight / 2.) };

    struct Size layerPaddingToScreen = getLayerPaddingToScreen(
        layer, displacementFactor, layerCount, layerScaleDifferencePx);

    if (inverted) {
        centeredMousePos.x = -centeredMousePos.x;
        centeredMousePos.y = -centeredMousePos.y;
    }

    struct Position res;
    res.x =
        (centeredMousePos.x * layerPaddingToScreen.width) / (screenWidth / 2.0);
    res.y = (centeredMousePos.y * layerPaddingToScreen.height)
        / (screenHeight / 2.0);

    return res;
}

EMSCRIPTEN_KEEPALIVE
struct Position getLayerScreenPosition(int layer, struct Position centMousPos,
                                       double displacementFactor,
                                       int layerCount,
                                       double layerScaleDifferencePx,
                                       int screenWidth, int screenHeight,
                                       int inverted) {
    struct Position centeredPosition = getLayerCenteredPosition(
        layer, centMousPos, displacementFactor, layerCount,
        layerScaleDifferencePx, screenWidth, screenHeight, inverted);
    struct Size layerPaddingToScreen = getLayerPaddingToScreen(
        layer, displacementFactor, layerCount, layerScaleDifferencePx);

    struct Position res;
    res.x = centeredPosition.x - layerPaddingToScreen.width;
    res.y = centeredPosition.y - layerPaddingToScreen.height;

    return res;
}
