import type { CoursePart } from '../types';
import { Part } from './Part';

export const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};
