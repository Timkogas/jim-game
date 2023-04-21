import axios from 'axios';
import Player from '../components/Player';
import Session from '../data/Session';
import User from '../data/User';
import GameActions from '../actions/GameActions';
import Puppy from '../components/Puppy';

class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public actions: GameActions = new GameActions(this);
  public player: Player;
  public platform: Phaser.GameObjects.TileSprite;
  public puppies: Phaser.Physics.Arcade.Group

  public init(): void {
    // Session.clear();
  }

  public create(): void {
    this.puppies = this.physics.add.group();
    this.actions.build();
    this._spaceButton();
  }
  
  private _spaceButton(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      new Puppy(this);
    });
  }
}

export default Game;