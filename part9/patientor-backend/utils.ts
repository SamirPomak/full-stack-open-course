import { NewPatientEntry, newPatientSchema } from './types';

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return newPatientSchema.parse(object);
};
