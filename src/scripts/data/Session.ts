class Session {
  private _score: number = 0;
  private _puppyLives: number = 4;

  public clear(): void {
    this._score = 0;
    this._puppyLives = 4
  }

  public plusScore(score: number): void {
    this._score += score;
  }

  public getScore(): number {
    return this._score;
  }

  public minusPuppyLives(): void {
    this._puppyLives--;
  }

  public getPuppyLives(): number {
    return this._puppyLives
  }

  public resetPuppyLives(): number {
    return this._puppyLives = 4
  }
}

export default new Session();