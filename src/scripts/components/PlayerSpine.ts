import Settings from "../data/Settings";
import Game from "../scenes/Game"
import { ESettings } from "../types/enums";
import SpineContainer from "./SpineContainer";
enum side {
  LEFT,
  RIGHT
}

export default class PlayerSpine extends SpineContainer {
  private _scene: Game;
  private _animation: 'run' | 'idle' | 'jump' = 'idle'
  private _side: side = side.RIGHT;
  private _left: boolean = false;
  private _right: boolean = false;

  constructor(scene: Game, key: string, anim: string, loop = false) {
    super(scene, scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP), scene.platform.getBounds().top - PlayerSpine.getSizes(scene).height + 15, key, anim, loop)
    this._scene = scene
    this.setPhysicsSize(this.body.width * 0.5, this.body.height * 0.9)
    this.body.setGravityY(200);
    this.body.setBounce(0.2);
    this.setScale(0.5)
  }

  public right(): void {
    this._side = side.RIGHT;
    this.faceDirection(1)
    this._animationStart('run')
    this.body.velocity.x = Settings.getSettingProperty(ESettings.PLAYER_SPEED)
  }

  public jump(): void {
    const sign = this._side === side.RIGHT ? 1 : -1;
    Settings.sounds.play('jumpSound')
    this._scene.add.tween({
      targets: this,
      x: this.x + (Settings.getSettingProperty(ESettings.PLAYER_JUMP_POINTS) * sign * 2),
      duration: 1300,
      onStart: () => { this._animationStart('jump'); this.setPhysicsSize(this.width + 200, this.spine.height + 400) },
      onComplete: () => { this._animationStart('idle'); this.setPhysicsSize(this.width + 200, this.spine.height - 50) },
      ease: ''
    });
  }

  public left(): void {
    this._side = side.LEFT;
    this.faceDirection(-1)
    this._animationStart('run')
    this.body.velocity.x = -Settings.getSettingProperty(ESettings.PLAYER_SPEED)
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

  protected preUpdate(time: number, delta: number): void {
    super.update(time, delta);
    if (this._left) {
      if (this._animation !== 'jump') {
        this.left();
      }
    } else if (this._right) {
      if (this._animation !== 'jump') {
        this.right();
      }
    } else {
      if (this._side === side.RIGHT) {
        this.faceDirection(1)
      } else {
        this.faceDirection(-1)
      }
      if (this._animation !== 'jump') {
        this._animationStart('idle')
      }
      this.body.velocity.x = 0
    }
  }

  private _animationStart(animationName: 'run' | 'idle' | 'jump') {
    if (this._animation !== animationName) {
      this.spine.play(animationName, true)
      this._animation = animationName
    }
  }
}