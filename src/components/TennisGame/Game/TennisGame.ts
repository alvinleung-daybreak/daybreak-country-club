import { AssetManager } from "./AssetManager/AssetManager";
import { AudioAsset } from "./AssetManager/AudioAsset";
import { CPURacket } from "./CPURacket";
import { PlayerRacket } from "./PlayerRacket";
import { Racket } from "./Racket";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";

export type WinStateHandler = (racket: Racket, reason: string) => void;

export class TennisGame {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animFrame = 0;
  private mouse: Vector2D = new Vector2D(0, 0);

  private width: number = 0;
  private height: number = 0;

  private playerRacket: PlayerRacket;
  private cpuRacket: CPURacket;
  private ball: TennisBall;
  private tennisCourt: TennisCourt;

  private winner: string | undefined = undefined;

  // private cpu: PlayerRacket = new PlayerRacket();

  private boundingClientRectWidth = 0;
  private boundingClientRectHeight = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.resize(this.canvas.width, this.canvas.height);

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("resize", this.handleScreenResize.bind(this));
    this.handleScreenResize();

    // init
    const { playerRacket, cpuRacket, ball, tennisCourt } =
      this.getInitialGameStates();
    this.playerRacket = playerRacket;
    this.cpuRacket = cpuRacket;
    this.ball = ball;
    this.tennisCourt = tennisCourt;

    // loop the ambience audio
    const assets = AssetManager.getInstance();
    assets.get<AudioAsset>("ambience-combined").loop();

    this.update(0);
  }

  handleMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX / this.boundingClientRectWidth;
    this.mouse.y = e.clientY / this.boundingClientRectHeight;
  }
  handleScreenResize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.boundingClientRectHeight = bounds.height;
    this.boundingClientRectWidth = bounds.width;
  }

  private getInitialGameStates() {
    const courtWidth = this.width * 0.5;
    const tennisCourt = new TennisCourt(
      new Vector2D(this.width / 2, 200),
      courtWidth
    );

    const playerRacket = new PlayerRacket();
    const cpuRacket = new CPURacket(
      new Vector2D(courtWidth / 2 + tennisCourt.getEdges().left, 0)
    );
    const ball = new TennisBall(
      new Vector2D(this.width / 2, tennisCourt.getEdges().top + 50),
      new Vector2D(Math.random() * 3 - 1, 5),
      1,
      playerRacket
    );

    return { tennisCourt, playerRacket, cpuRacket, ball };
  }

  private onWin(racket: Racket, reason: string) {
    if (this.winner) {
      console.log("winner has been decided");
      return;
    }

    if (racket === this.playerRacket) {
      console.log("player wins");
      this.winner = "player";

      const assets = AssetManager.getInstance();
      assets.get<AudioAsset>("ambience-cheer").play();
    }
    if (racket === this.cpuRacket) {
      console.log("cpu wins");
      this.winner = "cpu";
    }
  }

  update(t: number) {
    const hasWinner = this.winner !== undefined;

    // update the game logic here
    this.playerRacket.update(this.tennisCourt, this.ball, this.mouse);
    this.cpuRacket.update(
      this.tennisCourt,
      this.ball,
      this.playerRacket,
      hasWinner
    );

    this.ball.update(
      t,
      this.playerRacket,
      this.cpuRacket,
      this.tennisCourt,
      this.onWin.bind(this),
      hasWinner
    );

    // begin the rendering
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillStyle = "#FFF";
    this.context.fillRect(0, 0, this.width, this.height);

    // render the tennis court
    this.tennisCourt.render(this.context);

    // render the racket
    this.cpuRacket.render(this.context);
    this.ball.render(this.context);
    this.playerRacket.render(this.context);

    this.animFrame = requestAnimationFrame(this.update.bind(this));
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }
  destory() {
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleScreenResize);
    cancelAnimationFrame(this.animFrame);
  }
}

export function fake3dTransform(
  ctx: CanvasRenderingContext2D,
  position: Vector2D,
  elevation: number,
  draw: () => void
) {
  // const tiltFactor = 0.99;
  // const height = 600;
  const foreShorteningScaleFactor = (position.y + 700) * 0.002;
  const renderingScale = 0.3;

  const elevationHeightFactor = 0.3;
  const yScaleCompress = 0.4;

  const viewportWidth = 1000;
  const viewportHeight = 600;

  // const yOriginOffset = viewportHeight * 0.2;
  const yOriginOffset = 100;
  const yOriginOffsetPostTransform = 300;

  ctx.save();
  // easy draw
  // ctx.translate(position.x, position.y);

  // complex draw
  ctx.translate(
    0,
    -elevation * foreShorteningScaleFactor * elevationHeightFactor
  );

  ctx.translate(
    (viewportWidth / 2) * (1 - foreShorteningScaleFactor * renderingScale) +
      position.x * foreShorteningScaleFactor * renderingScale,
    yOriginOffset
  );

  ctx.translate(
    0,
    position.y * yScaleCompress * foreShorteningScaleFactor * renderingScale
  );
  ctx.scale(foreShorteningScaleFactor, foreShorteningScaleFactor);
  ctx.scale(renderingScale, renderingScale);

  draw();
  ctx.restore();
}

// export function getPointAndScale3D(position: Vector2D, elevation: number) {
//   return {};
// }
