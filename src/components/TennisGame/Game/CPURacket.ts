import { PlayerRacket } from "./PlayerRacket";
import { Racket } from "./Racket";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";
import { constrain, map, random } from "./utils";

export class CPURacket extends Racket {
  private targetPosition = new Vector2D();
  private maxMovementSpeed = 0;
  private responseTimeFactor = 1;

  private isPlaying = true;

  constructor() {
    super();
    this.setColor("#FF9F00");
  }

  public update(
    tennisCourt: TennisCourt,
    tennisBall: TennisBall,
    player: PlayerRacket
  ) {
    if (!this.isPlaying) return;

    const { top } = tennisCourt.getEdges();
    const halfCourtHeight = tennisCourt.getDimension().height / 2;

    const tennisBallPos = tennisBall.getPosition();

    this.updateBallStrikeProfile(tennisBall, tennisCourt);

    let idealPositionX = tennisBallPos.x;
    let idealPositionY = top;

    const ballPeak = tennisBall.getPeakElevation();
    const distToBall = tennisBall.getDistance(this);

    const maxOffsetDist = halfCourtHeight * 0.2;

    // move back and give the ball space if the tennis ball have not bounced
    if (!tennisBall.getHasBounced() && distToBall < halfCourtHeight) {
      idealPositionY = top - constrain(distToBall, 0, maxOffsetDist);
    }

    const followResponsivenessX = 0.08;
    const followResponsivenessY = 0.03;

    const willOut = tennisBall.predictOut(tennisCourt);

    if (willOut) {
      // go against the ball when the ball is going out
      this.followTargetPosition(
        new Vector2D(tennisBallPos.x - 100, idealPositionY),
        0.01,
        0.01
      );
      return;
    }

    this.followTargetPosition(
      new Vector2D(idealPositionX, idealPositionY),
      followResponsivenessX,
      followResponsivenessY
    );
    this.followBallElevation(tennisCourt, tennisBall);
  }

  private followTargetPosition(
    newPos: Vector2D,
    responsivenessX = 0.01,
    responsivenessY = 0.01
  ) {
    const oldPos = this.getPosition();

    const newPosX = oldPos.x + (newPos.x - oldPos.x) * responsivenessX;
    const newPosY = oldPos.y + (newPos.y - oldPos.y) * responsivenessY;

    this.setPosition(new Vector2D(newPosX, newPosY));
  }

  private updateBallStrikeProfile(
    tennisBall: TennisBall,
    tennisCourt: TennisCourt
  ) {
    const netElevationOffset =
      tennisBall.getElevation() - tennisCourt.getNetElevation();
    const netDirectionCorrectionFactor = map(
      netElevationOffset,
      -tennisCourt.getNetElevation(),
      tennisCourt.getNetElevation(),
      3,
      1
    );

    const maxRandom = 0.1;
    const minRandom = 0.05;
    const randomHitRange = random(minRandom, maxRandom);

    this.setSwingVertAccel(
      map(randomHitRange, minRandom, maxRandom, 2, 0) *
        netDirectionCorrectionFactor
    );
    this.setSwingVelocity(new Vector2D(0, randomHitRange));
  }

  public stopPlaying() {
    this.isPlaying = false;
  }
  public beginPlaying() {
    this.isPlaying = true;
  }
}
