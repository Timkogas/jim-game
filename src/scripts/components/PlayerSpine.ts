import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';
import { ESettings } from '../types/enums';
import Zone from './Zone';

enum side {
  LEFT,
  RIGHT
}

class PlayerSpine extends SpineGameObject {
  constructor(scene: Game) {
    super(scene, window.SpinePlugin, 400, 600, 'spineboy', 'idle', true);
    this._scene = scene;
    this._build();
  }

  private _scene: Game;
  private _side: side = side.RIGHT;
  private _left: boolean = false;
  private _right: boolean = false;

  private _build(): void {
    this._scene.add.spine(400, 600, 'spineboy', 'idle', true)
  }

  public right(): void {
    this._side = side.RIGHT;
  }

  public jump(): void {
    const sign = this._side === side.RIGHT ? 1 : -1;
    Settings.sounds.play('jumpSound')
    this._scene.add.tween({
      targets: this,
      x: this.x + (Settings.getSettingProperty(ESettings.PLAYER_JUMP_POINTS) * sign),
      duration: 200,

      ease: ''
    });
  }

  public left(): void {
    this._side = side.LEFT;
    this.flipX = true
  }

  public down(): void {
  }

  protected preUpdate(time: number, delta: number): void {

  }

  private static getSizes(scene: Phaser.Scene): Phaser.Geom.Rectangle {
    return scene.textures.list['capybara-stand'].frames.__BASE;
  }

  public getLeft(): boolean {
    return this._left
  }
  public setLeft(left: boolean): void {
    this._left = left
  }
  public getRight(): boolean {
    return this._right
  }
  public setRight(right: boolean): void {
    this._right = right
  }
}

export default PlayerSpine;