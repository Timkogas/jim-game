import './types/interfaces';
import '../assets/css/style.css';
import Boot from './scenes/Boot';
import UI from './scenes/UI';
import Settings from './data/Settings';
import Utils from './data/Utils';
import Game from './scenes/Game';
import * as platform from 'platform';
import 'phaser/plugins/spine/dist/SpinePlugin'
import 'phaser'

window.onload = (): void => {
  setTimeout((): void => {
    const root: HTMLElement = document.querySelector('#root');
    const clientHeight = Math.round(document.body.clientHeight);
    const clientWidth = Math.round(document.body.clientWidth);
    let width = 0;
    let height = 0;
    let canvasWidth = 0
    let canvasHeight = 0

    if (clientHeight > clientWidth) {
      Settings.setMobile(true);
      document.body.classList.add('mobile');
      canvasHeight = Math.round((Settings.sizes.minWidth * clientHeight) / clientWidth);
      canvasWidth = Math.round((Settings.sizes.minHeight * clientWidth) / clientHeight);

      if (canvasHeight > Settings.sizes.maxHeight) canvasHeight = Settings.sizes.maxHeight;
      else if (canvasHeight < Settings.sizes.minHeight) canvasHeight = Settings.sizes.minHeight;

      if (canvasWidth > Settings.sizes.maxWidth) canvasWidth = Settings.sizes.maxWidth;
      else if (canvasWidth < Settings.sizes.minWidth) canvasWidth = Settings.sizes.minWidth;

      const x = canvasWidth / Utils.gcd(canvasHeight, canvasWidth);
      const y = canvasHeight / Utils.gcd(canvasHeight, canvasWidth);

      if (clientHeight / y > clientWidth / x) {
        width = clientWidth;
        height = clientWidth / x * y;
      } else {
        width = clientHeight / y * x;
        height = clientHeight;
      }
    } else {
      document.body.classList.add('desktop');
      canvasHeight = Math.round((Settings.sizes.maxWidth * clientHeight) / clientWidth);
      canvasWidth = Settings.sizes.maxWidth;

      if (canvasHeight > Settings.sizes.maxHeight) canvasHeight = Settings.sizes.maxHeight;
      else if (canvasHeight < Settings.sizes.minHeight) canvasHeight = Settings.sizes.minHeight;

      const x = canvasWidth / Utils.gcd(canvasHeight, canvasWidth);
      const y = canvasHeight / Utils.gcd(canvasHeight, canvasWidth);

      if (clientHeight / y > clientWidth / x) {
        width = clientWidth;
        height = clientWidth / x * y;
      } else {
        width = clientHeight / y * x;
        height = clientHeight;
      }
    }

    if (platform.os.family === 'iOS' || platform.os.family === 'Android') {
      Settings.setMobile(true);
    }

    root.style.height = height + 'px';
    root.style.width = width + 'px';

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: canvasWidth,
      height: canvasHeight,
      parent: 'root',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      },
      render: { transparent: true },
      scene: [ Boot, Game, UI ],
      plugins: {
        scene: [
          { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
        ]
      }
    }

    const game = new Phaser.Game(config);

  }, 100);
}