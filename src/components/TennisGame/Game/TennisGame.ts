import { m } from "framer-motion";
import { AssetManager } from "./AssetManager/AssetManager";
import { AudioAsset } from "./AssetManager/AudioAsset";
import { CPURacket } from "./CPURacket";
import { Fake3dRenderer } from "./Fake3dRenderer";
import { PlayerRacket } from "./PlayerRacket";
import { Racket } from "./Racket";
import { TennisBall } from "./TennisBall";
import { TennisCourt } from "./TennisCourt";
import Vector2D from "./Vector2D";

export type WinStateHandler = (racket: Racket, reason: string) => void;
export type GameResultHandler = (winner: string, reason: string) => void;

export class TennisGame {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animFrame = 0;
  private mouse: Vector2D = new Vector2D(0, 0);

  private width: number = 0;
  private height: number = 0;

  private renderer: Fake3dRenderer;

  private playerRacket: PlayerRacket;
  private cpuRacket: CPURacket;
  private ball: TennisBall;
  private tennisCourt: TennisCourt;

  private winner: string | undefined = undefined;

  // private cpu: PlayerRacket = new PlayerRacket();

  private boundingClientRect = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  };

  private gameResultHandler: GameResultHandler;

  constructor(canvas: HTMLCanvasElement, gameResultHandler: GameResultHandler) {
    this.canvas = canvas;
    this.resize(this.canvas.width, this.canvas.height);

    this.gameResultHandler = gameResultHandler;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.addEventListener("pointermove", this.handleMouseMove.bind(this));
    window.addEventListener("resize", this.handleScreenResize.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));
    this.handleScreenResize();

    // init renderer
    this.renderer = new Fake3dRenderer(this.width, this.height);

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
    this.mouse.x =
      (e.clientX - this.boundingClientRect.left) /
      this.boundingClientRect.width;
    this.mouse.y =
      (e.clientY - this.boundingClientRect.top) /
      this.boundingClientRect.height;
  }
  handleScreenResize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.boundingClientRect = bounds;
  }

  handleScroll() {
    const bounds = this.canvas.getBoundingClientRect();
    this.boundingClientRect = bounds;
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

    this.gameResultHandler(this.winner as string, reason);
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
    this.context.fillStyle = "#1B2420";
    this.context.fillRect(0, 0, this.width, this.height);

    // render the tennis court
    this.tennisCourt.render(this.context, this.renderer);

    // render the racket
    this.cpuRacket.render(this.context, this.renderer);
    this.ball.render(this.context, this.renderer);
    this.playerRacket.render(this.context, this.renderer);

    this.animFrame = requestAnimationFrame(this.update.bind(this));
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }
  destory() {
    this.canvas.removeEventListener("pointermove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleScreenResize);
    window.removeEventListener("scroll", this.handleScroll);
    cancelAnimationFrame(this.animFrame);
  }
}
