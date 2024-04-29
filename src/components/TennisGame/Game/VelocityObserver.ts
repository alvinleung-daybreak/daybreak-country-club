import Vector2D from "./Vector2D";

export class VelocityObserver {
  private movmentRecordCount = 3;
  private movements: Vector2D[] = [];

  constructor() {
    for (let i = 0; i < this.movmentRecordCount; i++) {
      this.movements.push(new Vector2D());
    }
  }

  /**
   * Observe movement
   * @param position : ;
   */
  public recordMovement(position: Vector2D) {
    // remove the last one
    this.movements.splice(this.movements.length - 1, 1);
    // insert to the beginning
    this.movements.unshift(position);
  }

  /**
   * Get the average Velocity
   * @returns
   */
  public getVelocity() {
    let maxVelX = 0;
    let maxVelY = 0;
    for (let i = 0; i < this.movmentRecordCount; i++) {
      const velX = this.movements[i].x;
      const velY = this.movements[i].y;

      maxVelX = Math.abs(velX) > Math.abs(maxVelX) ? velX : maxVelX;
      maxVelY = Math.abs(velY) > Math.abs(maxVelY) ? velY : maxVelY;
    }

    return new Vector2D(this.movements[0].x, maxVelY);
  }
}
