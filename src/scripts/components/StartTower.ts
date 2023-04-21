import Game from '../scenes/Game';

class StartTower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.platform.getBounds().x + 690, scene.platform.getBounds().top, 'start-tower');
    this._scene = scene;
    this._build();
  }
  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setOrigin(0, 1)
  }

  public static create(scene: Game): StartTower {
    return new StartTower(scene);
  }

}

export default StartTower;