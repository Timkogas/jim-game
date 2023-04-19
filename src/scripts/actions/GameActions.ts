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
    this._scene.platform = this._scene.add.tileSprite(0, height - 15, width * 2, 32, 'platform');
    this._scene.platform.body = new Phaser.Physics.Arcade.StaticBody(this._scene.physics.world, this._scene.platform);

    this._scene.player = new Player(this._scene);


    console.log(this._scene.platform.getBounds())
    console.log(this._scene.platform.originX)

    this._scene.physics.add.collider(this._scene.player, this._scene.platform);
    this._collisions();
    this._controls();
  }

  private _collisions(): void {
   
  }

  private _controls(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const cursors = this._scene.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      this._scene.player.jump();
    });
    cursors.down.on('down', (): void => {
      this._scene.player.down();
    });

  }

}

export default GameActions;