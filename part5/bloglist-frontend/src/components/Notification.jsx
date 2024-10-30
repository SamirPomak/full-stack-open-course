const Notification = ({ config }) => {
  if (!config.message) {
    return null;
  }

  return (
    <div className={`notification ${config?.severity}`}>{config?.message}</div>
  );
};

export default Notification;
