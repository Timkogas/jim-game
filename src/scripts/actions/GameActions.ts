import Button from '../components/Button';
import EndTower from '../components/EndTower';
import Player from '../components/Player';
import Puppy from '../components/Puppy';
import StartTower from '../components/StartTower';
import Text from '../components/Text';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';
import { puppies } from '../types/enums';

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

    this._scene.physics.world.setBounds(this._scene.startTower.getBounds().centerX, 0, this._scene.endTower.getBounds().centerX - this._scene.startTower.getBounds().centerX, bg.height)

    this._scene.player = new Player(this._scene);

    this._collisions();
    this._controls();
    this._createNewPuppyGroup()
    if (this._scene.game.config.physics.arcade.debug) {
      this._drawAnimationPoints()
    }
  }

  public checkPuppyLivesAndPlayerHealth(): void {
    if (Session.getOver()) return;
    const UI = this._scene.game.scene.getScene('UI') as UI;
    if (this._scene.puppies.getLength() === 0) {
      if (Session.getPuppyLives() > 0) this._createNewPuppyGroup()
      if (Session.getPuppyLives() === 0) {
        Session.minusPlayerHealth(Settings.GAMEACTIONS_PUPPY_DAMAGE)
        UI.playerHealth.setText(Session.getPlayerHealth().toString());
        Session.resetPuppyLives()
        UI.puppyLives.setText(Session.getPuppyLives().toString());
        if (Session.getPlayerHealth() === 0) {
          this.gameOver()
        }
        this._scene.time.addEvent({
          delay: Settings.GAMEACTIONS_DAMAGE_ANIMATION_DURATION, callback: (): void => {
            this._createNewPuppyGroup()
          }
        });
      }
    }
  }

  public gameOver(): void {
    if (Session.getOver()) return;
    const UI = this._scene.game.scene.getScene('UI') as UI;
    const { width, height, centerX, centerY } = UI.cameras.main;
    Session.setOver(true);
    UI.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0);
    new Text(UI, 'Game over', { x: centerX, y: centerY - 200, fontSize: 44 })
    const btn = new Button(UI, centerX, centerY - 100, 'button')
    btn.text = UI.add.text(btn.x, btn.y, ('restart').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5)

    this._scene.scene.pause()

    btn.callback = (): void => {
      UI.scene.restart()
      this._scene.scene.restart()
    };
    this._scene.player.destroy()
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
      const UI = this._scene.game.scene.getScene('UI') as UI;
      if (puppy.getType() === puppies.BOMB) {
        this.bombExplosion(puppy)
        Session.minusPlayerHealth(Settings.GAMEACTIONS_EXPLOSION_DAMAGE)
        UI.playerHealth.setText(Session.getPlayerHealth().toString());
        if (Session.getPlayerHealth() === 0) {
          this.gameOver()
        }
      } else {
        puppy.destroy()
        Session.minusPuppyLives()
        UI.puppyLives.setText(Session.getPuppyLives().toString());
      }
      this.checkPuppyLivesAndPlayerHealth()
    }
  }

  public bombExplosion(puppy: Puppy): void {
    const { centerX, centerY } = puppy.getBounds()
    const explosion = this._scene.add.sprite(centerX, centerY, 'bomb')
    puppy.destroy()
    explosion.anims.play('explosion', true)
    this._scene.time.addEvent({
      delay: Settings.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION, callback: (): void => {
        explosion.destroy()
      }
    });
  }

  private _playerPuppies(player: Player, puppy: Puppy): void {
    if (puppy.getMarkBound() === false) {
      puppy.markBound();
      puppy.startStepAnimation();
    }
  }

  private _createPuppyGroup(): void {
    if (this._scene.difficulty <= 20) {
      this._difficultyVeryEasy()
    } else if (this._scene.difficulty >= 21 && this._scene.difficulty <= 40) {
      this._difficultyEasy()
    } else if (this._scene.difficulty >= 41 && this._scene.difficulty <= 60) {

    } else if (this._scene.difficulty >= 61 && this._scene.difficulty <= 80) {

    } else if (this._scene.difficulty >= 81) {

    }
  }

  private _createPuppy(i: number, step: number, type: puppies): void {
    this._scene.time.addEvent({
      delay: Settings.GAMEACTIONS_PUPPY_CREATE_DELAY * i, callback: (): void => {
        new Puppy(this._scene, type, step)
      }
    });
  }

  private _randomizeLengthGroup(): void {
    this._groupLength = Phaser.Math.Between(Settings.GAMEACTIONS_MIN_GROUP_LENGTH, Settings.GAMEACTIONS_MAX_GROUP_LENGTH);
  }

  private _createNewPuppyGroup(): void {
    this._scene.time.addEvent({
      delay: Settings.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY, callback: (): void => {
        this._randomizeLengthGroup()
        this._createPuppyGroup()
      }
    });
  }

  private _difficultyVeryEasy(): void {
    console.log('very easy')
    const positions = [0, 2, 4];
    const random = Phaser.Math.Between(0, positions.length - 1);
    const step = positions[random];
    for (let i = 1; i <= this._groupLength; i++) {
      let type: puppies = puppies.PUPPY
      if (i === this._groupLength) {
        type = puppies.BOMB
      }
      this._createPuppy(i, step, type)
    }
  }

  private _difficultyEasy(): void {
    console.log('easy')
    const positions = [0, 2, 4];
    const random = Phaser.Math.Between(0, positions.length - 1);
    let step = positions[random];
    let newStep: boolean = false
    for (let i = 1; i <= this._groupLength; i++) {
      if (i === this._groupLength - 1 && !newStep) {
        newStep = true
        step = step >= 2 ? step - 2 : step + 2
        console.log(step)
      }
      let type: puppies = puppies.PUPPY
      if (i === this._groupLength) {
        type = puppies.BOMB
      }
      this._createPuppy(i, step, type)
    }
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

  private _drawAnimationPoints(): void {
    for (let i = 1; i < 7; i++) {
      const graphics = this._scene.add.graphics();
      graphics.lineStyle(50, 0xffffff);
      graphics.beginPath();
      const x = this._scene.startTower.getBounds().right + Settings.PUPPY_STEP * i
      const y = i % 2 !== 0 ? Settings.PUPPY_DOWN_Y : Settings.PUPPY_UP_Y
      graphics.arc(x, y, 20, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false, 0.02);
      graphics.strokePath();
      graphics.closePath();
    }
  }
}

export default GameActions;