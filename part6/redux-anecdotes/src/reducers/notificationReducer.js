import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      console.log('notification', action);
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  },
});

export const { clearNotification } = notificationSlice.actions;

export const setNotification = (notification, time = 5) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(notification));

    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
