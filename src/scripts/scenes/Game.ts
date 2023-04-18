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

  public init(): void {
    // Session.clear();
  }

  public create(): void {
    this.actions.build();
  }
  
}

export default Game;