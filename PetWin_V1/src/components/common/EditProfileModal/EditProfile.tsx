import styles from './editProfileModal.module.scss';
import { Modal } from 'react-bootstrap';
import Button from '@petwin/components/common/Button/Button';
import React, { useState, useContext , useEffect} from 'react';
import { EditProfileProps } from './EditProfile.props';
import { convertFile } from '@petwin/utils/convertFile';
import cn from 'classnames';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import axios from 'axios';


const EditProfile = ({
  openModal,
  handleClose,
  userID,
  userName,
  userLocation,
}: EditProfileProps) => {
  const [tabValuesRegions, setTabValuesRegions] = useState<
    { key: string; value: string }[]
  >([
    { key: 'region', value: 'Région' },
    { key: 'auvergne-rhone-alpes', value: 'Auvergne-Rhône-Alpes' },
    { key: 'bourgogne-franche-comte', value: 'Bourgogne-Franche-Comté' },
    { key: 'bretagne', value: 'Bretagne' },
    { key: 'centre-val-de-loire', value: 'Centre-Val de Loire' },
    { key: 'corse', value: 'Corse' },
    { key: 'grand-est', value: 'Grand Est' },
    { key: 'hauts-de-france', value: 'Hauts-de-France' },
    { key: 'ile-de-france', value: 'Île-de-France' },
    { key: 'normandie', value: 'Normandie' },
    { key: 'nouvelle-aquitaine', value: 'Nouvelle-Aquitaine' },
    { key: 'occitanie', value: 'Occitanie' },
    { key: 'pays-de-la-loire', value: 'Pays de la Loire' },
    { key: 'provence-alpes-cote-d-azur', value: "Provence-Alpes-Côte d'Azur" },
    { key: 'outre-mer', value: 'Outre-Mer' },
    { key: 'canada', value: 'Canada' },
    { key: 'belgique', value: 'Belgique' },
    { key: 'suisse', value: 'Suisse' },
  ]);
  const [newName, setNewName] = useState(userName); // État local pour le nouveau nom
  const [newPhotoURL, setnewPhotoURL] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null); //
  const [newLocation, setNewLocation] = useState<string>(
    tabValuesRegions[0].key
  );
  const { getUserToken, currentUser } = useContext(UserContext) as UserContextType;
  const [userToken, setUserToken] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const updateUser = async(
    userId: string,
    newName: string,
    newLocation: string,
    newPhotoURL: string | ArrayBuffer,
  ) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/updateUser', 
        {
          userId,
          newName,
          newLocation,
          newPhotoURL,
        },
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        }
      }
      );
      setIsLoading(false)
    } catch (error) {
      console.error('Error updating user:', error);
      setError(true)    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userToken = await getUserToken(currentUser);
        setUserToken(userToken)
        
      }
    };
  
    fetchData();
  }, [currentUser]); 



  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = await convertFile(file);
      if (url) setnewPhotoURL(url);
      setNewPhoto(file);
    }
  };

  const selectDropdownRegions = (event: React.FormEvent<HTMLSelectElement>) => {
    setNewLocation(event.currentTarget.value);
  };

  const handleUpdateUser = async () => {
    await updateUser(userID, newName,newLocation, newPhotoURL)
    handleClose()

  };

  return (
    <Modal
      show={openModal}
      onHide={handleClose}
      centered
      scrollable
      className={styles.Modal}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title className={styles.ModalTitle}>
        Modifier mon profil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.InputForm}>
          <div className={styles.Label}>Photo de profil</div>
          <input
            type="file"
            className={styles.Input}
            placeholder="Avatar"
            onChange={handlePhotoSelect}
          />
        </div>
        <div className={styles.InputForm}>
          <div className={styles.Label}>Nom</div>
          <input
            type="text"
            className={styles.Input}
            placeholder={userName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className={styles.InputForm}>
          <div className={styles.Label}>Région</div>
          <div className="position-relative">
            <select
              name="species"
              value={newLocation}
              onChange={selectDropdownRegions}
              className={cn(styles.Input, styles.Select)}
            >
              {tabValuesRegions.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.value}
                </option>
              ))}
            </select>
            <div className={cn(styles.DropDownIcon)}></div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.Footer}>
        <div className={styles.ButtonContainer}>
          <Button md label="Annuler" onClick={handleClose} />
          <Button orange md label="Sauvegarder" onClick={handleUpdateUser} />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfile;
