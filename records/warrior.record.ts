import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/error';
import { v4 as uuid } from 'uuid';

type WarriorRecordResults = [WarriorRecord[], FieldPacket[]];

export class WarriorRecord {
  public id?: string;

  public readonly name: string;
  public readonly power: number;
  public readonly defence: number;
  public readonly stamina: number;
  public readonly agility: number;
  public wins?: number;

  constructor(obj: Omit<WarriorRecord, 'insert' | 'update'>) {
    const { id, name, stamina, defence, power, wins, agility } = obj;
    const stats = [stamina, defence, power, agility];

    const sum = [stamina, defence, power, agility].reduce(
      (prev, curr) => prev + curr,
      0
    );
    if (sum !== 10) {
      throw new ValidationError(
        `All stats sum has to be 10. Now it is ${sum}.`
      );
    }
    for (const stat of stats) {
      if (stat < 1) {
        throw new ValidationError(`Every stat has to be greater than 1`);
      }
    }

    if (name.length < 3 && name.length > 50) {
      throw new ValidationError(
        `Name has to be between 3 - 50 characters long Right now is ${name.length}`
      );
    }

    this.id = id;
    this.wins = wins;
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

    if (typeof this.wins !== 'number') {
      this.wins = 0;
    }

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
    await pool.execute('UPDATE `warriors` SET `wins` = :wins', {
      wins: this.wins,
    });
  }

  static async getOne(id: string): Promise<WarriorRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` WHERE `id` = :id',
      {
        id: id,
      }
    )) as WarriorRecordResults;

    return results.length === 0 ? null : results[0];
  }

  static async listAll(): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors`'
    )) as WarriorRecordResults;
    return results.map((obj) => new WarriorRecord(obj));
  }

  static async listTop(topCount: number): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` ORDER BY `wins` DESC LIMIT :topCount',
      {
        topCount,
      }
    )) as WarriorRecordResults;
    return results.map((obj) => new WarriorRecord(obj));
  }
}
