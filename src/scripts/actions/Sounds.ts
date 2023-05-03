class Sounds implements Isounds {
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  private _scene: Phaser.Scene;
  private _track: string;
  private _music: Phaser.Sound.BaseSound;
  private _volumeMusic: number = 1;
  private _volumeSounds: number = 1;

  public resumeMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.resume();
    }
  }

  public playMusic(sound: string): void {
    if (this._scene.sound.get(this._track) && this._track === sound) {
      return;
    }
    
    if (this._track !== sound) {
      this._music?.destroy();
    }
    this._track = sound;
    this._music = this._scene.sound.add(this._track, {
      volume: this._volumeMusic,
      loop: true
    });
    this._music.play();
  }

  public pauseMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.pause();
    }
  }

  public stopMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.destroy();
    }
  }

  public play(sound: string): void {
    this._scene.sound.add(sound, {
      volume: this._volumeSounds,
      loop: false
    }).play();
  }

  public muteSounds(): void {
    this._volumeSounds = 0;
  }

  public muteMusic(): void {
    this._volumeMusic = 0;
    // @ts-ignore
    this._music.setVolume(this._volumeMusic);
  }

  public unmuteSounds(): void {
    this._volumeSounds = 1;
  }

  public unmuteMusic(): void {
    this._volumeMusic = 1;
    // @ts-ignore
    this._music.setVolume(this._volumeMusic);
  }

  public getVolume(): {sounds: number, music: number} {
    return {sounds: this._volumeSounds, music: this._volumeMusic};
  }

  public setVolume(volume: number): void {
    this._volumeMusic = volume;
    this._volumeSounds = volume
    if (volume > 1) this._volumeMusic = 1; this._volumeSounds = 1
    if (volume < 0) this._volumeMusic = 0; this._volumeSounds = 0
    // @ts-ignore
    this._music.setVolume(this._volumeMusic);
  }
}

export default Sounds;