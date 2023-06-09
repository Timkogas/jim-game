import GameActionsUI from '../actions/GameActionsUI';
import Button from '../components/Button';
import PlayerHelath from '../components/PlayerHelath';
import PuppyLives from '../components/PuppyLives';
import Score from '../components/Score';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from './Game';

class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  public score: Score;
  public puppyLives: PuppyLives
  public playerHealth: PlayerHelath
  public actionsUI: GameActionsUI

  public create(): void {
    Session.clear()
    this.score = new Score(this);
    this.puppyLives = new PuppyLives(this)
    this.playerHealth = new PlayerHelath(this)
    const game = this.game.scene.getScene('Game') as Game;
    game.actions.controls()
    this.actionsUI = new GameActionsUI(this);
  }

  public setGradient(text: Phaser.GameObjects.Text): void {
    const gradient = text.context.createLinearGradient(0, 0, text.width, text.height);
    gradient.addColorStop(0, '#9A6AEA');
    gradient.addColorStop(.2, '#75EEFE');
    gradient.addColorStop(.5, '#F7BA80');
    gradient.addColorStop(1, '#AF1572');
    text.setFill(gradient);
  }

  public move(object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, target: Iposition = null): void {
    const { centerX, centerY } = this.cameras.main;
    const x = target ? target.x : centerX;
    const y = target ? target.y : centerY;
    const log = (object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      console.clear();
      console.log({
        x: x - object.x,
        y: y - object.y
      });
    }

    const cursors = this.input.keyboard.createCursorKeys();
    cursors.left.on('down', (): void => {
      object.x -= 1;
      log(object);
    });
    cursors.right.on('down', (): void => {
      object.x += 1;
      log(object);
    });
    cursors.up.on('down', (): void => {
      object.y -= 1;
      log(object);
    });
    cursors.down.on('down', (): void => {
      object.y += 1;
      log(object);
    });

    object.setInteractive();
    this.input.setDraggable(object);
    this.input.on('drag', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, dragX: number, dragY: number): void => {
      object.x = Math.round(dragX);
      object.y = Math.round(dragY);
    });
    this.input.on('dragend', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      log(object);
    });
  }
}

export default UI;