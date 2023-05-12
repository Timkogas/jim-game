export default class SpineContainer extends Phaser.GameObjects.Container implements ISpineContainer {

  public spine: SpineGameObject
  public body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number, key: string, anim: string, loop = false) {
    super(scene, x, y)

    this.spine = scene.add.spine(0, 0, key, anim, loop)
    const bounds = this.spine.getBounds()
    const width = bounds.size.x
    const height = bounds.size.y

    this.add(this.spine)
    scene.physics.add.existing(this)
    scene.add.existing(this)
    this.setPhysicsSize(width, height)

    this.body = this.body as Phaser.Physics.Arcade.Body
    this.body.setCollideWorldBounds(true)
  }

  faceDirection(dir: 1 | -1): number {
    if (this.spine.scaleX === dir) {
      return
    }

    this.spine.scaleX = dir
  }

  setPhysicsSize(width: number, height: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setOffset(width * -0.5, -height)
    body.setSize(width, height)
  }
}