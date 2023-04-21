import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';

const JUMP_POINTS = 200;
const SPEED = 300;

enum side {
  LEFT,
  RIGHT
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.startTower.getBounds().x + 400, scene.platform.getBounds().top - Player.getSizes(scene).height / 2, 'player');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;
  private _controls: Phaser.Types.Input.Keyboard.CursorKeys;
  private _side: side = side.RIGHT;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.body.setSize(this.width, this.height);
    this.setGravityY(600);
    this.setBounce(0.2);
    // const y = this._scene.platform.getBounds().top - this.height / 2;
    // this.setPosition(200, y);
    this._controls = this._scene.input.keyboard.createCursorKeys();
    this._scene.cameras.main.startFollow(this, false, 1, 1, 0, 330);
    this.setCollideWorldBounds(true);
    console.log(this.height, this.displayHeight);
    this.setScale(0.5);
    console.log(this.height, this.displayHeight);
  }

  public right():void {
    this.setVelocityX(SPEED);
  }

  public jump():void {
    const sign = this._side === side.RIGHT ? 1 : -1;
    this._scene.add.tween({
      targets: this,
      x: this.x + (JUMP_POINTS * sign),
      duration: 100,

      ease: ''
    });
  }

  public left():void {
    this.setVelocityX(-SPEED);
  }

  public down():void {
    this.setVelocityX(0);
  }
  
  protected preUpdate(time: number, delta: number): void {
    if (this._controls.left.isDown) {
      this._side = side.LEFT;
      this.left();
    } else if (this._controls.right.isDown) {
      this._side = side.RIGHT;
      this.right();
    } else {
      if (this.body.touching.down) {
        this.body.reset(this.x, this.y);
      }
    }
  }

  private static getSizes(scene: Phaser.Scene): Phaser.Geom.Rectangle {
    return scene.textures.list['player'].frames.__BASE;
  }
}

export default Player;