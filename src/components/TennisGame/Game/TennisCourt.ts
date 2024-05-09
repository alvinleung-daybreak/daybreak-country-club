import { Fake3dRenderer } from "./Fake3dRenderer";
import Vector2D from "./Vector2D";

export class TennisCourt {
  private width: number;
  private height: number;
  private netElevation = 50;

  private offset;

  constructor(offset: Vector2D, width: number) {
    // const tennisCourtRatio = 36 / 78;
    const tennisCourtRatio = 60 / 90;

    this.width = width;
    this.height = width / tennisCourtRatio;
    this.offset = offset;
  }
  public getDimension() {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public getNetElevation() {
    return this.netElevation;
  }

  public getEdges() {
    return {
      top: this.offset.y,
      left: this.offset.x - this.width / 2,
      right: this.offset.x - this.width / 2 + this.width,
      bottom: this.offset.y + this.height,
    };
  }

  public render(ctx: CanvasRenderingContext2D, renderer: Fake3dRenderer) {
    const lineColor = "#FFFCF2";

    // left inner line
    const lineMargin = 100;

    // draw perspective lines
    const { left, top, right, bottom } = this.getEdges();

    const topLeft = renderer.getFake3dScreenPosition(
      new Vector2D(left, top),
      0
    );
    const topLeftInner = renderer.getFake3dScreenPosition(
      new Vector2D(left + lineMargin, top),
      0
    );
    const topRight = renderer.getFake3dScreenPosition(
      new Vector2D(right, top),
      0
    );
    const topRightInner = renderer.getFake3dScreenPosition(
      new Vector2D(right - lineMargin, top),
      0
    );

    const bottomLeft = renderer.getFake3dScreenPosition(
      new Vector2D(left, bottom),
      0
    );
    const bottomLeftInner = renderer.getFake3dScreenPosition(
      new Vector2D(left + lineMargin, bottom),
      0
    );

    const bottomRight = renderer.getFake3dScreenPosition(
      new Vector2D(right, bottom),
      0
    );
    const bottomRightInner = renderer.getFake3dScreenPosition(
      new Vector2D(right - lineMargin, bottom),
      0
    );

    const topQuarterLeftInner = renderer.getFake3dScreenPosition(
      new Vector2D(left + lineMargin, top + this.height * 0.25),
      0
    );
    const topQuarterRightInner = renderer.getFake3dScreenPosition(
      new Vector2D(right - lineMargin, top + this.height * 0.25),
      0
    );

    const bottomQuarterLeftInner = renderer.getFake3dScreenPosition(
      new Vector2D(left + lineMargin, top + this.height * 0.75),
      0
    );
    const bottomQuarterRightInner = renderer.getFake3dScreenPosition(
      new Vector2D(right - lineMargin, top + this.height * 0.75),
      0
    );

    const center = renderer.getFake3dScreenPosition(
      new Vector2D((right + left) / 2, (top + bottom) / 2),
      0
    );
    // draw bounding box
    ctx.strokeStyle = lineColor;
    ctx.beginPath();

    // the bounding square
    ctx.moveTo(topLeft.x, topLeft.y);
    ctx.lineTo(topRight.x, topRight.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.lineTo(topLeft.x, topLeft.y);
    ctx.stroke();

    // top service line
    ctx.beginPath();
    ctx.moveTo(topQuarterLeftInner.x + 5, topQuarterLeftInner.y); // note: the 5 px is hack to compensate the wrong perspective algorithm
    ctx.lineTo(topQuarterRightInner.x - 5, topQuarterRightInner.y);
    ctx.stroke();

    // bottom service line
    ctx.beginPath();
    ctx.moveTo(bottomQuarterLeftInner.x + 5, bottomQuarterLeftInner.y);
    ctx.lineTo(bottomQuarterRightInner.x - 5, bottomQuarterRightInner.y);
    ctx.stroke();

    // center line top
    ctx.beginPath();
    ctx.moveTo(
      (topQuarterLeftInner.x + topQuarterRightInner.x) / 2,
      topQuarterLeftInner.y
    );
    ctx.lineTo(center.x, center.y);
    ctx.stroke();

    // center line bottom
    ctx.beginPath();
    ctx.moveTo(
      (bottomQuarterLeftInner.x + bottomQuarterRightInner.x) / 2,
      bottomQuarterLeftInner.y
    );
    ctx.lineTo(center.x, center.y);
    ctx.stroke();

    // margin left
    ctx.beginPath();
    ctx.moveTo(topLeftInner.x, topLeftInner.y);
    ctx.lineTo(bottomLeftInner.x, bottomLeftInner.y);
    ctx.stroke();

    // margin right
    ctx.beginPath();
    ctx.moveTo(topRightInner.x, topRightInner.y);
    ctx.lineTo(bottomRightInner.x, bottomRightInner.y);
    ctx.stroke();

    ctx.strokeStyle = "transparent";

    // renderer.fake3dTransform(ctx, this.offset, 0, () => {
    //   // draw the top
    //   ctx.fillStyle = lineColor;
    //   ctx.fillRect(-this.width / 2, 0, this.width, 2);
    // });

    // opposite player service line
    // renderer.fake3dTransform(
    //   ctx,
    //   Vector2D.add(this.offset, new Vector2D(0, this.height / 4)),
    //   0,
    //   () => {
    //     // draw the top
    //     ctx.fillStyle = lineColor;
    //     ctx.fillRect(-this.width / 2, 0, this.width, 2);
    //   }
    // );

    // net
    renderer.fake3dTransform(
      ctx,
      Vector2D.add(this.offset, new Vector2D(0, this.height / 2)),
      0,
      () => {
        // draw the middle
        ctx.fillStyle = lineColor;
        ctx.fillRect(-this.width / 2, 0, this.width, 2);
        ctx.fillStyle = "rgba(244,233,233,.2)";
        ctx.fillRect(-this.width / 2, 0, this.width, -this.netElevation);
      }
    );

    // player service line
    // renderer.fake3dTransform(
    //   ctx,
    //   Vector2D.add(this.offset, new Vector2D(0, this.height * 0.75)),
    //   0,
    //   () => {
    //     // draw the top
    //     ctx.fillStyle = lineColor;
    //     ctx.fillRect(-this.width / 2, 0, this.width, 2);
    //   }
    // );

    // renderer.fake3dTransform(
    //   ctx,
    //   Vector2D.add(this.offset, new Vector2D(0, this.height)),
    //   0,
    //   () => {
    //     // draw the top
    //     ctx.fillStyle = lineColor;
    //     ctx.fillRect(-this.width / 2, 0, this.width, 2);
    //   }
    // );
  }
}
