import Vector2D from "./Vector2D";

export class Fake3dRenderer {
  private viewportWidth: number;
  private viewportHeight: number;
  private yOriginOffset = 100;
  private yOriginOffsetPostTransform = 300;
  private renderingScale = 0.3;
  private yScaleCompress = 0.4;
  private elevationHeightFactor = 0.3;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  private getForeShorteningScaleFactor(yPosition: number) {
    return (yPosition + 700) * 0.002;
  }

  getFake3dScreenPosition(position: Vector2D, elevation: number) {
    const foreShorteningScaleFactor = this.getForeShorteningScaleFactor(
      position.y
    );

    const elevationTransform =
      -elevation * foreShorteningScaleFactor * this.elevationHeightFactor;

    const translateX =
      (this.viewportWidth / 2) *
        (1 - foreShorteningScaleFactor * this.renderingScale) +
      position.x * foreShorteningScaleFactor * this.renderingScale;

    const translateY =
      this.yOriginOffset +
      position.y *
        this.yScaleCompress *
        foreShorteningScaleFactor *
        this.renderingScale;

    const scaledTranslateX = translateX;
    const scaledTranslateY = translateY + elevationTransform;

    return {
      x: scaledTranslateX,
      y: scaledTranslateY,
    };
  }

  fake3dTransform(
    ctx: CanvasRenderingContext2D,
    position: Vector2D,
    elevation: number,
    draw: () => void
  ) {
    // const tiltFactor = 0.99;
    // const height = 600;
    const foreShorteningScaleFactor = this.getForeShorteningScaleFactor(
      position.y
    );

    // const yOriginOffset = viewportHeight * 0.2;

    ctx.save();
    // easy draw
    // ctx.translate(position.x, position.y);

    // complex draw
    ctx.translate(
      0,
      -elevation * foreShorteningScaleFactor * this.elevationHeightFactor
    );

    ctx.translate(
      (this.viewportWidth / 2) *
        (1 - foreShorteningScaleFactor * this.renderingScale) +
        position.x * foreShorteningScaleFactor * this.renderingScale,
      this.yOriginOffset
    );

    ctx.translate(
      0,
      position.y *
        this.yScaleCompress *
        foreShorteningScaleFactor *
        this.renderingScale
    );
    ctx.scale(foreShorteningScaleFactor, foreShorteningScaleFactor);
    ctx.scale(this.renderingScale, this.renderingScale);

    draw();
    ctx.restore();
  }
}

// export function getPointAndScale3D(position: Vector2D, elevation: number) {
//   return {};
// }
