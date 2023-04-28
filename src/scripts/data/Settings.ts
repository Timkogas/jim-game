import Interval from '../actions/Interval';
import { ESettings, screen } from '../types/enums';

class Settings {

  private PUPPY_STEP = 280; // следующий шаг анимации по Х для щенков
  private PUPPY_UP_DURATION = 1300; // длительность анимации щенка в верхнюю точку
  private PUPPY_DOWN_DURATION = 1000; // длительность анимации щенка в нижнюю точку
  private PUPPY_UP_Y = 220; // верхняя позиция по Y для анимации щенка
  private PUPPY_DOWN_Y = 910; // нижняя позиция по Y для анимации щенка
  private PUPPY_INCREASE_ANIMATION_DURATION = 1400; // шаг добавления времени если step больше 0
  private PUPPY_BOMB_FLY_ANIMATION_DURATION = 1800; // длительность полета бомбы от EndTower до StartTower
  private PUPPY_BOMB_FLY_ANIMATION_DELAY = 1000; // задержка перед полетом бомбы от EndTower до StartTower

  private PLAYER_JUMP_POINTS = this.PUPPY_STEP * 2; // расстояние прыжка игрока
  private PLAYER_SPEED = 1200; // скорость игрока

  private GAMEACTIONS_HEAL_CHANCE = 80 // проценты для сравнения 0-100 > healchance, чтобы запустить хилку
  private GAMEACTIONS_PUPPY_CREATE_DELAY = 280; // задержка между выпуском щенков в группе
  private GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY = 2000; // задержка перед созданием новой группы щенков
  private GAMEACTIONS_DAMAGE_ANIMATION_DURATION = 6000; // длительность анимации урона
  private GAMEACTIONS_MIN_GROUP_LENGTH = 3; // минимальное количество щенков в группе запуска
  private GAMEACTIONS_MAX_GROUP_LENGTH = 5; // максимальное количество щенков в группе запуска
  private GAMEACTIONS_EXPLOSION_ANIMATION_DURATION = 1500; // длительность анимации взрыва
  private GAMEACTIONS_EXPLOSION_DAMAGE = 30; // длительность анимации взрыва
  private GAMEACTIONS_PUPPY_DAMAGE = 20; // длительность анимации взрыва

  private TOWER_PADDING = 850; // Расстояние для башен от края карты
  private ZONE_SWIPE_OFFSET = 100; // что-то с зоной
  private GAME_DIFFICULTY = 80

  public readonly sizes = {
    minWidth: 1920,
    maxWidth: 2500,
    height: 960,
  }
  private _screen: screen = screen.MAIN;
  private _mobile: boolean = false;
  public sounds: Isounds;
  public interval: Interval;

  getSettingProperty(property: ESettings): ESettings {
    switch (property) {
      case ESettings.PUPPY_STEP:
        return this.PUPPY_STEP
      case ESettings.PUPPY_UP_DURATION:
        return this.PUPPY_UP_DURATION
      case ESettings.PUPPY_DOWN_DURATION:
        return this.PUPPY_DOWN_DURATION
      case ESettings.PUPPY_UP_Y:
        return this.PUPPY_UP_Y
      case ESettings.PUPPY_DOWN_Y:
        return this.PUPPY_DOWN_Y
      case ESettings.PUPPY_INCREASE_ANIMATION_DURATION:
        return this.PUPPY_INCREASE_ANIMATION_DURATION
      case ESettings.PUPPY_BOMB_FLY_ANIMATION_DURATION:
        return this.PUPPY_BOMB_FLY_ANIMATION_DURATION
      case ESettings.PUPPY_BOMB_FLY_ANIMATION_DELAY:
        return this.PUPPY_BOMB_FLY_ANIMATION_DELAY

      case ESettings.PLAYER_JUMP_POINTS:
        return this.PLAYER_JUMP_POINTS
      case ESettings.PLAYER_SPEED:
        return this.PLAYER_SPEED

      case ESettings.GAMEACTIONS_HEAL_CHANCE:
        return this.GAMEACTIONS_HEAL_CHANCE
      case ESettings.GAMEACTIONS_PUPPY_CREATE_DELAY:
        return this.GAMEACTIONS_PUPPY_CREATE_DELAY
      case ESettings.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY:
        return this.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY
      case ESettings.GAMEACTIONS_DAMAGE_ANIMATION_DURATION:
        return this.GAMEACTIONS_DAMAGE_ANIMATION_DURATION
      case ESettings.GAMEACTIONS_MIN_GROUP_LENGTH:
        return this.GAMEACTIONS_MIN_GROUP_LENGTH
      case ESettings.GAMEACTIONS_MAX_GROUP_LENGTH:
        return this.GAMEACTIONS_MAX_GROUP_LENGTH
      case ESettings.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION:
        return this.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION
      case ESettings.GAMEACTIONS_EXPLOSION_DAMAGE:
        return this.GAMEACTIONS_EXPLOSION_DAMAGE
      case ESettings.GAMEACTIONS_PUPPY_DAMAGE:
        return this.GAMEACTIONS_PUPPY_DAMAGE

      case ESettings.TOWER_PADDING:
        return this.TOWER_PADDING
      case ESettings.ZONE_SWIPE_OFFSET:
        return this.ZONE_SWIPE_OFFSET
      case ESettings.GAME_DIFFICULTY:
        return this.GAME_DIFFICULTY
    }
  }

  getSettingAllProperties(): { [key: string]: ESettings } {
    return {
      PUPPY_STEP: this.PUPPY_STEP,
      PUPPY_UP_DURATION: this.PUPPY_UP_DURATION,
      PUPPY_DOWN_DURATION: this.PUPPY_DOWN_DURATION,
      PUPPY_UP_Y: this.PUPPY_UP_Y,
      PUPPY_DOWN_Y: this.PUPPY_DOWN_Y,
      PUPPY_INCREASE_ANIMATION_DURATION: this.PUPPY_INCREASE_ANIMATION_DURATION,
      PUPPY_BOMB_FLY_ANIMATION_DURATION: this.PUPPY_BOMB_FLY_ANIMATION_DURATION,
      PUPPY_BOMB_FLY_ANIMATION_DELAY: this.PUPPY_BOMB_FLY_ANIMATION_DELAY,

      PLAYER_JUMP_POINTS: this.PLAYER_JUMP_POINTS,
      PLAYER_SPEED: this.PLAYER_SPEED,

      GAMEACTIONS_HEAL_CHANCE: this.GAMEACTIONS_HEAL_CHANCE,
      GAMEACTIONS_PUPPY_CREATE_DELAY: this.GAMEACTIONS_PUPPY_CREATE_DELAY,
      GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY: this.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY,
      GAMEACTIONS_DAMAGE_ANIMATION_DURATION: this.GAMEACTIONS_DAMAGE_ANIMATION_DURATION,
      GAMEACTIONS_MIN_GROUP_LENGTH: this.GAMEACTIONS_MIN_GROUP_LENGTH,
      GAMEACTIONS_MAX_GROUP_LENGTH: this.GAMEACTIONS_MAX_GROUP_LENGTH,
      GAMEACTIONS_EXPLOSION_ANIMATION_DURATION: this.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION,
      GAMEACTIONS_EXPLOSION_DAMAGE: this.GAMEACTIONS_EXPLOSION_DAMAGE,
      GAMEACTIONS_PUPPY_DAMAGE: this.GAMEACTIONS_PUPPY_DAMAGE,

      TOWER_PADDING: this.TOWER_PADDING,
      ZONE_SWIPE_OFFSET: this.ZONE_SWIPE_OFFSET,
      GAME_DIFFICULTY: this.GAME_DIFFICULTY,
    }
  }

  setSettingProperty(property: ESettings, variant: 'minus' | 'plus') {
    console.log(property)
    const valueOne = variant === 'minus' ? -1 : 1
    const valueTen = variant === 'minus' ? -10 : 10
    const valueHundred = variant === 'minus' ? -100 : 100
    switch (property) {
      case ESettings.PUPPY_STEP:
        this.PUPPY_STEP += valueOne
        break;
      case ESettings.PUPPY_UP_DURATION:
        this.PUPPY_UP_DURATION += valueHundred
        break;
      case ESettings.PUPPY_DOWN_DURATION:
        this.PUPPY_DOWN_DURATION += valueHundred
        break;
      case ESettings.PUPPY_UP_Y:
        this.PUPPY_UP_Y += valueOne
        break;
      case ESettings.PUPPY_DOWN_Y:
        this.PUPPY_DOWN_Y += valueOne
        break;
      case ESettings.PUPPY_INCREASE_ANIMATION_DURATION:
        this.PUPPY_INCREASE_ANIMATION_DURATION += valueHundred
        break;
      case ESettings.PUPPY_BOMB_FLY_ANIMATION_DURATION:
        this.PUPPY_BOMB_FLY_ANIMATION_DURATION += valueHundred
        break;
      case ESettings.PUPPY_BOMB_FLY_ANIMATION_DELAY:
        this.PUPPY_BOMB_FLY_ANIMATION_DELAY += valueHundred
        break;

      case ESettings.PLAYER_JUMP_POINTS:
        this.PLAYER_JUMP_POINTS += valueTen
        break;
      case ESettings.PLAYER_SPEED:
        this.PLAYER_SPEED += valueTen
        break;

      case ESettings.GAMEACTIONS_HEAL_CHANCE:
        this.GAMEACTIONS_HEAL_CHANCE += valueOne
        break;
      case ESettings.GAMEACTIONS_PUPPY_CREATE_DELAY:
        this.GAMEACTIONS_PUPPY_CREATE_DELAY += valueTen
        break;
      case ESettings.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY:
        this.GAMEACTIONS_PUPPY_NEW_GROUP_CREATE_DELAY += valueHundred
        break;
      case ESettings.GAMEACTIONS_DAMAGE_ANIMATION_DURATION:
        this.GAMEACTIONS_DAMAGE_ANIMATION_DURATION += valueHundred
        break;
      case ESettings.GAMEACTIONS_MIN_GROUP_LENGTH:
        this.GAMEACTIONS_MIN_GROUP_LENGTH += valueOne
        break;
      case ESettings.GAMEACTIONS_MAX_GROUP_LENGTH:
        this.GAMEACTIONS_MAX_GROUP_LENGTH += valueOne
        break;
      case ESettings.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION:
        this.GAMEACTIONS_EXPLOSION_ANIMATION_DURATION += valueHundred
        break;
      case ESettings.GAMEACTIONS_EXPLOSION_DAMAGE:
        this.GAMEACTIONS_EXPLOSION_DAMAGE += valueOne
        break;
      case ESettings.GAMEACTIONS_PUPPY_DAMAGE:
        this.GAMEACTIONS_PUPPY_DAMAGE += valueOne
        break;

      case ESettings.TOWER_PADDING:
        this.TOWER_PADDING += valueTen
        break;
      case ESettings.ZONE_SWIPE_OFFSET:
        this.ZONE_SWIPE_OFFSET += valueTen
        break;
      case ESettings.GAME_DIFFICULTY:
        this.GAME_DIFFICULTY += valueTen
        break;
    }
  }

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