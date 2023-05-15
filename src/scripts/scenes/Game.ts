import axios from 'axios';
import Player from '../components/Player';
import Session from '../data/Session';
import User from '../data/User';
import GameActions from '../actions/GameActions';
import Puppy from '../components/Puppy';
import EndTower from '../components/EndTower';
import StartTower from '../components/StartTower';
import Loading from '../components/Loading';
import Settings from '../data/Settings';
import { ESettings } from '../types/enums';
import GameActionsUI from '../actions/GameActionsUI';
import PlayerSpine from '../components/PlayerSpine';
import PreloadSprite from '../components/PreloadSprite';

class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public actions: GameActions = new GameActions(this);
  public player: Player | PlayerSpine;
  public endTower: EndTower;
  public startTower: StartTower;
  public platform: Phaser.GameObjects.TileSprite;
  public puppies: Phaser.Physics.Arcade.Group
  public testSprite: PreloadSprite
  private _loading: boolean = false;
  private _isPaused: boolean = false

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
    this.scene.launch('UI');
    this._spaceButton();
  }

  private _spaceButton(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    cursors.up.on('down', (): void => {
      if (this.testSprite) return
      this.testSprite = new PreloadSprite(this, -600, 600, 'test', 'https://img2.akspic.ru/crops/5/3/0/1/7/171035/171035-derevo_dzhoshua_nacionalnyj_park-derevo_dzhoshua-peyzash-rastenie-oblako-7680x4320.jpg')
      this.testSprite .onCompleteCallback = () => { console.log('onCompleteCallback Sprite') }
    });
    cursors.down.on('down', (): void => {
      this.testSprite?.destroy()
      this.testSprite = null
    });
  }

  public getIsPaused(): boolean {
    return this._isPaused
  }

  public setIsPaused(pause: boolean) {
    this._isPaused = pause
  }
}

export default Game;