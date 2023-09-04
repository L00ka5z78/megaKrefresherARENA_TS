import { ValidationError } from '../utils/error';
import { v4 as uuid } from 'uuid';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';

type WarriorRecordsResults = [WarriorRecord[], FieldPacket[]];

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
  public wins?: number;

  constructor(obj: Omit<WarriorRecord, 'insert' | 'update'>) {
    const { id, name, stamina, defence, power, wins, agility } = obj;

    const stats = [stamina, defence, power, agility];

    const sum = stats.reduce((prev, curr) => prev + curr, 0);

    for (const stat of stats) {
      if (stat < 1) {
        throw new ValidationError('Each of stats must be at least 1');
      }
    }

    if (sum !== 10) {
      throw new ValidationError(`Sum all stats must be 10. Actually is ${sum}`);
    }
    if (name.length < 3 && name.length > 50) {
      throw new ValidationError(
        `Name must be at least 3 characters and less than 50 characters. ${name.length} characters right now.`
      );
    }
    this.id = id ?? uuid();
    this.wins = wins ?? 0;
    this.name = name;
    this.stamina = stamina;
    this.power = power;
    this.defence = defence;
    this.agility = agility;
  }

  async insert(): Promise<string> {
    await pool.execute(
      'INSERT INTO `warriors`(`id`, `name`, `power`, `defence`, `stamina`, `agility`, `wins`) VALUES (:id, :name, :power, :defence, :stamina, :agility, :wins)',
      {
        id: this.id,
        name: this.name,
        power: this.power,
        defence: this.defence,
        stamina: this.stamina,
        agility: this.agility,
        wins: this.wins,
      }
    );
    return this.id;
  }

  async update(): Promise<void> {
    await pool.execute(
      'UPDATE `warriors` SET `wins` = :wins WHERE `id` = :id',
      {
        id: this.id, //id from 72 line was without backstick
        wins: this.wins,
      }
    );
  }

  static async getOne(id: string): Promise<WarriorRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` WHERE `id` = :id',
      {
        id,
      }
    )) as WarriorRecordsResults;

    return results.length === 0 ? null : new WarriorRecord(results[0]);
  }

  static async listAll(): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors`'
    )) as WarriorRecordsResults;

    return results.map((obj) => new WarriorRecord(obj));
  }

  static async listTop(topCount: number): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` ORDER BY `wins` DESC LIMIT :topCount',
      {
        topCount,
      }
    )) as WarriorRecordsResults;

    return results.map((obj) => new WarriorRecord(obj));
  }

  static async isNameTaken(name: string): Promise<boolean> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` WHERE `name` = :name',
      {
        name,
      }
    )) as WarriorRecordsResults;
    return results.length > 0;
  }
}
