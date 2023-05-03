import Settings from '../data/Settings';
import Game from '../scenes/Game';
import { ESettings } from '../types/enums';

class EndTower extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.startTower.getBounds().right + Settings.getSettingProperty(ESettings.PUPPY_STEP) * 6, scene.platform.getBounds().top - 350, 'end-tower');
    this._scene = scene;
    this._build();
  }
  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setBodySize(200, 700);
  }

  public shootLaser(): void {
    const laser = this._scene.add.sprite(this.getBounds().centerX, this.getBounds().top, 'laser')
    const {centerX, centerY} = this._scene.player.getBounds()
    const angle = Phaser.Math.Angle.Between(laser.getBounds().left, laser.getBounds().centerY, centerX, centerY)
    laser.setRotation(-1.57 - -angle)
    this._scene.tweens.add({
      targets: laser,
      x: { value: this._scene.player.getBounds().centerX },
      y: { value: this._scene.player.getBounds().centerY },
      duration:  250,
      onComplete: () => {
        laser.destroy()
        this._scene.time.addEvent({
          delay: Settings.getSettingProperty(ESettings.GAMEACTIONS_DAMAGE_ANIMATION_DURATION), callback: (): void => {
            this._scene.actions.createNewPuppyGroup()
          }
        });
      }
    })
  }

  public static create(scene: Game): EndTower {
    return new EndTower(scene);
  }

}

export default EndTower;