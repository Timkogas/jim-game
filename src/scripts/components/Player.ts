import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';


class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, 200, 500, 'player');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.body.setSize(50, 50)
    this.setGravityY(600);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }

  public right():void {
    this.setVelocityX(160);
  }

  public up():void {
    this.setVelocityY(-330);
  }

  public left():void {
    this.setVelocityX(-160);
  }

  public down():void {
    this.setVelocityX(0);
  }

  protected preUpdate(time: number, delta: number): void {

  }
}

export default Player;