const Notification = ({ message, severity }) => {
  if (message === null) {
    return null;
  }

  return <div className={`notification ${severity}`}>{message}</div>;
};

export default Notification;
