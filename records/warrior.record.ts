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
  public readonly power: string;
  public readonly defence: string;
  public readonly stamina: string;
  public readonly agility: string;
  public readonly wins: string;

  constructor(obj: Omit<WarriorRecord, 'insert' | 'update'>) {
    const { id, name, stamina, defence, power, wins, agility } = obj;

    this.id = id;
    this.wins = wins ?? 0;
    this.name = name;
    this.stamina = stamina;
    this.power = power;
    this.defence = defence;
    this.agility = agility;
  }
}
