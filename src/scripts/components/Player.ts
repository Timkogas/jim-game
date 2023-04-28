import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';
import { ESettings } from '../types/enums';
import Zone from './Zone';

enum side {
  LEFT,
  RIGHT
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP), scene.platform.getBounds().top - Player.getSizes(scene).height, 'capybara-stand');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;
  private _side: side = side.RIGHT;
  private _left: boolean = false;
  private _right: boolean = false;

  private _build(): void {
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers('capybara-walk', { start: 0, end: 7 }),
      frameRate: 10,
    });
    this.scene.anims.create({
      key: 'stand',
      frames: this.scene.anims.generateFrameNumbers('capybara-stand', { start: 0, end: 7 }),
      frameRate: 7,
    });
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.body.setSize(this.width + 10, this.height - 35);
    this.setGravityY(600);
    this.setDepth(10)
    this.setBounce(0.2);
    // const y = this._scene.platform.getBounds().top - this.height / 2;
    // this.setPosition(200, y);
    this._scene.cameras.main.startFollow(this, false, 1, 1, 0, 330);
    this.setCollideWorldBounds(true);
    this.setScale(3.5, 3.5)
  }

  public right(): void {
    this._side = side.RIGHT;
    this.setVelocityX(Settings.getSettingProperty(ESettings.PLAYER_SPEED));
    this.anims.play('walk', true)
  }

  public jump(): void {
    const sign = this._side === side.RIGHT ? 1 : -1;
    const sound = this._scene.sound.add('jumpSound', {volume: 0.3})
    sound.play()
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
    this.setVelocityX(-Settings.getSettingProperty(ESettings.PLAYER_SPEED));
    this.anims.play('walk', true)
  }

  public down(): void {
    this.setVelocityX(0);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (this._side === side.RIGHT) {
      this.flipX = false
    } else {
      this.flipX = true
    }

    if (this._left) {
      this.left();
    } else if (this._right) {
      this.right();
    } else {
      this.body.reset(this.x, this.y);
      if (this._side === side.RIGHT) {
        this.flipX = false
      } else {
        this.flipX = true
      }
      this.anims.play('stand', true)
    }
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

export default Player;