import Game from "../scenes/Game";

class Puppy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, type: number = 1) {
    super(scene, 0, 0, 'puppy');
    this._scene = scene;
    this._type = type;
    this._build();
  }

  private _scene: Game;
  private _type: number;
  private _bound: boolean = false;
  private _tween: Phaser.Tweens.Tween;
  private _step: number = 0;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this._scene.puppies.add(this);
    this.startStepAnimation();
  }

  private animationPuppyFirstConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    const { x } = this._scene.player;
    return ({
      targets: this,
        x: { value: x + 400, },
        y: { value: 890, ease: 'Circ.in' },
        duration: 2000,
    });
  }
  
  private animationPuppyContinueConfig(): Phaser.Types.Tweens.TweenBuilderConfig {
    const { x } = this._scene.player;
    return ({
      targets: this,
      x: { value: x + 400, ease: 'Quad.in' },
      y: { value: 200, ease: 'Quad.out' },
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
      this._tween = this._scene.tweens.add(this.animationPuppyFirstConfig());
    } else if (this._step === 2) {
      this._tween = this._scene.tweens.add(this.animationPuppyContinueConfig());
    } else if (this._step === 3) {
      this._tween = this._scene.tweens.add(this.animationPuppyFirstConfig());
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