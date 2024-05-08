import { AssetManager } from "./AssetManager/AssetManager";
import { AudioAsset } from "./AssetManager/AudioAsset";
import Matrix2D from "./Matrix2D";
import { Racket } from "./Racket";
import { SoundEffect } from "./SoundEffect";
import { TennisCourt } from "./TennisCourt";
import { fake3dTransform } from "./TennisGame";
import Vector2D from "./Vector2D";
import { constrain, map } from "./utils";

export class TennisBall {
  private position: Vector2D = new Vector2D();
  private elevation: number = 120;
  private vertAccel: number = 1;

  private gravity: number = -0.05;
  private groundBounciness: number = 1;

  private velocity: Vector2D = new Vector2D();
  private size = 4;

  private lastPlayerHit = 0;
  private playerHitCooldown = 800;
  private lastCpuHit = 0;
  private cpuHitCooldown = 500;

  private color = "#1B2420";

  private smashThreshold = 8;

  private isBallOut = false;

  private hitSoundEffects: SoundEffect;
  private strikeSoundEffeect: AudioAsset;

  private hasBounced: boolean = false;
  private peakElevation: number = 0;

  constructor(initialPosition: Vector2D, initialVelocity: Vector2D) {
    this.velocity = initialVelocity;
    this.position = initialPosition;

    // setup sounds
    const assets = AssetManager.getInstance();

    this.hitSoundEffects = new SoundEffect([
      assets.get<AudioAsset>("tennis-hit-1"),
      assets.get<AudioAsset>("tennis-hit-2"),
      assets.get<AudioAsset>("tennis-hit-3"),
    ]);
    this.strikeSoundEffeect = assets.get<AudioAsset>("tennis-strike");
  }

  public getElevation() {
    return this.elevation;
  }

  public getPosition() {
    return this.position;
  }

  public getHasBounced() {
    return this.hasBounced;
  }

  public getPeakElevation() {
    return this.peakElevation;
  }

  public getIsBallOut() {
    return this.isBallOut;
  }

  public getDistance(racket: Racket) {
    const distToBall = Vector2D.distance(
      this.getPosition(),
      racket.getPosition()
    );
    return distToBall;
  }

  private predictFramesToGround() {
    let simElevation = this.elevation;
    let simVertSpeed = 0;

    let frames = 0;
    while (simElevation > 0) {
      simVertSpeed += this.gravity;
      simElevation += simVertSpeed;
      frames++;
    }

    return frames;
  }

  public predictOut(court: TennisCourt) {
    const framesToGround = this.predictFramesToGround();

    const { left, right, top, bottom } = court.getEdges();

    const posXWhenGround = this.position.x + this.velocity.x * framesToGround;
    if (posXWhenGround < left || posXWhenGround > right) {
      return true;
    }

    const posYWhenGround = this.position.y + this.velocity.y * framesToGround;
    if ((posYWhenGround < top || posYWhenGround > bottom) && !this.hasBounced) {
      return true;
    }

    return false;
  }

  private checkIsOut(tennisCourt: TennisCourt) {
    const { top, right, bottom, left } = tennisCourt.getEdges();
    // Handling when the ball is out of the playzone or not
    if (this.position.y > bottom || this.position.y < top) {
      return true;
    }
    if (this.position.x > right || this.position.x < left) {
      return true;
    }

    return false;
  }

  update(
    t: number,
    player: Racket,
    cpuRacket: Racket,
    tennisCourt: TennisCourt,
    onWin: (racket: Racket) => void
  ) {
    // step the ball position
    this.vertAccel += this.gravity;
    this.elevation += this.vertAccel;

    // create an impulse for bouncing up
    if (this.elevation <= 0) {
      this.vertAccel *= -this.groundBounciness;
      this.hasBounced = true;

      if (this.checkIsOut(tennisCourt)) onWin(player);
    }

    // record how how high the ball has hit
    if (this.peakElevation < this.elevation) {
      this.peakElevation = this.elevation;
    }

    const { top, right, bottom, left } = tennisCourt.getEdges();

    // Handling net
    if (
      Math.abs(
        this.position.y - (top + tennisCourt.getDimension().height / 2)
      ) < 5 &&
      this.elevation < tennisCourt.getNetElevation() &&
      this.position.x > left &&
      this.position.x < right
    ) {
      // the ball is hitting the net
      this.velocity.y = -this.velocity.y;
    }

    // check if hit player position
    const canPlayerHit = t - this.lastPlayerHit > this.playerHitCooldown;
    const canCpuHit = t - this.lastCpuHit > this.cpuHitCooldown;

    if (canPlayerHit) {
      this.color = "#1B2420";
    } else {
      this.color = "#1BF420";
    }

    if (canPlayerHit && this.hitTestWithRacket(player)) {
      this.hasBounced = false; // reset bounce hit
      this.peakElevation = 0; // reset peak elevation after hit

      this.lastPlayerHit = t;
      const isStrike = this.resolveRacketCollision(player);
      if (isStrike) {
        this.strikeSoundEffeect.trigger();
      } else {
        this.hitSoundEffects.trigger();
      }
    }

    if (canCpuHit && this.hitTestWithRacket(cpuRacket)) {
      this.hasBounced = false; // reset bounce hit
      this.peakElevation = 0; // reset peak elevation after hit

      this.lastCpuHit = t;
      const isStrike = this.resolveRacketCollision(cpuRacket);
      if (isStrike) {
        this.strikeSoundEffeect.trigger();
      } else {
        this.hitSoundEffects.trigger();
      }
    }
    // update the ball position
    this.position = Vector2D.add(this.position, this.velocity);
  }

  /**
   * Handle the collision with racket vs ball, returns whether it is a strike
   * @param racket
   */
  private resolveRacketCollision(racket: Racket): boolean {
    // correct it to player's position
    this.position = new Vector2D(this.position.x, racket.getPosition().y);

    const racketSwingVel = racket.getSwingVelocity();
    const racketSwingMag = Vector2D.distance(
      new Vector2D(0, 0),
      racketSwingVel
    );

    const playerSwingDirection = Vector2D.normalize(racketSwingVel);

    // how responsive the ball is to change direction from the player input
    const ballDirectionDampening = 0.0;

    const swingPowerFactor = 6;
    const MAX_SWING_INPUT = 0.1;
    const MIN_SWING_INPUT = 0.03;
    const normalizedSwing = map(
      racketSwingMag,
      MIN_SWING_INPUT,
      MAX_SWING_INPUT,
      0,
      1
    );

    const swingOutput = normalizedSwing * swingPowerFactor;

    // bounce off
    const newVelX =
      this.velocity.x * ballDirectionDampening + playerSwingDirection.x * 10;

    const newVelY =
      -this.velocity.y * 0.6 + swingOutput * playerSwingDirection.y;

    let isSmash = false;
    let strikeAngle = map(this.elevation, 0, 300, 2, -3);

    if (Math.abs(newVelY) > this.smashThreshold) {
      isSmash = true;
    }

    // we want
    // 1. the more forceful it is, the more straight the ball will be
    // 2. default uptilt

    // const vertcialAccelInput = 3 * (1 - normalizedSwing);

    // neutralize the vertical acceleration
    this.vertAccel = isSmash ? strikeAngle : racket.getSwingVertAccel();

    // apply the input to velocity
    this.velocity = new Vector2D(newVelX, newVelY);

    return isSmash;
  }

  render(ctx: CanvasRenderingContext2D) {
    // ctx.rect(this.position.x, this.position.y, this.size, this.size);
    ctx.fillText(`${this.position.x}`, 50, 50);

    fake3dTransform(ctx, this.position, 0, () => {
      // shadow
      ctx.fillStyle = "rgba(0,0,0,.2)";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
      // ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();

      // debug
      // ctx.fillStyle = "rgba(0,0,0,1)";
      // ctx.fillText(`${Math.floor(this.elevation)}`, 10, 10);
    });

    fake3dTransform(ctx, this.position, this.elevation, () => {
      // ball
      // ctx.fillStyle = "#D4FF00";
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  private hitTestWithRacket(racket: Racket): boolean {
    // hit test
    const racketWidth = racket.getWidth();
    const racketPos = racket.getPosition();

    const racketLeftEdge = racketPos.x - racketWidth / 2;
    const racketRightEdge = racketPos.x + racketWidth / 2;

    if (this.position.x < racketLeftEdge || this.position.x > racketRightEdge) {
      return false;
    }
    if (Math.abs(this.position.y - racketPos.y) < 30) {
      return true;
    }
    return false;
  }
}
