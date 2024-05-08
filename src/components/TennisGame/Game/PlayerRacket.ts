import { Racket } from "./Racket";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";
import { VelocityObserver } from "./VelocityObserver";
import { constrain, map } from "./utils";

export class PlayerRacket extends Racket {
  private prevMousePosition: Vector2D = new Vector2D();
  // private swingRange = 100;

  private velObserver = new VelocityObserver();

  constructor() {
    super();
  }

  public getWidth() {
    return super.getWidth() * 3;
  }

  public update(
    tennisCourt: TennisCourt,
    tennisBall: TennisBall,
    newMousePosition: Vector2D
  ): void {
    const velocity = Vector2D.subtract(
      newMousePosition,
      this.prevMousePosition
    );
    this.prevMousePosition = new Vector2D(
      newMousePosition.x,
      newMousePosition.y
    );

    //
    this.velObserver.recordMovement(velocity);
    const avgVelocity = this.velObserver.getVelocity();

    // console.log(avgVelocity);

    const netElevationOffset =
      tennisBall.getElevation() - tennisCourt.getNetElevation();

    const MIN_SWING_OUTPUT = 1;
    const MAX_SWING_OUTPUT = 4;
    const netDirectionCorrectionFactor = map(
      netElevationOffset,
      -tennisCourt.getNetElevation(),
      tennisCourt.getNetElevation() * 2,
      MAX_SWING_OUTPUT,
      MIN_SWING_OUTPUT
    );

    const MAX_SWING_INPUT = -0.1;
    const MIN_SWING_INPUT = -0.03;

    const MAX_ANGLE_OUTPUT = -1;
    const MIN_ANGLE_OUTPUT = 0;

    const vertcalAccel = map(
      avgVelocity.y,
      MIN_SWING_INPUT,
      MAX_SWING_INPUT,
      MIN_ANGLE_OUTPUT,
      MAX_ANGLE_OUTPUT // go slightly down when the use strike hard
    );
    this.setSwingVertAccel(vertcalAccel + netDirectionCorrectionFactor);
    this.setSwingVelocity(Vector2D.multiply(avgVelocity, 1.5));

    const courtEdges = tennisCourt.getEdges();

    const tennisCourtDim = tennisCourt.getDimension();
    const swingRange = tennisCourtDim.height / 2;

    const xOffset = map(
      newMousePosition.x,
      0.2,
      0.8,
      tennisCourtDim.width * -0.3,
      tennisCourtDim.width * 1.3
    );
    const yOffset = map(newMousePosition.y, 0.2, 0.8, 0, swingRange + 200);

    const newX = xOffset + courtEdges.left;
    const newY = courtEdges.bottom - swingRange + yOffset;

    this.setPosition(new Vector2D(newX, newY));
    this.followBallElevation(tennisCourt, tennisBall);
    // this.setPosition();
  }
}
