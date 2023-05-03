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
import { ESettings, puppies } from '../types/enums';

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  public sceneUI: UI;
  private _scene: Game;
  private _groupLength: number = 0

  public build(): void {
    const { width, height, centerX } = this._scene.cameras.main;
    this.sceneUI = this._scene.game.scene.getScene('UI') as UI;
    this._scene.platform = this._scene.add.tileSprite(0, height - 32, width * 2, 32, 'platform');
    this._scene.platform.body = new Phaser.Physics.Arcade.StaticBody(this._scene.physics.world, this._scene.platform);

    const bg = this._scene.add.sprite(this._scene.platform.body.x, -100, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this._scene.platform.body.width + 200, height + 280)

    this._scene.startTower = StartTower.create(this._scene);
    this._scene.endTower = EndTower.create(this._scene);

    this._scene.physics.world.setBounds(this._scene.startTower.getBounds().centerX, 0, this._scene.endTower.getBounds().centerX - this._scene.startTower.getBounds().centerX, bg.height)

    this._scene.player = new Player(this._scene);
    Settings.sounds.playMusic('backgroundSound')
    this._anims();
    this._collisions();
    this.createNewPuppyGroup()
    if (this._scene.game.config.physics.arcade.debug) {
      this._drawAnimationPoints()
    }
  }

  public checkPuppyLivesAndPlayerHealth(): void {
    if (Session.getOver()) return;
    if (this._scene.puppies.getLength() === 0) {
      if (Session.getPuppyLives() > 0) this.createNewPuppyGroup()
      if (Session.getPuppyLives() === 0) {
        Session.minusPlayerHealth(Settings.getSettingProperty(ESettings.GAMEACTIONS_PUPPY_DAMAGE))
        this.sceneUI.playerHealth.setText(Session.getPlayerHealth().toString());
        Session.resetPuppyLives()
        this.sceneUI.puppyLives.setText(Session.getPuppyLives().toString());
        if (Session.getPlayerHealth() === 0) {
          this.sceneUI.actionsUI.gameOver()
        }
        this._scene.endTower.shootLaser()
      }
    }
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
      if (puppy.getType() === puppies.BOMB) {
        this._platformPuppiesBomb(puppy)
      } else if (puppy.getType() === puppies.PUPPY) {
        this._platformPuppiesPuppy(puppy)
      } else if (puppy.getType() === puppies.HEAL) {
        this._platformPuppiesHeal(puppy)
      }
      this.checkPuppyLivesAndPlayerHealth()
    }
  }

  private _platformPuppiesBomb(puppy: Puppy): void {
    this.bombExplosion(puppy)
    Session.minusPlayerHealth(Settings.getSettingProperty(ESettings.GAMEACTIONS_EXPLOSION_DAMAGE))
    this.sceneUI.playerHealth.setText(Session.getPlayerHealth().toString());
    if (Session.getPlayerHealth() === 0) {
      this.sceneUI.actionsUI.gameOver()
    }
  }

  private _platformPuppiesPuppy(puppy: Puppy): void {
    puppy.destroy()
    Settings.sounds.play('puppySmashSound')
    Session.minusPuppyLives()
    this.sceneUI.puppyLives.setText(Session.getPuppyLives().toString());
  }

  private _platformPuppiesHeal(puppy: Puppy): void {
    puppy.destroy()
    Settings.sounds.play('healSmashSound')
  }

  public bombExplosion(puppy: Puppy): void {
    const { centerX, centerY } = puppy.getBounds()
    const explosion = this._scene.add.sprite(centerX, centerY, 'bomb')
    puppy.destroy()
    explosion.anims.play('explosion', true)
    Settings.sounds.play('explosionSound')
    this._scene.time.addEvent({
      delay: Settings.getSettingProperty(ESettings.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION), callback: (): void => {
        explosion.destroy()
      }
    });
  }

  private _playerPuppies(player: Player, puppy: Puppy): void {
    if (puppy.getMarkBound() === false) {
      puppy.markBound();
      if (puppy.getType() === puppies.PUPPY) {
        Settings.sounds.play('puppyBounceSound')
      } else if (puppy.getType() === puppies.HEAL) {
        Settings.sounds.play('healBounceSound')
      } else if (puppy.getType() === puppies.BOMB) {
        Settings.sounds.play('puppyBounceSound')
      }
      puppy.startStepAnimation();
    }
  }

  private _createPuppyGroup(): void {
    const difficulty = Settings.getSettingProperty(ESettings.GAME_DIFFICULTY)
    if (difficulty <= 20) {
      this._difficultyVeryEasy()
    } else if (difficulty >= 21 && difficulty <= 40) {
      this._difficultyEasy()
    } else if (difficulty >= 41 && difficulty <= 60) {
      this._difficultyMedium()
    } else if (difficulty >= 61 && difficulty <= 80) {
      this._difficultyHard()
    } else if (difficulty >= 81) {
      this._difficultyVeryHard()
    }

    this._createHeal()
  }

  private _createHeal(): void {
    const positions = [0, 2, 4];
    const random = Phaser.Math.Between(0, positions.length - 1);
    const step = positions[random];

    if (Number(Phaser.Math.FloatBetween(0, 1).toFixed(2)) * 100 > Settings.getSettingProperty(ESettings.GAMEACTIONS_HEAL_CHANCE)) {
      this._createPuppy(this._groupLength + 1, step, puppies.HEAL)
    }
  }

  private _createPuppy(i: number, step: number, type: puppies): void {
    this._scene.time.addEvent({
      delay: Settings.getSettingProperty(ESettings.GAMEACTIONS_PUPPY_CREATE_DELAY) * i, callback: (): void => {
        new Puppy(this._scene, type, step)
      }
    });
  }

  private _randomizeLengthGroup(): void {
    this._groupLength = Phaser.Math.Between(Settings.getSettingProperty(ESettings.GAMEACTIONS_MIN_GROUP_LENGTH), Settings.getSettingProperty(ESettings.GAMEACTIONS_MAX_GROUP_LENGTH));
  }

  public createNewPuppyGroup(): void {
    this._scene.time.addEvent({
      delay: Settings.getSettingProperty(ESettings.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY), callback: (): void => {
        this._createPuppyGroup()
      }
    });
  }

  private _difficultyVeryEasy(): void {
    console.log('very easy')
    this._randomizeLengthGroup()
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
    this._randomizeLengthGroup()
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
    this._groupLength = Settings.getSettingProperty(ESettings.GAMEACTIONS_MAX_GROUP_LENGTH)
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
    this._groupLength = Settings.getSettingProperty(ESettings.GAMEACTIONS_MAX_GROUP_LENGTH)
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
    this._groupLength = Settings.getSettingProperty(ESettings.GAMEACTIONS_MAX_GROUP_LENGTH)
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
    });
    this._scene.anims.create({
      key: 'heal',
      frames: this._scene.anims.generateFrameNumbers('heal', { start: 3, end: 0 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  public controls(): void {
    this.sceneUI.input.keyboard.on('keydown-ESC', ()=>{this.sceneUI.actionsUI.gamePause(); console.log('sd')}, this.sceneUI)
    if (Settings.isMobile()) {
      this._controlsMobile()
    } else {
      this._controlsPC()
    }
  }

  private _controlsMobile(): void {
    const UI = this._scene.game.scene.getScene('UI') as UI;
    const { centerX, centerY, width, height } = UI.cameras.main;

    const jumpZone = new Zone(UI, centerX / 2, centerY, width / 2, height).setDepth(5);
    jumpZone.downClickCallback = (): void => {
      this._scene.player.jump()
    }

    const jumpBtn = new Button(UI, centerX / 3, height - 137, 'button')
    jumpBtn.text = UI.add.text(jumpBtn.x, jumpBtn.y, ('jump').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5)

    const leftZoneMove = new Zone(UI, centerX + centerX / 4, centerY, width / 4, height).setDepth(5);
    leftZoneMove.downCallback = (): void => {
      this._scene.player.setLeft(true)
    }
    leftZoneMove.upCallback = (): void => {
      this._scene.player.setLeft(false)
    }

    const leftBtnMove = new Button(UI, leftZoneMove.x + 70, height - 137, 'button')
    leftBtnMove.text = UI.add.text(leftBtnMove.x, leftBtnMove.y, ('<-').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5)

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
  }

  private _controlsPC(): void {
    const cursors = this._scene.input.keyboard.createCursorKeys();
    this._scene.input.keyboard.on('keydown-A', ()=>{
      this._scene.player.setLeft(true)
    }, this)
    this._scene.input.keyboard.on('keyup-A', ()=>{
      this._scene.player.setLeft(false)
    }, this)
    this._scene.input.keyboard.on('keydown-D', ()=>{
      this._scene.player.setRight(true)
    }, this)
    this._scene.input.keyboard.on('keyup-D', ()=>{
      this._scene.player.setRight(false)
    }, this)
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

  private _drawAnimationPoints(): void {
    for (let i = 1; i < 7; i++) {
      const graphics = this._scene.add.graphics();
      graphics.lineStyle(50, 0xffffff);
      graphics.beginPath();
      const x = this._scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP) * i
      const y = i % 2 !== 0 ? Settings.getSettingProperty(ESettings.PUPPY_DOWN_Y) : Settings.getSettingProperty(ESettings.PUPPY_UP_Y)
      graphics.arc(x, y, 20, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), false, 0.02);
      graphics.strokePath();
      graphics.closePath();
    }
  }
}

export default GameActions;