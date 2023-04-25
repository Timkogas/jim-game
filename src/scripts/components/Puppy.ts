import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";

class Puppy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, type: number = 1) {
    super(scene, scene.startTower.getBounds().x + 250, scene.startTower.getBounds().top, 'puppy');
    this._scene = scene;
    this._type = type;
    this._build();
  }

  private _scene: Game;
  private _type: number;
  private _bound: boolean = false;
  private _tween: Phaser.Tweens.Tween;
  private _step: number = 0;
  private _xStep: number = 0;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this._scene.puppies.add(this);
    this.startStepAnimation();
  }

  private animationPuppyDownStartConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._scene.startTower.x + 320 + Settings.PUPPY_STEP // ТУТА ТУТА ТУТА
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.out' },
      y: { value: Settings.PUPPY_DOWN_Y, ease: 'Quad.in' },
      duration: Settings.PUPPY_DOWN_DURATION,
    });
  }

  private animationPuppyDownConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._xStep + Settings.PUPPY_STEP
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.out' },
      y: { value: Settings.PUPPY_DOWN_Y, ease: 'Quad.in' },
      duration: Settings.PUPPY_DOWN_DURATION,
    });
  }

  private animationPuppyUpConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._xStep + Settings.PUPPY_STEP
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.in' },
      y: { value: Settings.PUPPY_UP_Y, ease: 'Quad.out' },
      duration: Settings.PUPPY_DOWN_DURATION,
      onComplete: () => {
        this._bound = false;
        this.startStepAnimation();
      }
    })
  }

  private animationPuppyUpEndConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._xStep + Settings.PUPPY_STEP
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.in' },
      y: { value: Settings.PUPPY_UP_Y, ease: 'Quad.out' },
      duration: Settings.PUPPY_UP_DURATION,
      onComplete: () => {
        this.destroy()
        Session.plusScore(1);
        const UI = this._scene.game.scene.getScene('UI') as UI;
        UI.score.setText(Session.getScore().toString());
        this._scene.actions.checkPuppyLivesAndPlayerHealth()
      }
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

  public getType(): number {
    return this._type;
  }

  public markBound(): void {
    this._bound = true;
  }

  public getMarkBound(): boolean {
    return this._bound;
  }

  public static create(scene: Game): Puppy {
    return new Puppy(scene);
  }
}

export default Puppy;