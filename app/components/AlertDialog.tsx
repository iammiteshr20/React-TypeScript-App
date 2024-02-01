import React from 'react';
import './AlertDialog.css';

interface AlertDialogProps {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
  message: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onDelete, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog">
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '40px'}}>
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="delete" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
