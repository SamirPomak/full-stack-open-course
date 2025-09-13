import type { CoursePart } from '../types';

export const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return <p>Total number of exercises: {totalExercises}</p>;
};
