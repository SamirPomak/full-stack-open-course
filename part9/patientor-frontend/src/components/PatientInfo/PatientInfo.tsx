import { useParams } from 'react-router-dom';
import { Diagnosis, Patient } from '../../types';
import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';

const PatientInfo = () => {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | undefined>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const patient = await patientService.getById(params.id!);
      setPatient(patient);

      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchData();
  }, [params.id]);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="App">
      <h2>
        {patient.name} ({patient.gender})
      </h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <h3>entries</h3>
      {patient.entries?.length ? (
        patient.entries.map((entry) => (
          <div key={entry.id} style={{ marginBottom: '1em' }}>
            <p>
              {entry.date} {entry.description}
            </p>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>
                    {code} {diagnoses.find((d) => d.code === code)?.name || ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>No entries</p>
      )}
    </div>
  );
};

export default PatientInfo;
