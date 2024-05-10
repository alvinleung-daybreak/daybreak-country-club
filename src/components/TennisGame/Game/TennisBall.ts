import { AssetManager } from "./AssetManager/AssetManager";
import { AudioAsset } from "./AssetManager/AudioAsset";
import { CPURacket } from "./CPURacket";
import { Fake3dRenderer } from "./Fake3dRenderer";
import Matrix2D from "./Matrix2D";
import { PlayerRacket } from "./PlayerRacket";
import { Racket } from "./Racket";
import { SoundEffect } from "./SoundEffect";
import { TennisCourt } from "./TennisCourt";
import { WinStateHandler } from "./TennisGame";
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

  private color = "#D4FF00";

  private smashThreshold = 8;

  private isBallOut = false;

  private hitSoundEffects: SoundEffect;
  private strikeSoundEffeect: AudioAsset;

  private hasBounced: boolean = false;
  private peakElevation: number = 0;

  private currentTurn: Racket;

  constructor(
    initialPosition: Vector2D,
    initialVelocity: Vector2D,
    initialVertAccel: number,
    initialTurn: Racket
  ) {
    this.velocity = initialVelocity;
    this.position = initialPosition;
    this.vertAccel = initialVertAccel;

    this.currentTurn = initialTurn;

    // setup sounds
    const assets = AssetManager.getInstance();

    this.hitSoundEffects = new SoundEffect([
      assets.get<AudioAsset>("tennis-hit-1"),
      assets.get<AudioAsset>("tennis-hit-2"),
      assets.get<AudioAsset>("tennis-hit-3"),
    ]);
    this.strikeSoundEffeect = assets.get<AudioAsset>("tennis-strike");
  }

  public getTurn() {
    return this.currentTurn;
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
    if (posYWhenGround < top || posYWhenGround > bottom) {
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

  /**
   * cehck which side the ball lands on, if
   * @param tennisCourt
   * @returns
   */
  private checkBouncedCourtSide(tennisCourt: TennisCourt) {
    const { top, bottom } = tennisCourt.getEdges();
    const tennisCourtCenter = (top + bottom) / 2;
    if (this.position.y > tennisCourtCenter) {
      return -1;
    }
    return 1;
  }

  private onBouncedAgainstGround(
    tennisCourt: TennisCourt,
    player: Racket,
    cpuRacket: Racket,
    onWin: WinStateHandler
  ) {
    if (this.checkIsOut(tennisCourt)) {
      if (this.hasBounced) {
        onWin(this.currentTurn === player ? cpuRacket : player, "out");
      } else {
        onWin(this.currentTurn === player ? player : cpuRacket, "out");
      }
    }

    // bounce on player's own court
    if (
      this.checkBouncedCourtSide(tennisCourt) < 0 &&
      this.currentTurn === cpuRacket
    ) {
      onWin(cpuRacket, "score");
    }
    // bounce on cpu's own court
    if (
      this.checkBouncedCourtSide(tennisCourt) > 0 &&
      this.currentTurn === player
    ) {
      onWin(player, "score");
    }
  }

  private onBouncedAgainstNet(
    player: Racket,
    cpuRacket: Racket,
    onWin: WinStateHandler
  ) {
    onWin(this.currentTurn === player ? player : cpuRacket, "let");
  }

  update(
    t: number,
    player: Racket,
    cpuRacket: Racket,
    tennisCourt: TennisCourt,
    onWin: WinStateHandler,
    hasWinner: boolean
  ) {
    // step the ball position
    this.vertAccel += this.gravity;
    this.elevation += this.vertAccel;

    // create an impulse for bouncing up
    if (this.elevation <= 0) {
      this.onBouncedAgainstGround(tennisCourt, player, cpuRacket, onWin);
      this.vertAccel *= -this.groundBounciness;
      this.hasBounced = true;
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

      // the other player win when it hits the net
      this.onBouncedAgainstNet(player, cpuRacket, onWin);
    }

    // allow detection as long as the game is playing
    if (!hasWinner) {
      // check if hit player position
      const canPlayerHit = t - this.lastPlayerHit > this.playerHitCooldown;
      const canCpuHit = t - this.lastCpuHit > this.cpuHitCooldown;

      // if (canPlayerHit) {
      //   this.color = "#1B2420";
      // } else {
      //   this.color = "#1BF420";
      // }

      if (canPlayerHit && this.hitTestWithRacket(player)) {
        this.hasBounced = false; // reset bounce hit
        this.peakElevation = 0; // reset peak elevation after hit
        this.currentTurn = cpuRacket; // switch turn after hit

        this.lastPlayerHit = t;
        const isSmash = this.resolveRacketCollision(player);
        if (isSmash) {
          this.strikeSoundEffeect.trigger();
        } else {
          this.hitSoundEffects.trigger();
        }
      }

      if (canCpuHit && this.hitTestWithRacket(cpuRacket)) {
        this.hasBounced = false; // reset bounce hit
        this.peakElevation = 0; // reset peak elevation after hit
        this.currentTurn = player; // switch turn after hit

        this.lastCpuHit = t;
        const isSmash = this.resolveRacketCollision(cpuRacket);
        if (isSmash) {
          this.strikeSoundEffeect.trigger();
        } else {
          this.hitSoundEffects.trigger();
        }
      }
    }
    // update the ball position
    if (this.position.y > -600)
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

  render(ctx: CanvasRenderingContext2D, renderer: Fake3dRenderer) {
    // ctx.rect(this.position.x, this.position.y, this.size, this.size);
    // ctx.fillText(`${this.position.x}`, 50, 50);

    renderer.fake3dTransform(ctx, this.position, 0, () => {
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

    renderer.fake3dTransform(ctx, this.position, this.elevation, () => {
      // ball
      // ctx.fillStyle = "#D4FF00";
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}
