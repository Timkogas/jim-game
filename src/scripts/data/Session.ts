class Session {
  private _score: number = 0;
  private _puppyLives: number = 4;
  private _playerHealth: number = 100;
  private _over: boolean = false;

  public clear(): void {
    this._score = 0;
    this._puppyLives = 4
    this._playerHealth = 100
    this._over = false;
  }

  public plusScore(score: number): void {
    this._score += score;
  }

  public getScore(): number {
    return this._score;
  }

  public minusPlayerHealth(health: number): void {
    this._playerHealth -= health;
    if (this._playerHealth < 0) this._playerHealth = 0
  }

  public getPlayerHealth(): number {
    console.log(this._playerHealth)
    return this._playerHealth
  }

  public resetPlayerHealth(): void {
    this._playerHealth = 100
  }

  public minusPuppyLives(): void {
    if (this._puppyLives > 0) {
      this._puppyLives--;
    }
  }

  public getPuppyLives(): number {
    return this._puppyLives
  }

  public resetPuppyLives(): void {
     this._puppyLives = 4
  }

  public setOver(over: boolean): void {
    this._over = over;
  }

  public getOver(): boolean {
    return this._over;
  }
}

export default new Session();