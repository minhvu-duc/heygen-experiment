// src/components/ProcessStatus.jsx
const ProcessStatus = ({ status, message }) => {
    return (
      <div className="process-status">
        <div className="status-indicator">
          <div className="spinner"></div>
          <span>{status}</span>
        </div>
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default ProcessStatus;