interface Iposition {
  x: number;
  y: number;
}
interface Isounds {
  resumeMusic: () => void;
  pauseMusic: () => void;
  playMusic: (sound: string) => void;
  stopMusic: () => void;
  play: (sound: string) => void;
  muteSounds: () => void;
  unmuteSounds: () => void;
  muteMusic: () => void;
  unmuteMusic: () => void;
  getVolume: () =>  {sounds: number, music: number};
  setVolume: (volume: number) => void;
}

interface ISpineContainer extends Phaser.GameObjects.Container {
  spine: SpineGameObject
  body: Phaser.Physics.Arcade.Body
  faceDirection(dir: 1 | -1): number
  setPhysicsSize(width: number, height: number): void
}
