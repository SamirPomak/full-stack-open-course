/* eslint-disable react/prop-types */
import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'CLEAR_NOTIFICATION':
      return {
        message: '',
        severity: '',
      };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: '',
    severity: '',
  });

  const raiseNotification = (config) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: config });
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION', payload: config });
    }, 5000);
  };

  return (
    <NotificationContext.Provider
      value={[notification, notificationDispatch, raiseNotification]}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
