import axios from 'axios';
import Player from '../components/Player';
import Session from '../data/Session';
import User from '../data/User';
import GameActions from '../actions/GameActions';
import Puppy from '../components/Puppy';
import EndTower from '../components/EndTower';
import StartTower from '../components/StartTower';
import Loading from '../components/Loading';

class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public actions: GameActions = new GameActions(this);
  public player: Player;
  public endTower: EndTower;
  public startTower: StartTower;
  public platform: Phaser.GameObjects.TileSprite;
  public puppies: Phaser.Physics.Arcade.Group
  private _loading: boolean = false;

  public init(): void {
    console.log('init');
    // Session.clear();
  }

  public preload(): void {
    console.log('preload');
    if (this._loading === false) {
      this._loading = true;
      new Loading(this);
    }
  }

  public create(): void {
    console.log('create');
    this.puppies = this.physics.add.group();
    this.actions.build();
    this._spaceButton();
    this.scene.launch('UI');
  }
  
  private _spaceButton(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      new Puppy(this);
    });
  }
}

export default Game;