import express, { Response } from 'express';
import { NonSensitivePatient } from '../types';
import patientsService from '../services/patient';
import { toNewPatientEntry } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientsService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);

    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

export default router;
