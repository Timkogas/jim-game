export default class PreloadSprite extends Phaser.GameObjects.Sprite {

  private _scene: Phaser.Scene
  private _texture: string
  private _url: string
  public onCompleteCallback: Function = (): void => { };

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, url: string) {
    super(scene, x, y, 'preload-sprite')

    this._scene = scene
    this._texture = texture
    this._url = url

    this._build()
  }

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);

    this.setDisplaySize(128, 128);

    this._scene.load.image(this._texture,  this._url);

    this._scene.load.once('complete', () => {
      this.setTexture(this._texture);
      this.onCompleteCallback()
    });
    this._scene.load.start();
  }

}