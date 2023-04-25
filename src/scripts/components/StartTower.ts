import Settings from '../data/Settings';
import Game from '../scenes/Game';

class StartTower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.platform.getBounds().x + Settings.TOWER_PADDING, scene.platform.getBounds().top - 350, 'start-tower');
    this._scene = scene;
    this._build();
  }
  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setBodySize(200, 700);
  }

  public static create(scene: Game): StartTower {
    return new StartTower(scene);
  }

}

export default StartTower;