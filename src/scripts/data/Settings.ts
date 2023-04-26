import Interval from '../actions/Interval';
import { screen } from '../types/enums';

class Settings {

  public readonly PUPPY_STEP = 280; // следующий шаг анимации по Х для щенков
  public readonly PUPPY_UP_DURATION = 1300; // длительность анимации щенка в верхнюю точку
  public readonly PUPPY_DOWN_DURATION = 1000; // длительность анимации щенка в нижнюю точку
  public readonly PUPPY_UP_Y = 220; // верхняя позиция по Y для анимации щенка
  public readonly PUPPY_DOWN_Y = 910; // нижняя позиция по Y для анимации щенка
  public readonly PUPPY_INCREASE_ANIMATION_DURATION = 800; // шаг добавления времени если step больше 0
  public readonly PUPPY_BOMB_FLY_ANIMATION_DURATION = 2000; // длительность полета бомбы от EndTower до StartTower
  public readonly PUPPY_BOMB_FLY_ANIMATION_DELAY = 1000; // задержка перед полетом бомбы от EndTower до StartTower

  public readonly PLAYER_JUMP_POINTS = this.PUPPY_STEP * 2; // расстояние прыжка игрока
  public readonly PLAYER_SPEED = 500; // скорость игрока

  public readonly GAMEACTIONS_PUPPY_CREATE_DELAY = 880; // задержка между выпуском щенков в группе
  public readonly GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY = 2000; // задержка перед созданием новой группы щенков
  public readonly GAMEACTIONS_DAMAGE_ANIMATION_DURATION = 6000; // длительность анимации урона
  public readonly GAMEACTIONS_MIN_GROUP_LENGTH = 3; // минимальное количество щенков в группе запуска
  public readonly GAMEACTIONS_MAX_GROUP_LENGTH = 5; // максимальное количество щенков в группе запуска
  public readonly GAMEACTIONS_EXPLOSION_ANIMATION_DURATION = 1500; // длительность анимации взрыва
  public readonly GAMEACTIONS_EXPLOSION_DAMAGE = 30; // длительность анимации взрыва
  public readonly GAMEACTIONS_PUPPY_DAMAGE = 20; // длительность анимации взрыва


  public readonly TOWER_PADDING = 850; // Расстояние для башен от края карты
  public readonly ZONE_SWIPE_OFFSET = 100; // что-то с зоной

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