import Button from "../components/Button";
import Text from "../components/Text";
import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { ESettings } from "../types/enums";

class GameActionsUI {
  constructor(scene: UI) {
    this._scene = scene;
    this.build()
  }

  private _scene: UI;
  private _sceneGame: Game
  private _testHelperTexts: (Phaser.GameObjects.Text | Button)[][] = []

  public build(): void {
    this._createMuteButtonsMusic()
    this._createMuteButtonsSounds()
    this._sceneGame = this._scene.game.scene.getScene('Game') as Game;
  }

  private _createMuteButtonsMusic(): void {
    const muteBtn = new Button(this._scene, this._scene.playerHealth.getBounds().x + 30, this._scene.playerHealth.y + 100, 'button').setDepth(10)
    muteBtn.setDisplaySize(70, 40)
    muteBtn.text = this._scene.add.text(muteBtn.x, muteBtn.y, ('mute M').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    muteBtn.callback = (): void => {
      Settings.sounds.muteMusic()
    }
    const unmuteBtn = new Button(this._scene, muteBtn.x + 90, this._scene.playerHealth.y + 100, 'button').setDepth(10)
    unmuteBtn.setDisplaySize(70, 40)
    unmuteBtn.text = this._scene.add.text(unmuteBtn.x, unmuteBtn.y, ('unmute M').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    unmuteBtn.callback = (): void => {
      Settings.sounds.unmuteMusic()
    }
  }

  private _createMuteButtonsSounds(): void {
    const muteBtn = new Button(this._scene, this._scene.playerHealth.getBounds().x + 30, this._scene.playerHealth.y + 150, 'button').setDepth(10)
    muteBtn.setDisplaySize(70, 40)
    muteBtn.text = this._scene.add.text(muteBtn.x, muteBtn.y, ('mute S').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    muteBtn.callback = (): void => {
      Settings.sounds.muteSounds()
    }
    const unmuteBtn = new Button(this._scene, muteBtn.x + 90, this._scene.playerHealth.y + 150, 'button').setDepth(10)
    unmuteBtn.setDisplaySize(70, 40)
    unmuteBtn.text = this._scene.add.text(unmuteBtn.x, unmuteBtn.y, ('unmute S').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11);
    unmuteBtn.callback = (): void => {
      Settings.sounds.unmuteSounds()
    }
  }

  public gameOver(): void {
    if (Session.getOver()) return;
    const { width, height, centerX, centerY } = this._scene.cameras.main;
    Session.setOver(true);
    this._scene.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0);
    new Text(this._scene, 'Game over', { x: centerX, y: centerY - 200, fontSize: 44 })
    const btn = new Button(this._scene, centerX, centerY - 100, 'button').setDepth(10)
    btn.text = this._scene.add.text(btn.x, btn.y, ('restart').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5).setDepth(11);
    this._sceneGame.scene.pause()
    this._createSoundSettings(btn)
    btn.callback = (): void => {
      this._sceneGame.sound.removeAll()
      this._sceneGame.scene.restart()
      this._scene.scene.restart()
    };
    
    this._sceneGame.player.destroy()
  }

  private _createSoundSettings(restartBtn: Phaser.GameObjects.Sprite):void {
    const { centerY } = this._scene.cameras.main;

    const name = this._scene.add.text(restartBtn.getBounds().left, centerY, 'music', { align: 'left', fontSize: 18 })
    const value = this._scene.add.text(name.getBounds().right + 30, centerY, Settings.sounds.getVolume().music.toString(), { align: 'left', fontSize: 18 })
    const plusValueBtn = new Button(this._scene, value.getBounds().right + 45, centerY + 10, 'button').setDepth(10)
    plusValueBtn.setDisplaySize(20, 20)
    plusValueBtn.text = this._scene.add.text(plusValueBtn.x, plusValueBtn.y, ('+').toUpperCase(), {
      color: '#000000',
      fontSize: 18,
    }).setOrigin(.5, .5).setDepth(11);
    plusValueBtn.callback = (): void => {
      const newVolume = Number((Settings.sounds.getVolume().music + 0.1).toFixed(2))
      console.log(newVolume)
      Settings.sounds.setVolume(newVolume)
      const newValue = Settings.sounds.getVolume().music.toString()
      value.setText(newValue);
    }

    const minusValueBtn = new Button(this._scene, plusValueBtn.getBounds().right + 10, centerY + 10, 'button').setDepth(10)
    minusValueBtn.setDisplaySize(20, 20)
    minusValueBtn.text = this._scene.add.text(minusValueBtn.x, minusValueBtn.y, ('-').toUpperCase(), {
      color: '#000000',
      fontSize: 18,
    }).setOrigin(.5, .5).setDepth(11);
    minusValueBtn.callback = (): void => {
      const newVolume = Number((Settings.sounds.getVolume().music - 0.1).toFixed(2))
      Settings.sounds.setVolume(newVolume)
      const newValue = Settings.sounds.getVolume().music.toString()
      value.setText(newValue);
    }
  }

  public gamePause(): void {
    const { width, height, centerX, centerY, x } = this._scene.cameras.main;
    if (!this._sceneGame.getIsPaused()) {
      this._sceneGame.setIsPaused(true)
    }

    const bg = this._scene.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0);
    const text = new Text(this._scene, 'PAUSE', { x: centerX, y: centerY - 200, fontSize: 44 })
    const btn = new Button(this._scene, centerX, centerY - 100, 'button').setDepth(10)
    btn.text = this._scene.add.text(btn.x, btn.y, ('resume').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5).setDepth(11);

    const timer = new Text(this._scene, Session.getTimerSeconds().toString(), { x: centerX, y: centerY - 30, fontSize: 24 })

    this._sceneGame.scene.pause()
    if (this._scene.game.config.physics.arcade.debug) {
      this._createTestHelperMenu()
    }
    btn.callback = (): void => {
      this._sceneGame.setIsPaused(false)
      this._sceneGame.scene.resume()
      bg.destroy()
      btn.destroy()
      text.destroy()
      timer.destroy()
      if (this._scene.game.config.physics.arcade.debug) {
        this._testHelperTexts?.forEach((text) => {
          text[0].destroy()
          text[1].destroy()
          text[2].destroy()
          text[3].destroy()
        })
      }
    };
  }

  private _createTestHelperMenu(): void {
    const { centerY, x } = this._scene.cameras.main;
    const allProperties = Object.entries(Settings.getSettingAllProperties())
    let column = 0
    this._testHelperTexts = allProperties.map((property, i) => {
      if (i % 9 === 0 && i !== 0) column++
      const xName = x + 150 + (650 * column)
      const yText = centerY + (50 * (i % 9))
      const name = this._scene.add.text(xName, yText, property[0], { align: 'left', fontSize: 18 })
      const value = this._scene.add.text(name.getBounds().right + 30, yText, property[1].toString(), { align: 'left', fontSize: 18 })

      const plusValueBtn = new Button(this._scene, value.getBounds().right + 15, yText + 10, 'button').setDepth(10)
      plusValueBtn.setDisplaySize(20, 20)
      plusValueBtn.text = this._scene.add.text(plusValueBtn.x, plusValueBtn.y, ('+').toUpperCase(), {
        color: '#000000',
        fontSize: 18,
      }).setOrigin(.5, .5).setDepth(11);
      plusValueBtn.callback = (): void => {
        Settings.setSettingProperty(i, 'plus')
        const newValue = Settings.getSettingProperty(ESettings[`${property[0]}`]).toString()
        value.setText(newValue);
      }

      const minusValueBtn = new Button(this._scene, plusValueBtn.getBounds().right + 10, yText + 10, 'button').setDepth(10)
      minusValueBtn.setDisplaySize(20, 20)
      minusValueBtn.text = this._scene.add.text(minusValueBtn.x, minusValueBtn.y, ('-').toUpperCase(), {
        color: '#000000',
        fontSize: 18,
      }).setOrigin(.5, .5).setDepth(11);
      minusValueBtn.callback = (): void => {
        Settings.setSettingProperty(i, 'minus')
        const newValue = Settings.getSettingProperty(ESettings[`${property[0]}`]).toString()
        value.setText(newValue);
      }

      return [name, value, plusValueBtn, minusValueBtn]
    })
  }


}

export default GameActionsUI;