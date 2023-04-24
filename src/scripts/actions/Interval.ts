import Boot from '../scenes/Boot';

class Interval {
  constructor(scene: Boot) {
    this._scene = scene;
    this.init();
  }

  private _scene: Boot;

  private init(): void {
    this._scene.time.addEvent({ delay: 1000, callback: (): void => {
      if (this._scene.scene.isActive('Game')) {
        this._game();
      }
    }, loop: true });
  }

  private _game(): void {
    
  }
}

export default Interval;