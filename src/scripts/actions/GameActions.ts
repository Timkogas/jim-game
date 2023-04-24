import EndTower from '../components/EndTower';
import Player from '../components/Player';
import Puppy from '../components/Puppy';
import StartTower from '../components/StartTower';
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
  private _score: Phaser.GameObjects.Text;

  public build(): void {
    const { width, height, centerX } = this._scene.cameras.main;

    this._scene.platform = this._scene.add.tileSprite(0, height - 32, width * 2, 32, 'platform');
    this._scene.platform.body = new Phaser.Physics.Arcade.StaticBody(this._scene.physics.world, this._scene.platform);

    const bg = this._scene.add.sprite(this._scene.platform.body.x, -100, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this._scene.platform.body.width + 200, height + 280)

    this._scene.startTower = StartTower.create(this._scene)
    this._scene.endTower = EndTower.create(this._scene)

    this._scene.physics.world.setBounds(this._scene.startTower.getBounds().x + 200, 0, this._scene.endTower.getBounds().x - 200 - this._scene.startTower.getBounds().x, bg.height)


    this._scene.player = new Player(this._scene);

    new Puppy(this._scene);
    // const sss = Puppy.create(this._scene);
    this._createScore();
    this._collisions();
    this._controls();
  }

  private _collisions(): void {
    this._scene.physics.add.collider(
      this._scene.platform,
      this._scene.puppies,
      this._platformPuppies.bind(this)
    );
    this._scene.physics.add.overlap(
      this._scene.player,
      this._scene.puppies,
      this._playerPuppies.bind(this)
    );
    this._scene.physics.add.overlap(
      this._scene.endTower,
      this._scene.puppies,
      this._puppiesEndTower.bind(this)
    );
    this._scene.physics.add.collider(
      this._scene.player,
      this._scene.platform
    );
  }

  private _platformPuppies(platform, puppy: Puppy): void {
    if (puppy.getMarkBound() === false && puppy?.scene) {
      console.log('Упал на платформу', puppy.getType());
      puppy.destroy()
    }
  }

  private _playerPuppies(player: Player, puppy: Puppy): void {
    if (puppy.getMarkBound() === false) {
      puppy.markBound();
      puppy.startStepAnimation();
    }
  }

  private _puppiesEndTower(tower: EndTower, puppy: Puppy): void {
    puppy.destroy()
    Session.plusScore(1);
    this._score.setText(Session.getScore().toString());
  }

  private _controls(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const cursors = this._scene.input.keyboard.createCursorKeys();
    // cursors.space.on('down', (): void => {
    //   this._scene.player.jump();
    // });
    cursors.down.on('down', (): void => {
      this._scene.player.down();
    });

  }

  private _createScore(): void {
    const { x, y } = this._scene.cameras.main;
    this._score = this._scene.add.text(this._scene.endTower.x - 50, this._scene.endTower.getBounds().top, Session.getScore().toString(), {
      fontSize: '70px',
      color: '#000000'
    }).setOrigin(1, 0);
  }

}

export default GameActions;