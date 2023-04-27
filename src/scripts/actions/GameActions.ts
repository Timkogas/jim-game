import Button from '../components/Button';
import EndTower from '../components/EndTower';
import Player from '../components/Player';
import Puppy from '../components/Puppy';
import StartTower from '../components/StartTower';
import Text from '../components/Text';
import Zone from '../components/Zone';
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
    const sound = this._scene.sound.add('backgroundSound', { loop: true, volume: .2 })
    sound.play()
    this._anims();
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
    const btn = new Button(UI, centerX, centerY - 100, 'button').setDepth(10)
    btn.text = UI.add.text(btn.x, btn.y, ('restart').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5).setDepth(11);

    this._scene.scene.pause()

    btn.callback = (): void => {
      this._scene.sound.removeAll()
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
        const sound = this._scene.sound.add('puppySmashSound')
        sound.play()
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
    const sound = this._scene.sound.add('explosionSound')
    sound.play()
    this._scene.time.addEvent({
      delay: Settings.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION, callback: (): void => {
        explosion.destroy()
      }
    });
  }

  private _playerPuppies(player: Player, puppy: Puppy): void {
    if (puppy.getMarkBound() === false) {
      puppy.markBound();
      const sound = this._scene.sound.add('bounceSound')
      sound.play()
      puppy.startStepAnimation();
    }
  }

  private _createPuppyGroup(): void {
    if (this._scene.difficulty <= 20) {
      this._difficultyVeryEasy()
    } else if (this._scene.difficulty >= 21 && this._scene.difficulty <= 40) {
      this._difficultyEasy()
    } else if (this._scene.difficulty >= 41 && this._scene.difficulty <= 60) {
      this._difficultyMedium()
    } else if (this._scene.difficulty >= 61 && this._scene.difficulty <= 80) {
      this._difficultyHard()
    } else if (this._scene.difficulty >= 81) {
      this._difficultyVeryHard()
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
    let stepOtherPuppy
    let otherPuppyCheck: boolean = false
    for (let i = 1; i <= this._groupLength; i++) {
      let type: puppies = puppies.PUPPY
      if (i === this._groupLength) {
        type = puppies.BOMB
      }
      if (i === 3 && !otherPuppyCheck) {
        otherPuppyCheck = true
        stepOtherPuppy = step >= 2 ? step - 2 : step + 2
        this._createPuppy(i, stepOtherPuppy, type)
        continue;
      }
      this._createPuppy(i, step, type)
    }
  }

  private _difficultyMedium(): void {
    console.log('Medium')
    this._groupLength = 5
    const positions = [0, 2, 4];
    const random = Phaser.Math.Between(0, positions.length - 1);
    const randomBomb = Phaser.Math.Between(1, this._groupLength)
    let step = positions[random];
    let stepOtherPuppy
    for (let i = 1; i <= this._groupLength; i++) {
      let type: puppies = puppies.PUPPY
      if (i === randomBomb) {
        type = puppies.BOMB
      }
      if (i % 2 !== 0) {
        stepOtherPuppy = positions[Phaser.Math.Between(0, positions.length - 1)]
        this._createPuppy(i, stepOtherPuppy, type)
        continue;
      }
      this._createPuppy(i, step, type)
    }
  }

  private _difficultyHard(): void {
    console.log('Hard')
    this._groupLength = 5
    const positions = [0, 2, 4];
    const randomBomb = Phaser.Math.Between(1, this._groupLength)
    let stepPrevBomb
    let step
    for (let i = 1; i <= this._groupLength; i++) {
      const random = Phaser.Math.Between(0, positions.length - 1);
      if (stepPrevBomb === positions[random]) {
        i--
        continue;
      } else {
        step = positions[random]
        stepPrevBomb = step
      }
      let type: puppies = puppies.PUPPY
      if (i === randomBomb) {
        type = puppies.BOMB
      }
      this._createPuppy(i, step, type)
    }
  }

  private _difficultyVeryHard(): void {
    console.log('very hard')
    this._groupLength = 5
    const positions = [0, 2, 4];
    const randomBomb = Phaser.Math.Between(1, this._groupLength)
    for (let i = 1; i <= this._groupLength; i++) {
      const random = Phaser.Math.Between(0, positions.length - 1);
      const step = positions[random]
      let type: puppies = puppies.PUPPY
      if (i === randomBomb) {
        type = puppies.BOMB
      }
      this._createPuppy(i, step, type)
    }
  }

  private _anims(): void {
    this._scene.anims.create({
      key: 'fall',
      frames: this._scene.anims.generateFrameNumbers('puppy', { start: 3, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this._scene.anims.create({
      key: 'explosion',
      frames: this._scene.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
      frameRate: 8,
      repeat: 0,
      hideOnComplete: true
    });
  }

  private _controls(): void {
    if (Settings.isMobile()) {
      const UI = this._scene.game.scene.getScene('UI') as UI;
      console.log(UI)
      const { centerX, centerY, width, height } = UI.cameras.main;
      // const controls = this._scene.input.keyboard.createCursorKeys();
      console.log( centerX, centerY, width, height)
      const jumpBtn = new Button(UI, centerX / 3, height - 137, 'button')
      jumpBtn.text = UI.add.text(jumpBtn.x, jumpBtn.y, ('jump').toUpperCase(), {
        color: '#000000',
        fontSize: 32,
      }).setOrigin(.5, .5)

      const jumpZone = new Zone(UI, centerX / 2, centerY, width / 2, height);
      jumpZone.downClickCallback = (): void => {
        this._scene.player.jump()
      }

      const leftZoneMove = new Zone(UI, centerX + centerX / 4, centerY, width / 4, height).setDepth(5);
      const leftBtnMove = new Button(UI, leftZoneMove.x + 70, height - 137, 'button')
      leftBtnMove.text = UI.add.text(leftBtnMove.x, leftBtnMove.y, ('<-').toUpperCase(), {
        color: '#000000',
        fontSize: 32,
      }).setOrigin(.5, .5)

      leftZoneMove.downCallback = (): void => {
        this._scene.player.setLeft(true)
      }
      leftZoneMove.upCallback = (): void => {
        this._scene.player.setLeft(false)
      }

      const rightZoneMove = new Zone(UI, width - centerX / 4, centerY, width / 4, height).setDepth(5);;
      rightZoneMove.downCallback = (): void => {
        this._scene.player.setRight(true)
      }
      rightZoneMove.upCallback = (): void => {
        this._scene.player.setRight(false)
      }
      const rightBtnMove = new Button(UI, rightZoneMove.x - 70, height - 137, 'button')
      rightBtnMove.text = UI.add.text(rightBtnMove.x, rightBtnMove.y, ('->').toUpperCase(), {
        color: '#000000',
        fontSize: 32,
      }).setOrigin(.5, .5)
    } else {
      const cursors = this._scene.input.keyboard.createCursorKeys();
      cursors.space.on('down', (): void => {
        this._scene.player.jump();
      });
      cursors.left.on('down', (): void => {
        this._scene.player.setLeft(true)
      });
      cursors.right.on('down', (): void => {
        this._scene.player.setRight(true)
      });
      cursors.left.on('up', (): void => {
        this._scene.player.setLeft(false)
      });
      cursors.right.on('up', (): void => {
        this._scene.player.setRight(false)
      });

    }
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