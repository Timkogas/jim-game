class Session {
  private _score: number = 0;

  public clear(): void {
    this._score = 0;
  }

  public plusScore(score: number): void {
    this._score += score;
  }

  public getScore(): number {
    return this._score;
  }
}

export default new Session();