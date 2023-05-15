import platform from '../../assets/images/platform.png';
import button from '../../assets/images/button.png';
import puppy from '../../assets/images/puppy.png';
import bg from '../../assets/images/bg.jpg';
import startTower from '../../assets/images/start-tower.png';
import endTower from '../../assets/images/end-tower.png';
import capybaraWalk from '../../assets/images/capybara-walk.png';
import capybaraStand from '../../assets/images/capybara-stand.png';
import redPixel from '../../assets/images/red-pixel.png';
import bomb from '../../assets/images/bomb.png';
import explosion from '../../assets/images/explosion.png';
import heal from '../../assets/images/heal.png';
import laser from '../../assets/images/laser.png';
import preloadSprite from '../../assets/images/preload-sprite.png'

import explosionSound from '../../assets/audio/explosion.mp3';
import puppyBounceSound from '../../assets/audio/puppy-bounce.mp3';
import backgroundSound from '../../assets/audio/background.mp3';
import jumpSound from '../../assets/audio/jump.mp3';
import puppySmashSound from '../../assets/audio/puppy-smash.mp3';
import bombFlySound from '../../assets/audio/bomb-fly.mp3';
import puppyEndSound from '../../assets/audio/puppy-end.mp3';
import healSmashSound from '../../assets/audio/heal-smash.mp3';
import healEndSound from '../../assets/audio/heal-end.mp3';
import healBounceSound from '../../assets/audio/heal-bounce.mp3';

import spineboyAtlas from '../../assets/spine/spineboy.atlas';
import spineboyJson from '../../assets/spine/spineboy.json'
import spineboyPng from '../../assets/spine/spineboy.png'


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
    this._scene.load.image('button', button);
    
    this._scene.load.spritesheet('capybara-walk', capybaraWalk, { frameWidth: 64, frameHeight: 64 });
    this._scene.load.spritesheet('capybara-stand', capybaraStand, { frameWidth: 64, frameHeight: 64 });
    this._scene.load.spritesheet('puppy', puppy, { frameWidth: 80, frameHeight: 80 });
    this._scene.load.spritesheet('explosion', explosion, { frameWidth: 128, frameHeight: 128 });
    this._scene.load.spritesheet('heal', heal, { frameWidth: 91, frameHeight: 80 });

    this._scene.load.image('bomb', bomb);
    this._scene.load.image('bg', bg);
    this._scene.load.image('start-tower', startTower);
    this._scene.load.image('end-tower', endTower);
    this._scene.load.image('laser', laser);
    this._scene.load.image('red-pixel', redPixel);

    this._scene.load.image('preload-sprite', preloadSprite);

    this._scene.load.image('spineboy', spineboyPng)
		this._scene.load.spine('spineboy', spineboyJson, spineboyAtlas)
  }

  private _loadSounds(): void {
    this._scene.load.audio('explosionSound', explosionSound);
    this._scene.load.audio('puppyBounceSound', puppyBounceSound);
    this._scene.load.audio('backgroundSound', backgroundSound);
    this._scene.load.audio('jumpSound', jumpSound);
    this._scene.load.audio('puppySmashSound', puppySmashSound);
    this._scene.load.audio('bombFlySound', bombFlySound);
    this._scene.load.audio('puppyEndSound', puppyEndSound);
    
    this._scene.load.audio('healSmashSound', healSmashSound);
    this._scene.load.audio('healEndSound', healEndSound);
    this._scene.load.audio('healBounceSound', healBounceSound);
  }
}

export default Loading;