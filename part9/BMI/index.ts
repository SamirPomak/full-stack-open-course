import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNaN(heightNum) || isNaN(weightNum)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // Import the calculateBmi function from bmiCalculator.ts
  const bmi = calculateBmi(heightNum, weightNum);

  return res.json({
    height: heightNum,
    weight: weightNum,
    bmi,
  });
});

app.post('/exercises', (request, response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = request.body;

  if (!daily_exercises || !target) {
    return response.status(400).json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((h) => isNaN(Number(h))) ||
    isNaN(Number(target))
  ) {
    return response.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(
    daily_exercises.map((h) => Number(h)),
    Number(target)
  );

  return response.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
