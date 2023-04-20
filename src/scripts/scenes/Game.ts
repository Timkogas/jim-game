import axios from 'axios';
import Player from '../components/Player';
import Session from '../data/Session';
import User from '../data/User';
import GameActions from '../actions/GameActions';

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
    this.actions.build();
    this.puppies = this.physics.add.group()
  }
  
}

export default Game;