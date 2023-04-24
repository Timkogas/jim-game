import Session from '../data/Session';
import UI from '../scenes/UI';

class PuppyLives extends Phaser.GameObjects.Text {
  constructor(scene: UI) {
    super(scene, scene.cameras.main.width - 50, 120, Session.getPuppyLives().toString(), {
      fontSize: '70px',
      color: 'red'
    });
    this._scene = scene;
    this._build();
  }

  private _scene: UI;

  private _build(): void {
    this._scene.add.existing(this);
    this.setOrigin(1, 0);
  }
}

export default PuppyLives;