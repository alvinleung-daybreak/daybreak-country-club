import { AssetManager } from "./AssetManager/AssetManager";
import { ImageAsset } from "./AssetManager/ImageAsset";
import { Fake3dRenderer } from "./Fake3dRenderer";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";
import { constrain, map } from "./utils";

export class Racket {
  private position: Vector2D = new Vector2D();
  private elevation: number = 50;

  private swingVertAccel: number = 0;
  private swingVelocity: Vector2D = new Vector2D();
  private width = 50;
  private color = "rgba(0,0,0,.8)";

  private racketImage: ImageAsset;

  private maxXPosition: number = 0;
  private minXPosition: number = 0;
  private elevationRotationOffsetBeginHeight: number = 0;

  constructor() {
    const assets = AssetManager.getInstance();
    this.racketImage = assets.get<ImageAsset>("racket-image");
  }

  public setPosition(position: Vector2D) {
    this.position = position;
  }
  public getPosition() {
    return this.position;
  }

  public setSwingVelocity(swingVelocity: Vector2D) {
    this.swingVelocity = swingVelocity;
  }
  public getSwingVelocity() {
    return this.swingVelocity;
  }

  public getWidth() {
    return this.width;
  }

  public setColor(color: string) {
    this.color = color;
  }

  // the vertical angle for the swing
  public getSwingVertAccel() {
    return this.swingVertAccel;
  }
  // the vertical angle for the swing
  protected setSwingVertAccel(accel: number) {
    this.swingVertAccel = accel;
  }

  public setElevation(elevation: number) {
    this.elevation = elevation;
  }

  public followBallElevation(tennisCourt: TennisCourt, tennisBall: TennisBall) {
    const distToBall = tennisBall.getDistance(this);

    this.maxXPosition = tennisCourt.getEdges().left;
    this.minXPosition = tennisCourt.getEdges().right;
    this.elevationRotationOffsetBeginHeight = tennisCourt.getNetElevation();

    const maxDistWithInfluence = tennisCourt.getDimension().height / 2;
    const elevationInfluence =
      1 - constrain(distToBall / maxDistWithInfluence, 0, 1);

    this.setElevation(
      elevationInfluence * (tennisBall.getElevation() - 70) + 70
    );
  }

  public render(ctx: CanvasRenderingContext2D, renderer: Fake3dRenderer) {
    const halfWidth = this.width / 2;
    renderer.fake3dTransform(ctx, this.position, 0, () => {
      //shadow
      ctx.fillStyle = "rgba(0,0,0,.2)";
      ctx.fillRect(-halfWidth, 0, this.width, 2);
    });

    renderer.fake3dTransform(ctx, this.position, this.elevation, () => {
      ctx.fillStyle = this.color;

      // for debug
      //ctx.fillRect(-halfWidth, 0, this.width, this.width);

      const img = this.racketImage.getImage();

      ctx.translate(-10, 0);
      ctx.scale(0.7, 0.7);

      const rotation = map(
        this.position.x,
        this.minXPosition,
        this.maxXPosition,
        0.7,
        -0.7
      );

      const elevationRotationOffset = map(
        this.elevation,
        0,
        this.width,
        rotation * 4,
        0
      );

      ctx.rotate(rotation - 1.5 + elevationRotationOffset);
      ctx.drawImage(img, -img.width * 0.8, 0);
    });
  }
}
