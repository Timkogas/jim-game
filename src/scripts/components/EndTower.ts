import Game from '../scenes/Game';

const PADDING = 850

class EndTower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, -scene.platform.getBounds().x - PADDING, scene.platform.getBounds().top, 'end-tower');
    this._scene = scene;
    this._build();
  }
  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setOrigin(0, 1)
  }

  public static create(scene: Game): EndTower {
    return new EndTower(scene);
  }

}

export default EndTower;