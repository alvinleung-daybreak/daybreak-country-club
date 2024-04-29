import { PlayerRacket } from "./PlayerRacket";
import { Racket } from "./Racket";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";
import { map, random } from "./utils";

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

    const tennisBallPos = tennisBall.getPosition();

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

    this.setPosition(new Vector2D(tennisBallPos.x, top));
    this.followBallElevation(tennisCourt, tennisBall);
  }

  public stopPlaying() {
    this.isPlaying = false;
  }
  public beginPlaying() {
    this.isPlaying = true;
  }
}
