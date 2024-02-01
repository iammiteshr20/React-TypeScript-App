import React from 'react';
import './Collapsible.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import img from '../pic.png';

interface CollapsibleProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onToggle: () => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, isOpen, onToggle, children }) => {


  return (
    <div className="collapsible">
      <div 
        className="collapsible-header" onClick={onToggle} 
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '20px'}}
      >
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <img src={img} alt="profile-picture" style={{height: '60px', width: '60px', borderRadius: '100%', border: '1px solid'}}/>
          <h3 style={{marginLeft: '20px'}}>{title}</h3>
        </div>
        {!isOpen && (<FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '24px'}}/>)}
        {isOpen && (<FontAwesomeIcon icon={faChevronUp} style={{ fontSize: '24px'}}/>)}
      </div>
      <div className={`collapsible-content ${!isOpen ? 'hidden' : ''}`}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;
