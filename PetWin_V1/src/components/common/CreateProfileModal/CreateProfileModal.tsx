import styles from './CreateProfileModal.module.scss';
import { Modal } from 'react-bootstrap';
import Button from '@petwin/components/common/Button/Button';
import React, { useState, useContext, useEffect } from 'react';
import { CreateProfileModalProps } from '@petwin/components/common/CreateProfileModal/CreateProfileModal.props';
import { UserCredential } from "firebase/auth";
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { useRouter } from 'next/router';
import CongratulationsModal from '../CongratulationsModal/CongratulationsModal'
import cn from 'classnames';

import { ParticipantData } from './CreateProfileModal.props'
import { NewParticipantProps } from '@petwin/components/common/NewParticipant/NewParticipant.props'
import axios from 'axios';

const CreateProfileModal = ({
  email,
  password,
  openModal,
  handleCancel,
  participantData,
  userCredential,
  isGoogle
}: CreateProfileModalProps) => {

  const router = useRouter();

  const [userFirstName, setUserFirstName] = useState<string>("")
  const [userLastName, setUserLasttName] = useState<string>("")
  const [openCongratulationModal, setopenCongratulationModal] = useState<boolean>(false);
  const [validation, setValidation] = useState<string>("");
  const [contentCongratulationModal, setContentCongratulationModal] = useState<string>('');
  const [participantdata, setParticipantData] = useState<ParticipantData>({
    ownerId: '', 
    location: '',
    breed: '',
    name: '',
    description: '',
    specie: '',
    pictures: [],
  });

  const [isErrorAddParticipant, setIsErrorAddParticipant] = useState<boolean>(false);
  const [isErrorAddUser, setIsErrorAddUser] = useState<boolean>(false);

  const { signUp } = useContext(UserContext) as UserContextType;


  const addParticipantAndParticipate = async (data: ParticipantData, userId: string, userToken: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/participants/addParticipantAndParticipate', {
        data,
        userId
      }, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
      })
      if (!response.data) {
        setIsErrorAddParticipant(true)
      }
    } catch (error) {
      setIsErrorAddParticipant(true)
    }
  }

  const addUser = async (dataUser: UserCredential, userFirstName: string, userLastName: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/addUser', {
        uid: dataUser.user.uid,
        email: dataUser.user.email,
        registrationDate: dataUser.user.metadata.creationTime,
        userFirstName: userFirstName,
        userLastName: userLastName
      },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      if (!response.data) {
        setIsErrorAddUser(true)
      }
    } catch (error) {
      setIsErrorAddUser(true)
    }

  }


  useEffect(() => {
    if (participantData) setParticipantData(participantData)
  }, [])

  function toggleCongratulationModal() {
    setopenCongratulationModal((prevState) => !prevState);
  }

  const handleParticipate = async (participantData: ParticipantData, ownerId: string, userToken: string) => {
    await addParticipantAndParticipate(participantData, ownerId, userToken);
  };


  const handleSignUpClick = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationMessage = '';
    if (userFirstName == '' || userLastName == '') {
      validationMessage = "Veuillez saisir les informations demandées";
    } else if (email && password) {
      try {

        const userCredential = await signUp(email, password);
        await addUser(userCredential, userFirstName, userLastName)
        const userToken = await userCredential.user.getIdToken()
        if (participantdata.name !== '' && userToken) await handleParticipate(participantdata, userCredential.user.uid, userToken)
        handleCancel()
        router.push(`/profiles/${userCredential.user.uid}`);


      } catch (error: any) {
        if (error.code === "auth/invalid-email") {
          validationMessage = "Invalid email format";
        } else if (error.code === "auth/email-already-in-use") {
          validationMessage = "Email is already in use";
        } else {
          console.error(error);
          validationMessage = "An error occurred during sign-up";
        }
      }
    }
    setValidation(validationMessage);
  };

  const handleSignUpClickWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationMessage = '';
    if (userFirstName == '' || userLastName == '') {
      validationMessage = "Veuillez saisir les informations demandées";
    } else if (email && password) {
      try {
        if (userCredential) {
          await addUser(userCredential, userFirstName, userLastName)
          const userToken = await userCredential.user.getIdToken()
          if (participantdata.name !== '' && userToken) await handleParticipate(participantdata, userCredential.user.uid, userToken)

          setopenCongratulationModal(true);
          setTimeout(() => {
            toggleCongratulationModal();
            handleCancel()
            router.push(`/profiles/${userCredential.user.uid}`);
          }, 3000);
        }

      } catch (error: any) {
        if (error.code === "auth/invalid-email") {
          validationMessage = "Invalid email format";
        } else if (error.code === "auth/email-already-in-use") {
          validationMessage = "Email is already in use";
        } else {
          console.error(error);
          validationMessage = "An error occurred during sign-up";
        }
      }
    }
    setValidation(validationMessage);
  }
  //if(isErrorAddParticipant || isErrorAddUser) return <p>error</p>;


  return (
    <>

      {!openCongratulationModal ? (
        <Modal
          show={openModal}
          onHide={handleCancel}
          centered
          className={styles.Modal}
          size="sm"
        >
          <Modal.Header>
            <Modal.Title className={styles.ModalTitle}>
              Créer un compte
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.Confirmation}>
              Veuillez entrer votre nom
            </div>
            <div className={styles.InputForm}>
              <div className={styles.Label}>Prénom</div>
              <input
                type="text"
                className={styles.Input}
                placeholder={'Prénom'}
                onChange={(e: any) => setUserFirstName(e.target.value)}
              />
            </div>
            <div className={styles.InputForm}>
              <div className={styles.Label}>Nom de famille</div>
              <input
                type="text"
                className={styles.Input}
                placeholder={'Nom de famille'}
                onChange={(e: any) => setUserLasttName(e.target.value)}
              />
              <p className={cn(styles.Alert, 'w-100 pl-1')}>{validation}</p>
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.ModalFooter}>
            <div className={styles.ButtonContainer}>
              <Button md label="Annuler" onClick={handleCancel} />

              <Button orange md label={"S'inscrire"} onClick={isGoogle ? handleSignUpClickWithGoogle : handleSignUpClick} />

            </div>
          </Modal.Footer>
        </Modal>
      ) : (
        <CongratulationsModal content={contentCongratulationModal} openModal={openCongratulationModal} />
      )}
    </>
  );
};

export default CreateProfileModal;
