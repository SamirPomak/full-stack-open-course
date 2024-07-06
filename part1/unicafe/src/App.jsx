import { useState } from 'react';

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>
      {text} {value}
    </td>
  </tr>
);

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const Statistics = ({ good, neutral, bad }) => {
  const average = ((good - bad) / good + neutral + bad).toFixed(1);
  const positive = ((good * 100) / (good + bad + neutral)).toFixed(1);

  if (good + neutral + bad === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={positive + ' %'} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood((state) => state + 1);
  const handleBadClick = () => setBad((state) => state + 1);
  const handleNeutralClick = () => setNeutral((state) => state + 1);

  return (
    <>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={handleGoodClick} />
      <Button text={'neutral'} onClick={handleNeutralClick} />
      <Button text={'bad'} onClick={handleBadClick} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
