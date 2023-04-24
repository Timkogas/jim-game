import Session from '../data/Session';
import UI from '../scenes/UI';

class PlayerHelath extends Phaser.GameObjects.Text {
  constructor(scene: UI) {
    super(scene, 0 + 150, 50, Session.getPlayerHealth().toString(), {
      fontSize: '70px',
      color: 'black'
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

export default PlayerHelath;