import { useState, useEffect } from 'react';

import {
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
  Weather,
  Visibility,
} from './types';
import { getAllDiaries, createDiary } from './diaryService';

const App = () => {
  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    // todays date in format yyyy-mm-dd
    date: new Date().toISOString().split('T')[0],
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: '',
  });
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([
    {} as NonSensitiveDiaryEntry,
  ]);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createDiary(newEntry).then((data) => {
      setDiaries(diaries.concat(data));
    });
    setNewEntry({
      // todays date in format yyyy-mm-dd
      date: new Date().toISOString().split('T')[0],
      weather: Weather.Sunny,
      visibility: Visibility.Great,
      comment: '',
    });
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={diaryCreation}>
        <input
          type="date"
          name="date"
          id="date"
          value={newEntry.date}
          onChange={(event) => {
            console.log(event.target.value);
            setNewEntry((state) => ({ ...state, date: event.target.value }));
          }}
        />
        <br />
        <div>
          weather: {Weather.Sunny}
          <input
            type="radio"
            name="weather"
            defaultChecked
            value={Weather.Sunny}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                weather: event.target.value as Weather,
              }))
            }
          />
          {Weather.Rainy}
          <input
            type="radio"
            name="weather"
            value={Weather.Rainy}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                weather: event.target.value as Weather,
              }))
            }
          />
          {Weather.Cloudy}
          <input
            type="radio"
            name="weather"
            value={Weather.Cloudy}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                weather: event.target.value as Weather,
              }))
            }
          />
          {Weather.Stormy}
          <input
            type="radio"
            name="weather"
            value={Weather.Stormy}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                weather: event.target.value as Weather,
              }))
            }
          />
          {Weather.Windy}
          <input
            type="radio"
            name="weather"
            value={Weather.Windy}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                weather: event.target.value as Weather,
              }))
            }
          />
        </div>
        <div>
          visibility: {Visibility.Great}
          <input
            type="radio"
            name="visibility"
            value={Visibility.Great}
            defaultChecked
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                visibility: event.target.value as Visibility,
              }))
            }
          />
          {Visibility.Good}
          <input
            type="radio"
            name="visibility"
            value={Visibility.Good}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                visibility: event.target.value as Visibility,
              }))
            }
          />
          {Visibility.Ok}
          <input
            type="radio"
            name="visibility"
            value={Visibility.Ok}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                visibility: event.target.value as Visibility,
              }))
            }
          />
          {Visibility.Poor}
          <input
            type="radio"
            name="visibility"
            id="weather"
            value={Visibility.Poor}
            onChange={(event) =>
              setNewEntry((state) => ({
                ...state,
                visibility: event.target.value as Visibility,
              }))
            }
          />
        </div>
        <input
          value={newEntry.comment}
          onChange={(event) =>
            setNewEntry((state) => ({ ...state, comment: event.target.value }))
          }
        />
        <br />
        <button type="submit">add</button>
      </form>
      <h3>Diary Entries</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {diaries.map((diary) => (
          <div key={diary.id + diary.date} style={{ marginBottom: '10px' }}>
            <h4>{diary.date}</h4>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};
export default App;
