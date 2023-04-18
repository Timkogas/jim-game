import './types/interfaces';
import '../assets/css/style.css';
import * as Phaser from 'phaser';
import Boot from './scenes/Boot';
import UI from './scenes/UI';
import Settings from './data/Settings';
import Utils from './data/Utils';
import Game from './scenes/Game';

window.onload = (): void => {
  setTimeout((): void => {
    const root: HTMLElement = document.querySelector('#root');
    const clientHeight = Math.round(document.body.clientHeight);
    const clientWidth = Math.round(document.body.clientWidth);
    const canvasWidth = Settings.sizes.width;
    let canvasHeight = Math.round((Settings.sizes.width * clientHeight) / clientWidth);
    let width = 0, height = 0;
    
    if (canvasHeight > Settings.sizes.maxHeight) canvasHeight = Settings.sizes.maxHeight;
    else if (canvasHeight < Settings.sizes.minHeight) canvasHeight = Settings.sizes.minHeight;
 
    const x = canvasWidth / Utils.gcd(canvasHeight, canvasWidth);
    const y = canvasHeight / Utils.gcd(canvasHeight, canvasWidth);
    canvasHeight >= 1920 && Settings.setMobile(true);
  
    if (clientHeight / y > clientWidth / x) {
      width = clientWidth;
      height = clientWidth / x * y;
    } else {
      width = clientHeight / y * x;
      height = clientHeight;
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
      scene: [ Boot, UI, Game ]
    }
    new Phaser.Game(config);
  }, 100);
}