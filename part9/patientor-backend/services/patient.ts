import uuid from 'uuid';
import patients from '../data/patients';
import { NewPatientEntry, NonSensitivePatient, Patient } from '../types';

const getNonSensitiveEntries = (): NonSensitivePatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    occupation,
    gender,
  }));

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient = {
    id: uuid.v1(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getNonSensitiveEntries, addPatient };
