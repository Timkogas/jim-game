import Player from '../components/Player';
import Zone from '../components/Zone';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import { screen } from '../types/enums';

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  private _scene: Game;

  public build(): void {
    const { width, height } = this._scene.cameras.main;
    console.log(width)
    const platform = this._scene.physics.add.staticSprite(0, height - 15, 'platform');
    platform.setBodySize(width*2, 30)
    platform.scaleX = 15

    this._scene.player = new Player(this._scene);

    this._scene.physics.add.collider(this._scene.player, platform);
    this._collisions();
    this._controls();
  }

  private _collisions(): void {
   
  }

  private _controls(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const cursors = this._scene.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      this._scene.player.up();
    });
    cursors.right.on('down', (): void => {
      this._scene.player.right();
    });
    cursors.left.on('down', (): void => {
      this._scene.player.left();
    });
    cursors.down.on('down', (): void => {
      this._scene.player.down();
    });
    cursors.up.on('down', (): void => {
      this._scene.player.up();
    });

  }

}

export default GameActions;