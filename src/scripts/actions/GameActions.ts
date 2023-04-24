import EndTower from '../components/EndTower';
import Player from '../components/Player';
import Puppy from '../components/Puppy';
import StartTower from '../components/StartTower';
import Session from '../data/Session';
import Game from '../scenes/Game';
import UI from '../scenes/UI';


const PUPPY_CREATE_DELAY = 180
const PUPPY_NEW_GROUP_CREATE_DELAY = 1000
const MIN_GROUP_LENGTH = 3
const MAX_GROUP_LENGTH = 5

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  private _scene: Game;
  private _groupLength: number = 0

  public build(): void {
    const { width, height, centerX } = this._scene.cameras.main;

    this._scene.platform = this._scene.add.tileSprite(0, height - 32, width * 2, 32, 'platform');
    this._scene.platform.body = new Phaser.Physics.Arcade.StaticBody(this._scene.physics.world, this._scene.platform);

    const bg = this._scene.add.sprite(this._scene.platform.body.x, -100, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this._scene.platform.body.width + 200, height + 280)

    this._scene.startTower = StartTower.create(this._scene);
    this._scene.endTower = EndTower.create(this._scene);

    this._scene.physics.world.setBounds(this._scene.startTower.getBounds().x + 200, 0, this._scene.endTower.getBounds().x - 200 - this._scene.startTower.getBounds().x, bg.height)

    this._scene.player = new Player(this._scene);

    this._collisions();
    this._controls();

    this.createNewPuppyGroup()
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
    this._scene.physics.add.collider(
      this._scene.player,
      this._scene.platform
    );
  }

  private _platformPuppies(platform, puppy: Puppy): void {
    if (puppy.getMarkBound() === false && puppy?.scene) {
      console.log('Упал на платформу', puppy.getType());
      puppy.destroy()
      Session.minusPuppyLives()
      const UI = this._scene.game.scene.getScene('UI') as UI;
      UI.puppyLives.setText(Session.getPuppyLives().toString());
      if (this._scene.puppies.getLength() === 0) {
        this.createNewPuppyGroup()
        // if (Session.getPuppyLives() === 0) {
        //   this._scene.isDamageAnimation = true
        //   Session.minusPlayerHealth(20)
        //   UI.playerHealth.setText(Session.getPlayerHealth().toString());
        //   setTimeout(()=>{
        //     this._scene.isDamageAnimation = false
        //     this.createNewPuppyGroup()
        //   },3000)
        // }
      }
    }
  }

  private _playerPuppies(player: Player, puppy: Puppy): void {
    if (puppy.getMarkBound() === false) {
      puppy.markBound();
      puppy.startStepAnimation();
    }
  }

  private _createPuppy(i: number): void {
    setTimeout(() => {
      Puppy.create(this._scene)
    }, PUPPY_CREATE_DELAY * i)
  }

  private _createPuppyGroup(): void {
    for (let i = 1; i <= this._groupLength; i++) {
      this._createPuppy(i)
    }
  }

  private _randomizeLengthGroup(): void {
    this._groupLength = Phaser.Math.Between(MIN_GROUP_LENGTH, MAX_GROUP_LENGTH);
  }

  public createNewPuppyGroup(): void {
    setTimeout(() => {
      this._randomizeLengthGroup()
      this._createPuppyGroup()
    }, PUPPY_NEW_GROUP_CREATE_DELAY)
  }


  private _controls(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const cursors = this._scene.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      this._scene.player.jump();
    });
    // cursors.down.on('down', (): void => {
    //   this._scene.player.down();
    // });
  }
}

export default GameActions;