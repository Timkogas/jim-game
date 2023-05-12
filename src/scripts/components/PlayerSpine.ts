import Settings from "../data/Settings";
import Game from "../scenes/Game"
import { ESettings } from "../types/enums";
import Player from "./Player"
enum side {
  LEFT,
  RIGHT
}

export default class PlayerSpine extends Phaser.GameObjects.Container implements ISpineContainer {

  private sgo: SpineGameObject
  private _scene: Game;
  private _animation: 'run' | 'idle' | 'jump' = 'idle'
  private _side: side = side.RIGHT;
  private _left: boolean = false;
  private _right: boolean = false;

  get spine() {
    return this.sgo
  }


  constructor(scene: Game, key: string, anim: string, loop = false) {
    super(scene, scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP), scene.platform.getBounds().top - PlayerSpine.getSizes(scene).height + 15)

    this._scene = scene

    this.sgo = scene.add.spine(0, 0, key, anim, loop)
    const bounds = this.sgo.getBounds()
    const width = bounds.size.x
    const height = bounds.size.y

    this.add(this.sgo)
    scene.physics.add.existing(this)
    scene.add.existing(this)
    this.setPhysicsSize(width, height)

    this.sgo.update(0)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    this.setPhysicsSize(body.width * 0.5, body.height * 0.9)
    body.setGravityY(200);
    body.setBounce(0.2);
  }

  faceDirection(dir: 1 | -1) {
    if (this.sgo.scaleX === dir) {
      return
    }

    this.sgo.scaleX = dir
  }

  setPhysicsSize(width: number, height: number) {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setOffset(width * -0.5, -height)
    body.setSize(width, height)
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
      onStart: ()=>{this._animationStart('jump')},
      onComplete: ()=>{this._animationStart('idle')},
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
      this.left();
    } else if (this._right) {
      this.right();
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
        this.sgo.play(animationName, true)
        this._animation = animationName
    }
  }
}