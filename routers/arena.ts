import { Router } from 'express';
import { WarriorRecord } from '../records/warrior.record';
import { ValidationError } from '../utils/error';

export const arenaRouter = Router();

arenaRouter
  .get('/fight-form', async (req, res) => {
    const warriors = await WarriorRecord.listAll();

    res.render('arena/fight-form', {
      warriors,
    });
  })

  .post('/fight', async (req, res) => {
    const { warrior1: warrior1Id, warrior2: warrior2Id } = req.body;
    if (warrior1Id === warrior2Id) {
      throw new ValidationError('Choose different opponents!');
    }

    res.render('arena/fight');
  });
