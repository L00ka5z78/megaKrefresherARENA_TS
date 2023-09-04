import { WarriorRecord } from '../records/warrior.record';

export const fight = (
  warrior1: WarriorRecord,
  warrior2: WarriorRecord
): {
  log: string[];
  winner: WarriorRecord;
} => {
  const log: string[] = [];

  const warrior1Obj = {
    hp: warrior1.stamina * 10,
    dp: warrior1.defence,
    warrior: warrior1,
  };
  const warrior2Obj = {
    hp: warrior2.stamina * 10,
    dp: warrior2.defence,
    warrior: warrior2,
  };

  let attacker = warrior1Obj;
  let defender = warrior2Obj;

  do {
    const attackStrength = attacker.warrior.power;

    log.push(
      `${attacker.warrior.name} will attack ${defender.warrior.name} with strength of ${attackStrength}`
    );

    if (defender.dp + defender.warrior.agility > attackStrength) {
      log.push(
        `${defender.warrior.name} defends from ${attacker.warrior.name} attack`
      );
      defender.dp -= attackStrength;

      if (defender.dp < 0) {
        log.push(
          `${attacker.warrior.name} broke the defence of ${
            defender.warrior.name
          } and hit with ${-defender.hp} damage`
        );

        defender.hp += defender.dp;
      } else {
        log.push(
          `${attacker.warrior.name} hits ${attackStrength} damage ${defender.warrior.name}.`
        );

        defender.hp -= attackStrength;
      }
    }
    [defender, attacker] = [attacker, defender];
  } while (defender.hp > 0);

  const winner = defender.warrior;
  log.push(`${winner.name} wins!`);

  return {
    log,
    winner,
  };
};
