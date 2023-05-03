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