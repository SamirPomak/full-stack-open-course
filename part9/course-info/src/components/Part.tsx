import type { CoursePart } from '../types';
import { assertNever } from '../utils';

export const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <i>{part.description}</i>
        </div>
      );
    case 'group':
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <i>{part.description}</i>
          <p>background material: {part.backgroundMaterial}</p>
        </div>
      );
    case 'special':
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <i>{part.description}</i>
          <p>required skills: {part.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};
