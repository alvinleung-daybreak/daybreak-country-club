import { fake3dTransform } from "./TennisGame";
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

  public render(ctx: CanvasRenderingContext2D) {
    fake3dTransform(ctx, this.offset, 0, () => {
      // draw the top
      ctx.fillStyle = "#999";
      ctx.fillRect(-this.width / 2, 0, this.width, 2);
    });

    // opposite player service line
    fake3dTransform(
      ctx,
      Vector2D.add(this.offset, new Vector2D(0, this.height / 4)),
      0,
      () => {
        // draw the top
        ctx.fillStyle = "#999";
        ctx.fillRect(-this.width / 2, 0, this.width, 2);
      }
    );

    fake3dTransform(
      ctx,
      Vector2D.add(this.offset, new Vector2D(0, this.height / 2)),
      0,
      () => {
        // draw the middle
        ctx.fillStyle = "#999";
        ctx.fillRect(-this.width / 2, 0, this.width, 2);
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(-this.width / 2, 0, this.width, -this.netElevation);
      }
    );

    // player service line
    fake3dTransform(
      ctx,
      Vector2D.add(this.offset, new Vector2D(0, this.height * 0.75)),
      0,
      () => {
        // draw the top
        ctx.fillStyle = "#999";
        ctx.fillRect(-this.width / 2, 0, this.width, 2);
      }
    );

    fake3dTransform(
      ctx,
      Vector2D.add(this.offset, new Vector2D(0, this.height)),
      0,
      () => {
        // draw the top
        ctx.fillStyle = "#999";
        ctx.fillRect(-this.width / 2, 0, this.width, 2);
      }
    );
  }
}
