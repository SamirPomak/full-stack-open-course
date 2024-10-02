const Notification = ({ config }) => {
  if (config === null) {
    return null;
  }

  return (
    <div className={`notification ${config?.severity}`}>{config?.message}</div>
  );
};

export default Notification;
