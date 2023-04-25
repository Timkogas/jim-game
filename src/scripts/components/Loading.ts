import platform from '../../assets/images/platform.png';
import player from '../../assets/images/player.png';
import puppy from '../../assets/images/puppy.png';
import bg from '../../assets/images/bg.jpg';
import startTower from '../../assets/images/start-tower.png';
import endTower from '../../assets/images/end-tower.png';
import capybaraWalk from '../../assets/images/capybara-walk.png';
import capybaraStand from '../../assets/images/capybara-stand.png';
import redPixel from '../../assets/images/red-pixel.png';

class Loading {
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this._build();
  }

  private _scene: Phaser.Scene;

  private _build(): void {
    const { centerX, centerY } = this._scene.cameras.main;
    const sprite = this._scene.add.sprite(centerX, centerY, 'loading');
    this._scene.add.tween({
      targets: sprite,
      rotation: Math.PI * 2,
      repeat: -1
    });
    const bounds = sprite.getBounds();
    const text = this._scene.add.text(centerX, bounds.bottom + 50, 'Loading...0%', {
      font: '40px Triomphe',
      color: '00000'
    }).setOrigin(.5, .5);

    this._scene.load.on('progress', (value: number): void => {
      const percent = Math.round(value * 100);
      text.setText('Loading...' + percent + '%');
    }, this);
    this._scene.load.on('complete', (): void => {
      this._scene.load.removeAllListeners();
      sprite.destroy();
      text.destroy();
    }, this);

    this._loadImages();
    this._loadSounds();
  }

  private _loadImages(): void {
    this._scene.load.image('platform', platform);
    this._scene.load.image('player', player);
    this._scene.load.spritesheet('capybara-walk', capybaraWalk, { frameWidth: 64, frameHeight: 64 });
    this._scene.load.spritesheet('capybara-stand', capybaraStand, { frameWidth: 64, frameHeight: 64 });
    this._scene.load.image('puppy', puppy);
    this._scene.load.image('bg', bg);
    this._scene.load.image('start-tower', startTower);
    this._scene.load.image('end-tower', endTower);
    this._scene.load.image('red-pixel', redPixel);
  }

  private _loadSounds(): void {
    // this._scene.load.audio('sound', sound);
  }
}

export default Loading;