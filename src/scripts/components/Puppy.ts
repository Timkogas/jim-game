import Game from "../scenes/Game";

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
    this._xStep = this._scene.startTower.x + 200 + 300
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.out'  },
      y: { value: 910, ease: 'Quad.in' },
      duration: 2000,
    });
  }

  private animationPuppyDownConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._xStep + 300
    return ({
      targets: this,
      x: { value: this._xStep, ease: 'Quad.out' },
      y: { value: 910, ease: 'Quad.in' },
      duration: 2000,
    });
  }

  private animationPuppyUpConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    this._xStep = this._xStep + 300
    return ({
      targets: this,
      x: { value:  this._xStep, ease: 'Quad.in' },
      y: { value: 220, ease: 'Quad.out' },
      duration: 2500,
      onComplete: () => {
        this._bound = false;
        this.startStepAnimation();
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
      this._tween = this._scene.tweens.add(this.animationPuppyUpConfig());
    } else if (this._step === 7) {
      this._tween = this._scene.tweens.add(this.animationPuppyDownConfig());
    } else if (this._step === 8) {
      this._tween = this._scene.tweens.add(this.animationPuppyUpConfig());
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