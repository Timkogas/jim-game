import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { ESettings, puppies } from "../types/enums";

class Puppy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, type: puppies = puppies.PUPPY, step: number = 0,) {
    super(scene, scene.startTower.getBounds().x + 320, scene.startTower.getBounds().top, type === puppies.PUPPY ? 'puppy' : 'bomb');
    this._step = step
    this._calculateIncreaseDuration()
    this._scene = scene;
    this._type = type;
    this._build();
  }

  private _scene: Game;
  private _type: puppies;
  private _bound: boolean = false;
  private _tween: Phaser.Tweens.Tween;
  private _step: number = 0;
  private _firstStepX: number = 0;
  private _increaseDuration: number = 0

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this._scene.puppies.add(this);
    this._firstStepX = this._scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP)
    if (this._type === puppies.PUPPY) this.anims.play('fall', true)
    if (this._type === puppies.HEAL) this.anims.play('heal', true)
    this.startStepAnimation();
  }

  private animationPuppyDownStartConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    return ({
      targets: this,
      x: { value: this._firstStepX, ease: 'Quad.out' },
      y: { value: Settings.getSettingProperty(ESettings.PUPPY_DOWN_Y), ease: 'Quad.in' },
      duration: Settings.getSettingProperty(ESettings.PUPPY_DOWN_DURATION),
    });
  }

  private animationPuppyDownConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    const x = (this._step - 1) * Settings.getSettingProperty(ESettings.PUPPY_STEP) + this._firstStepX
    return ({
      targets: this,
      x: { value: x, ease: 'Quad.out' },
      y: { value: Settings.getSettingProperty(ESettings.PUPPY_DOWN_Y), ease: 'Quad.in' },
      duration: Settings.getSettingProperty(ESettings.PUPPY_DOWN_DURATION) + this._increaseDuration,
      onComplete: () => {
        this._increaseDuration = 0;
      }
    });
  }

  private animationPuppyUpConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    const x = (this._step - 1) * Settings.getSettingProperty(ESettings.PUPPY_STEP) + this._firstStepX
    return ({
      targets: this,
      x: { value: x, ease: 'Quad.in' },
      y: { value: Settings.getSettingProperty(ESettings.PUPPY_UP_Y), ease: 'Quad.out' },
      duration: Settings.getSettingProperty(ESettings.PUPPY_UP_DURATION),
      onComplete: () => {
        this._bound = false;
        this._increaseDuration = 0;
        this.startStepAnimation();
      }
    })
  }

  private animationPuppyUpEndConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    const x = (this._step - 1) * Settings.getSettingProperty(ESettings.PUPPY_STEP) + this._firstStepX
    return ({
      targets: this,
      x: { value: x, ease: 'Quad.in' },
      y: { value: Settings.getSettingProperty(ESettings.PUPPY_UP_Y), ease: 'Quad.out' },
      duration: Settings.getSettingProperty(ESettings.PUPPY_UP_DURATION),
      onComplete: this._onCompleteFinalAnimation.bind(this)
    })
  }

  public startStepAnimation(): void {
    this._step++
    this._tween?.stop();
    this._tween?.destroy();

    if (this._step === 1) {
      this._tween = this._scene.tweens.add(this.animationPuppyDownStartConfig());
    } else if (this._step === 2) {
      this._tween = this._scene.tweens.add(this.animationPuppyUpConfig());
    } else if (this._step === 3) {
      this._tween = this._scene.tweens.add(this.animationPuppyDownConfig());
    } else if (this._step === 4) {
      this._tween = this._scene.tweens.add(this.animationPuppyUpConfig());
    } else if (this._step === 5) {
      this._tween = this._scene.tweens.add(this.animationPuppyDownConfig());
    } else if (this._step === 6) {
      this._tween = this._scene.tweens.add(this.animationPuppyUpEndConfig());
    }
  }

  private _calculateIncreaseDuration(): void {
    switch (this._step) {
      case 0:
        this._increaseDuration = 0
        break;
      case 2:
        this._increaseDuration = Settings.getSettingProperty(ESettings.PUPPY_INCREASE_ANIMATION_DURATION) * 1
        break;
      case 4:
        this._increaseDuration = Settings.getSettingProperty(ESettings.PUPPY_INCREASE_ANIMATION_DURATION) * 1.5
        break;
    }
  }

  private _onCompleteFinalAnimation(): void {
    if (this._type === puppies.PUPPY) {
      this._onCompleteFinalAnimationPuppy()
    } else if (this._type === puppies.BOMB) {
      this._onCompleteFinalAnimationBomb()
    } else if (this._type === puppies.HEAL) {
      this._onCompleteFinalAnimationHeal()
    }
  }

  private _onCompleteFinalAnimationHeal(): void {
    Session.minusPlayerHealth(-20)
    this._scene.actions.sceneUI.playerHealth.setText(Session.getPlayerHealth().toString());
    Settings.sounds.play('healEndSound')
    this.destroy()
    this._scene.actions.checkPuppyLivesAndPlayerHealth()
  }

  private _onCompleteFinalAnimationPuppy(): void {
    this.destroy()
    Session.plusScore(Settings.getSettingProperty(ESettings.PUPPY_SCORE_END));
    Settings.sounds.play('puppyEndSound')
    this._scene.actions.sceneUI.score.setText(Session.getScore().toString());
    this._scene.actions.checkPuppyLivesAndPlayerHealth()
  }

  private _onCompleteFinalAnimationBomb(): void {
    this._scene.time.addEvent({
      delay: Settings.getSettingProperty(ESettings.PUPPY_BOMB_FLY_ANIMATION_DELAY), callback: (): void => {
        Settings.sounds.play('bombFlySound')
        this._tween = this._scene.tweens.add({
          targets: this,
          rotation: -10 * Math.PI,
          x: { value: this._scene.startTower.getBounds().centerX },
          y: { value: this.getBounds().y + 80 },
          duration: Settings.getSettingProperty(ESettings.PUPPY_BOMB_FLY_ANIMATION_DURATION),
          onComplete: () => {
            this.destroy()
            this._scene.cameras.main.shake(1100);
            this._scene.actions.bombExplosion(this)
            Session.plusScore(Settings.getSettingProperty(ESettings.PUPPY_SCORE_BOMB_TO_ENEMY));
            this._scene.actions.sceneUI.score.setText(Session.getScore().toString());
            this._scene.actions.checkPuppyLivesAndPlayerHealth()
          }
        });
      }
    });
  }

  public getType(): puppies {
    return this._type;
  }

  public markBound(): void {
    this._bound = true;
  }

  public getMarkBound(): boolean {
    return this._bound;
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
  }

  public static create(scene: Game): Puppy {
    return new Puppy(scene);
  }
}

export default Puppy;