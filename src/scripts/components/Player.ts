import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';

const JUMP_POINTS = 280;
const SPEED = 550;

enum side {
  LEFT,
  RIGHT
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.startTower.getBounds().x + 400, scene.platform.getBounds().top - Player.getSizes(scene).height / 2, 'capybara-stand');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;
  private _controls: Phaser.Types.Input.Keyboard.CursorKeys;
  private _side: side = side.RIGHT;

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
    this.body.setSize(this.width, this.height - 40);
    this.setGravityY(600);
    this.setBounce(0.2);
    // const y = this._scene.platform.getBounds().top - this.height / 2;
    // this.setPosition(200, y);
    this._controls = this._scene.input.keyboard.createCursorKeys();
    this._scene.cameras.main.startFollow(this, false, 1, 1, 0, 330);
    this.setCollideWorldBounds(true);
    this.setScale(2, 2)
  }

  public right():void {
    this.setVelocityX(SPEED);
  }

  public jump():void {
    const sign = this._side === side.RIGHT ? 1 : -1;
    this._scene.add.tween({
      targets: this,
      x: this.x + (JUMP_POINTS * sign),
      duration: 200,

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
    super.preUpdate(time, delta);
    this.flipX = false
    if (this._controls.left.isDown) {
      this._side = side.LEFT;
      this.flipX = true
      this.left();
      this.anims.play('walk', true)
    } else if (this._controls.right.isDown) {
      this._side = side.RIGHT;
      this.right();
      this.anims.play('walk', true)
    } else {
      if (this.body.touching.down) {
        this.body.reset(this.x, this.y);
        if (this._side === side.RIGHT) {
          this.flipX = false
        } else {
          this.flipX = true
        }
        this.anims.play('stand', true)
      }
    }
  }

  private static getSizes(scene: Phaser.Scene): Phaser.Geom.Rectangle {
    return scene.textures.list['player'].frames.__BASE;
  }
}

export default Player;