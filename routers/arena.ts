import { Router } from 'express';

export const arenaRouter = Router();

arenaRouter
  .get('/fight-form', (req, res) => {
    res.send('Fight log');
  })

  .post('/fight', (req, res) => {
    res.send('Fight carrying out... ');
  });
