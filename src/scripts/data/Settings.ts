import Interval from '../actions/Interval';
import { screen } from '../types/enums';

class Settings {

  public readonly PUPPY_STEP = 300; // dasd asd asd asd

  public readonly sizes = {
    minWidth: 1920,
    maxWidth: 2500,
    height: 1080,
  }
  private _screen: screen = screen.MAIN;
  private _mobile: boolean = false;
  public sounds: Isounds;
  public interval: Interval;

  public setScreen(screen: screen): screen {
    this._screen = screen;
    return this._screen;
  }

  public getScreen(): screen {
    return this._screen;
  }

  public isMobile(): boolean {
    return this._mobile;
  }

  public setMobile(mobile: boolean): void {
    this._mobile = mobile;
  }
}

export default new Settings();