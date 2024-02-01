import type { MetaFunction } from "@remix-run/node";
import React, { useState,useEffect } from 'react';
import '../index.css';
import jsonData from '../celebrities.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Collapsible from '../components/Collapsible';
import AlertDialog from '../components/AlertDialog';

export const meta: MetaFunction = () => {
  return [
    { title: "User List" },
    { name: "description", content: "Welcome to fe-assessment!" },
  ];
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<any[]>(jsonData);
  const [openCollapsibleId, setOpenCollapsibleId] = useState<number | null>(null);
  const [editable, setEditable] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<any[]>(jsonData);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [errorCountry, setErrorCountry] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const calculateAge = (dob: string) => {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };
  
  const validateCountry = (country: string) => {
    return /^[a-zA-Z\s]+$/.test(country);
  };

  const toggleEditable = () => {
    setEditable((prevEditable) => !prevEditable);
    if (!editable) {
      // Save a copy of original data when entering edit mode
      setEditedData([...data]);
    }
  };

  const saveChanges = () => {
    if(!errorCountry){
      setData(editedData);
      setEditable(false);
    }
  };

  const cancelChanges = () => {
    setErrorCountry(false)
    setErrorMessage("")
    setEditable(false);
    setEditedData([...data]);
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    if(field === "country" && !validateCountry(value)){
      setErrorCountry(true)
      setIsChanged(false)
      setErrorMessage("Please enter only valid character for country")
    }else{
      setErrorCountry(false)
      setIsChanged(true)
      setErrorMessage("")
    }


    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleGenderChange = (id: number, value: string) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, gender: value } : item
      )
    );
  };

  const openAlertDialog = (id: number) => {
    setDeleteState(id);
    setIsAlertDialogOpen(true);
  }

  const closeAlertDialog = () => {
    setDeleteState(null);
    setIsAlertDialogOpen(false);
  }

  // Filter the JSON data based on the search query
  const filteredData = data.filter((item: any) =>
    `${item.first} ${item.last}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    setIsAlertDialogOpen(false);
    setData(data.filter((item) => item.id !== deleteState));
  };

  // Toggle the open state of a collapsible 
  // Only if the they are not editing
  const toggleCollapsible = (id: number) => {
    if(!editable){
      setOpenCollapsibleId((prevId) => (prevId === id ? null : id));
    }
  };

  useEffect(() => {
    const hasChanges = JSON.stringify(editedData) !== JSON.stringify(data);
    setIsChanged(hasChanges);
  }, [editedData, data]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", maxWidth: "40%", width: "40%", margin: "auto" }}>
      <h1>List View</h1>
      <div style={{ width:"100%" }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {filteredData.map((item: any) => (
        <Collapsible key={item.id} title={`${item.first} ${item.last}`} 
          isOpen={openCollapsibleId === item.id}
          onToggle={() => toggleCollapsible(item.id)}
        >
          <div style={{padding: "20px"}}>
            { editable ? 
              <div style={{marginBottom: '20px'}}>
                <div style={{ display: "flex", }}>
                  <div style={{ display: "flex", flexDirection: 'column', flex: '33%', padding: '10px' }}>
                    <label>Age</label>
                    <input
                      className="input-item" 
                      type="number"
                      value={editable ? calculateAge(editedData.find((el) => el.id === item.id)?.dob) : calculateAge(item.dob)}
                      onChange={(e) => setEditedData((prevData) => prevData.map((el) => (el.id === item.id ? { ...el, dob: new Date(new Date().setFullYear(new Date().getFullYear() - e.target.value)).toISOString().slice(0, 10) } : el)))}
                      style={{ 
                        border: '1px solid #b1b1b1',
                      }}
                    />
                  </div>  
                  <div style={{ display: "flex", flexDirection: 'column', flex: '33%', padding: '10px' }}>
                    <label>Gender</label>
                    <select
                      value={editable ? editedData.find((el) => el.id === item.id)?.gender : item.gender}
                      onChange={(e) => handleGenderChange(item.id, e.target.value)}
                      disabled={!editable}
                      style={{ height: '100%', borderRadius: '10px', background: 'transparent'}}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Rather not say">Rather not say</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: 'column', flex: '33%', padding: '10px' }}>
                    <label>Country</label>
                    <input 
                      type="text" 
                      value={editable ? editedData.find((el) => el.id === item.id)?.country : item.country} 
                      className="input-item" 
                      onChange={(e) => handleInputChange(item.id, 'country', e.target.value)}
                      style={{ 
                        border: validateCountry(editable ? editedData.find((el) => el.id === item.id)?.country : item.country) ? '1px solid #b1b1b1' : '1px solid red',
                        outline: validateCountry(editable ? editedData.find((el) => el.id === item.id)?.country : item.country) ? '' : 'red' 
                      }}
                    />
                  </div>
                </div>
                <div>
                  {errorCountry && <span style={{color:"red"}}>{errorMessage}</span>}
                </div>
                <div style={{ display: "flex", flexDirection: 'column' }}>
                    <label>Description</label>
                    <textarea 
                      value={editable ? editedData.find((el) => el.id === item.id)?.description : item.description}  
                      rows={5}
                      onChange={(e) => handleInputChange(item.id, 'description', e.target.value)}
                      style={{ border: '1px solid #b1b1b1'}}
                    />              
                </div>
              </div>
              :
              <div style={{marginBottom: '20px'}}>
                <div style={{ display: "flex", marginBottom: '20px' }}>
                  <div style={{ display: "flex", flexDirection: "column", flex: '33%', padding: '10px' }}>
                    <span>Age</span>
                    <span>{calculateAge(item.dob)}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: '33%', padding: '10px' }}>
                    <span>Gender</span>
                    <span>{item.gender}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: '33%', padding: '10px' }}>
                    <span>Country</span>
                    <span>{item.country}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: 'column' }}>
                    <span>Description</span>
                    <span>{item.description}</span>           
                </div>
              </div>
            }
            {!editable && 
              <div style={{display: 'flex', justifyContent:'end', width: '100%'}}>
                <FontAwesomeIcon 
                  icon={faTrashCan} 
                  style={{ marginRight:"20px", fontSize: '24px', color: 'red', cursor: "pointer"}} 
                  onClick={() => openAlertDialog(item.id)}
                />
                <FontAwesomeIcon 
                  icon={faPenToSquare} 
                  style={{ fontSize: '24px', color: 'blue', cursor: "pointer"}} 
                  onClick={() => toggleEditable()}
                />
              </div>
            }
            {editable && 
              <div style={{display: 'flex', justifyContent:'end'}}>
                <FontAwesomeIcon 
                  icon={faCircleXmark} 
                  style={{ marginRight:"20px", fontSize: '24px', color: 'red', cursor: "pointer"}} 
                  onClick={() => cancelChanges()}
                />
                {isChanged ? (
                    <FontAwesomeIcon 
                      icon={faCircleCheck} 
                      style={{ fontSize: '24px', color: 'green', cursor: "pointer"}} 
                      onClick={() => saveChanges()}
                      
                    />
                  ):
                  (
                    <FontAwesomeIcon 
                      icon={faCircleCheck} 
                      style={{ fontSize: '24px', color: 'grey', cursor: "not-allowed"}}                       
                    />
                  )
                }
              </div>
            }    
          </div>
        </Collapsible>
      ))}

      <AlertDialog
        isOpen={isAlertDialogOpen}
        onDelete={handleDelete}
        onClose={closeAlertDialog}
        message="Are you sure you want to delete?"
      />
    </div>
  );
}
