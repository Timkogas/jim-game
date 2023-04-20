import Player from '../components/Player';
import Zone from '../components/Zone';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import { screen } from '../types/enums';

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  private _scene: Game;

  public build(): void {
    const { width, height } = this._scene.cameras.main;
    this._scene.platform = this._scene.add.tileSprite(0, height - 32, width * 2, 32, 'platform');
    this._scene.platform.body = new Phaser.Physics.Arcade.StaticBody(this._scene.physics.world, this._scene.platform);
    const puppy = this._scene.add.sprite(0, 0, 'puppy')
    this._scene.physics.add.existing(puppy)

    this._scene.player = new Player(this._scene);

    let repeat = 1
    // const animationPuppyFirst = this._scene.tweens.add({
    //   targets: puppy,
    //   x: { from: 0, to: 400, },
    //   y: { from: 0, to: 900, ease: 'Circ.in' },
    //   duration: 1700,
      // onComplete: () => {
      //   this._scene.tweens.add({
      //     targets: puppy,
      //     x: { value: 800, ease: 'Quad.in' },
      //     y: { value: 200, ease: 'Quad.out' },
      //     duration: 1800,
      //     onComplete: () => {
      //       this._scene.tweens.add({
      //         targets: puppy,
      //         x: { value: 1200 },
      //         y: { value: 900, ease: 'Circ.in' },
      //         duration: 1500,
      //         onComplete: () => {
      //           this._scene.tweens.add({
      //             targets: puppy,
      //             x: { value: 1600, ease: 'Quad.in' },
      //             y: { value: 200, ease: 'Quad.out' },
      //             duration: 1800,
      //             onComplete: () => {
      //             }
      //           });
      //         }
      //       });
      //     }
      //   });
      // }
    // });

    let animationPuppyFirstConfig = (x: number): Phaser.Types.Tweens.TweenBuilderConfig => {
      return ({
        targets: puppy,
          x: { value: x + 400, },
          y: { value: 890, ease: 'Circ.in' },
          duration: 2000,
      })
    }

    let animationPuppyContinueConfig = (x: number): Phaser.Types.Tweens.TweenBuilderConfig => {
      return ({
        targets: puppy,
        x: { value: x + 400, ease: 'Quad.in' },
        y: { value: 200, ease: 'Quad.out' },
        duration: 2500,
        onComplete: () => {
          animationPuppyFirst = this._scene.tweens.add(animationPuppyFirstConfig(x + 400))
        }
      })
    }

    let animationPuppyFirst: Phaser.Tweens.Tween = this._scene.tweens.add(animationPuppyFirstConfig(0))
    
    this._scene.physics.add.overlap(this._scene.player, puppy, () => {
      animationPuppyFirst.stop()
      console.log('overlap')
      const { x } = this._scene.player.getBounds()
      this._scene.tweens.add(animationPuppyContinueConfig(x))
    });

    this._scene.physics.add.collider(this._scene.platform, puppy, () => {
      puppy.destroy()
    });


    this._scene.physics.add.collider(this._scene.player, this._scene.platform);
    this._collisions();
    this._controls();
  }

  private _collisions(): void {

  }

  private _controls(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const cursors = this._scene.input.keyboard.createCursorKeys();
    cursors.space.on('down', (): void => {
      this._scene.player.jump();
    });
    cursors.down.on('down', (): void => {
      this._scene.player.down();
    });

  }

}

export default GameActions;