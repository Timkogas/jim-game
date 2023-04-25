import Settings from '../data/Settings';
import Game from '../scenes/Game';

class EndTower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, -scene.platform.getBounds().x - Settings.TOWER_PADDING, scene.platform.getBounds().top - 350, 'end-tower');
    this._scene = scene;
    this._build();
  }
  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setBodySize(200, 700);
  }

  public static create(scene: Game): EndTower {
    return new EndTower(scene);
  }

}

export default EndTower;