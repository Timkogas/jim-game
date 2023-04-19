import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';

const JUMP_POINTS = 200;


enum side {
  LEFT,
  RIGHT
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, 200, scene.platform.getBounds().top - 25, 'player');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;
  private _controls: Phaser.Types.Input.Keyboard.CursorKeys;
  private _side: side = side.RIGHT;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.body.setSize(50, 50)
    this.setGravityY(600);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this._controls = this._scene.input.keyboard.createCursorKeys();
    this._scene.cameras.main.startFollow(this, false, 1, 1, -1000, 500);
  }

  public right():void {
    this.setVelocityX(160);
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
    this.setVelocityX(-160);
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
}

export default Player;