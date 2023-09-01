import { ValidationError } from '../utils/error';
import { v4 as uuid } from 'uuid';

export class WarriorRecord {
  public id?: string;
  /**
   * namie is always unique. Example
   * `console.log('abcdefg')  -writing own tips in help menu
   * ```JS
   *const obj = new warriorRecord();
   * console.log(obj.name);
   *
   * const w = new WarriorRecord(); moved from index.ts
   * w.
   * ```
   */
  public readonly name: string;
  public readonly power: number;
  public readonly defence: number;
  public readonly stamina: number;
  public readonly agility: number;
  public readonly wins?: number;

  constructor(obj: Omit<WarriorRecord, 'insert' | 'update'>) {
    const { id, name, stamina, defence, power, wins, agility } = obj;

    const sum = [stamina, defence, power, agility].reduce(
      (prev, curr) => prev + curr,
      0
    );
    if (sum !== 10) {
      throw new ValidationError(
        `All stats sum has to be 10. Now it is ${sum}.`
      );
    }
    if (name.length < 3 && name.length > 50) {
      throw new ValidationError(
        `Name has to be between 3 - 50 characters long Right now is ${name.length}`
      );
    }

    this.id = id;
    this.wins = wins ?? 0;
    this.name = name;
    this.stamina = stamina;
    this.power = power;
    this.defence = defence;
    this.agility = agility;
  }
  async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }
  }

  async update(): Promise<void> {}

  static async getOne(id: string): Promise<WarriorRecord | null> {}

  static async listAll(): Promise<WarriorRecord[]> {}

  static async listTop(topCount: number): Promise<WarriorRecord[]> {}
}
