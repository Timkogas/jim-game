import Session from '../data/Session';
import UI from '../scenes/UI';

class Score extends Phaser.GameObjects.Text {
  constructor(scene: UI) {
    super(scene, scene.cameras.main.width - 50, 50, Session.getScore().toString(), {
      fontSize: '70px',
      color: '#000000'
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

export default Score;