import Button from '../components/Button';
import PlayerHelath from '../components/PlayerHelath';
import PuppyLives from '../components/PuppyLives';
import Score from '../components/Score';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from './Game';

class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  public score: Score;
  public puppyLives: PuppyLives
  public playerHealth: PlayerHelath

  public create(): void {
    Session.clear()
    this.score = new Score(this);
    this.puppyLives = new PuppyLives(this)
    this.playerHealth = new PlayerHelath(this)
    const game = this.game.scene.getScene('Game') as Game;
    game.actions.controls()
    this._createMuteButtonsMusic()
    this._createMuteButtonsSounds()
  }

  private _createMuteButtonsMusic(): void {
    const muteBtn = new Button(this, this.playerHealth.getBounds().x + 30, this.playerHealth.y + 100, 'button').setDepth(10)
    muteBtn.setDisplaySize(70, 40)
    muteBtn.text = this.add.text(muteBtn.x, muteBtn.y, ('mute M').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    muteBtn.callback = (): void => {
      Settings.sounds.muteMusic()
    }
    const unmuteBtn = new Button(this, muteBtn.x + 90, this.playerHealth.y + 100, 'button').setDepth(10)
    unmuteBtn.setDisplaySize(70, 40)
    unmuteBtn.text = this.add.text(unmuteBtn.x, unmuteBtn.y, ('unmute M').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    unmuteBtn.callback = (): void => {
      Settings.sounds.unmuteMusic()
    }
  }

  private _createMuteButtonsSounds(): void {
    const muteBtn = new Button(this, this.playerHealth.getBounds().x + 30, this.playerHealth.y + 150, 'button').setDepth(10)
    muteBtn.setDisplaySize(70, 40)
    muteBtn.text = this.add.text(muteBtn.x, muteBtn.y, ('mute S').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    muteBtn.callback = (): void => {
      Settings.sounds.muteSounds()
    }
    const unmuteBtn = new Button(this, muteBtn.x + 90, this.playerHealth.y + 150, 'button').setDepth(10)
    unmuteBtn.setDisplaySize(70, 40)
    unmuteBtn.text = this.add.text(unmuteBtn.x, unmuteBtn.y, ('unmute S').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    unmuteBtn.callback = (): void => {
      Settings.sounds.unmuteSounds()
    }
  }

  public setGradient(text: Phaser.GameObjects.Text): void {
    const gradient = text.context.createLinearGradient(0, 0, text.width, text.height);
    gradient.addColorStop(0, '#9A6AEA');
    gradient.addColorStop(.2, '#75EEFE');
    gradient.addColorStop(.5, '#F7BA80');
    gradient.addColorStop(1, '#AF1572');
    text.setFill(gradient);
  }

  public move(object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, target: Iposition = null): void {
    const { centerX, centerY } = this.cameras.main;
    const x = target ? target.x : centerX;
    const y = target ? target.y : centerY;
    const log = (object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      console.clear();
      console.log({
        x: x - object.x,
        y: y - object.y
      });
    }

    const cursors = this.input.keyboard.createCursorKeys();
    cursors.left.on('down', (): void => {
      object.x -= 1;
      log(object);
    });
    cursors.right.on('down', (): void => {
      object.x += 1;
      log(object);
    });
    cursors.up.on('down', (): void => {
      object.y -= 1;
      log(object);
    });
    cursors.down.on('down', (): void => {
      object.y += 1;
      log(object);
    });

    object.setInteractive();
    this.input.setDraggable(object);
    this.input.on('drag', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, dragX: number, dragY: number): void => {
      object.x = Math.round(dragX);
      object.y = Math.round(dragY);
    });
    this.input.on('dragend', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      log(object);
    });
  }
}

export default UI;