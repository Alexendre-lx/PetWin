import { useRouter } from 'next/router';
import styles from './participateMultiForm.module.scss';
import Button from '@petwin/components/common/Button/Button';
import cn from 'classnames';
import React, { useRef, useState, useContext, ChangeEvent, useEffect } from 'react';
import Upload from '@petwin/icons/upload';
import Facebook from '@petwin/icons/facebook';
import Email from '@petwin/icons/email';
import ParticipantIconBig from '@petwin/icons/participantIconBig';
import Gmail from '@petwin/icons/gmail';
import SignInModal from '@petwin/components/common/SignInModal/SignInModal';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { convertFile } from '@petwin/utils/convertFile';
import { NewParticipantProps } from '@petwin/components/common/NewParticipant/NewParticipant.props'
import { Loader } from '../common/Loader/Loader';
import Image from 'next/image';
import CongratulationsModal from '../common/CongratulationsModal/CongratulationsModal'
import CreateProfileModal from '../common/CreateProfileModal/CreateProfileModal';
import { UserCredential } from "firebase/auth";
import axios
  from 'axios';
interface ParticipantData {
  ownerId: string,
  location: string,
  breed: string,
  name: string,
  description: string,
  specie: string,
  pictures: string[],

}



const ParticipateMultiForm = () => {
  const router = useRouter();
  const formStep: string | string[] = router.query.step ?? '0';
  const [alert, setAlert] = useState<boolean>(false);
  const [openSignUpMenu, setOpenSignUpMenu] = useState<boolean>(false);
  const { googleSignIn, currentUser, getUserToken } = useContext(UserContext) as UserContextType;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const [openCongratulationModal, setopenCongratulationModal] = useState<boolean>(false);
  const [contentCongratulationModal, setContentCongratulationModal] = useState<string>('');
  const [imagesfile, setImagesFile] = useState<File[]>([])
  const [openCreateProfileModal, setOpenCreateProfileModal] = useState<boolean>(false);
  const [userCredential, setUserCredential] = useState<UserCredential>()
  const [userToken, setUserToken] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [participantData, setParticipantData] = useState<ParticipantData>({
    ownerId: '', // Vous devrez définir currentUser.uid ici
    location: '',
    breed: '',
    name: '',
    description: '',
    specie: 'Dog',
    pictures: [],
  });


  const addParticipantAndParticipate = async (data: ParticipantData, userId: string, userToken: string) => {
    setIsLoading(true)
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
        setIsError(true)
      }
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
    }
  }

  const addUser = async (dataUser: UserCredential) => {
    try {

      const response = await axios.post('http://localhost:8080/api/users/addUser', {
        uid: dataUser.user.uid,
        email: dataUser.user.email,
        registrationDate: dataUser.user.metadata.creationTime,
        userFirstName: dataUser.user.displayName,
      },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      if (!response.data) {
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
    }

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





  function toggleCongratulationModal() {
    setopenCongratulationModal((prevState) => !prevState);
  }

  function toggleSignUpMenu() {
    setOpenSignUpMenu((prevState) => !prevState);
  }
  const goToStep = (step: number) => {
    if ((step === 1 && !participantData.name.trim()) || (step === 2 && selectedImages.length === 0)) {
      setAlert(true);
    } else {
      router.push(`?step=${step}`);
      setAlert(false);
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImagesArray: string[] = [];
      const newImagesURLArray: string[] = [];
      const newImagesfile: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (newImagesArray.length < 4) {
          newImagesArray.push(URL.createObjectURL(files[i]));
          newImagesfile.push(files[i])
          const url = await convertFile(files[i])
          if (url) newImagesURLArray.push(url)

        }
      }
      setSelectedImages([...selectedImages, ...newImagesArray]);
      setImagesFile([...imagesfile, ...newImagesfile])
      handleChangePictures([...participantData.pictures, ...newImagesURLArray])

    }

  }


  const handleImageRemove = (index: number) => {
    const updatedImages = [...selectedImages];
    const updatedImagesFile = [...imagesfile];
    const updatedImagesURL = [...participantData.pictures];
    updatedImagesFile.splice(index, 1)
    updatedImages.splice(index, 1);
    updatedImagesURL.splice(index, 1);
    setSelectedImages(updatedImages);
    setImagesFile(updatedImagesFile);
    handleChangePictures(updatedImagesURL)

  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };


  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantData((prevData) => ({
      ...prevData,
      name: event.target.value,
    }));
  };

  const handleChangeSpecies = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantData((prevData) => ({
      ...prevData,
      specie: event.target.value,
    }));
  };

  const handleChangePictures = (pictures: string[]) => {
    setParticipantData((prevData) => ({
      ...prevData,
      pictures: pictures,
    }));
  };
  const handleCancelCreateProfileModal = () => {
    setOpenCreateProfileModal((prevState) => !prevState)
  }

  const handleParticipate = async (participantData: ParticipantData, ownerId: string, userToken: string) => {
    await addParticipantAndParticipate(participantData, ownerId, userToken);
  };

  const handleSignInAndParticipate = async () => {
    const userCredential = await googleSignIn();
    if (userCredential.user.displayName) {
      await addUser(userCredential)
      const userToken = await userCredential.user.getIdToken()
      if (participantData.name !== '' && userToken) await handleParticipate(participantData, userCredential.user.uid, userToken)
    } else {
      setUserCredential(userCredential)
      setOpenCreateProfileModal((prevState) => !prevState);
    }
  }
  return (
    <>
      <div className={styles.Form}>
        <div className={styles.FormContainer}>
          <ParticipantIconBig />
          {formStep == '0' && (
            <>
              <div className={cn(styles.Title, 'text-nowrap')}>
                Comment s’appelle-t-il ?
              </div>
              <input
                type="text"
                className={cn(styles.InputForm, 'w-full')}
                placeholder="Nom de votre Animal"
                value={participantData.name}
                onChange={handleChangeName}
              />
              {alert && (
                <div className={cn(styles.Alert, 'w-100 pl-1')}>
                  Veuillez entrer le nom de votre Animal
                </div>
              )}
              <div className={styles.ButtonWrapper}>
                <Button label="Continuer" md onClick={() => goToStep(1)} />
              </div>
            </>
          )}
          {formStep == '1' && (
            <>
              <div className={cn(styles.Title, 'text-nowrap')}>Ajouter des photos</div>
              <div className={cn(styles.imageUploader, 'w-full')}>
                <div className={styles.imageCounter}>Images sélectionnées : {selectedImages.length}/4</div>
                <div className={styles.imageGrid}>
                  {selectedImages.map((image, index) => (
                    <div key={index} className={styles.imageContainer}>
                      <Image src={image} alt="Selected" width={100} height={100} />
                      <button onClick={() => handleImageRemove(index)}>Supprimer</button>
                    </div>
                  ))}
                </div>
                {selectedImages.length < 4 && (
                  <button className={cn(styles.InputFileForm, 'w-full')} onClick={handleClick}>
                    <div className={styles.Placeholder}>
                      <Upload />
                      <div>Depuis votre ordinateur</div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="invisible w-full h-full"
                      onChange={handleImageChange}
                      ref={hiddenFileInput}
                    />
                  </button>
                )}
              </div>
              {alert && (
                <div className={cn(styles.Alert, 'w-100 pl-1')}>
                  Veuillez choisir au moins une photo
                </div>
              )}
              <div className={styles.ButtonWrapper}>
                <Button label="Précédent" white md onClick={() => goToStep(0)} />
                <Button label="Continuer" md onClick={() => goToStep(2)} />
              </div>
            </>
          )}
          {formStep == '2' && (
            <>
              <div className={cn(styles.Title, 'text-nowrap')}>
                Quelle espèce ?

              </div>
              <div className={styles.RadiosWrapper}>
                <label className={styles.ContainerRadio}>
                  Chien
                  <input
                    type="radio"
                    value="Dog"
                    name="species"
                    checked={participantData.specie === 'Dog'}
                    onChange={handleChangeSpecies}
                  />
                  <span className={styles.Checkmark}></span>
                </label>
                <label className={styles.ContainerRadio}>
                  Chats
                  <input
                    type="radio"
                    value="Cat"
                    name="species"
                    checked={participantData.specie === 'Cat'}
                    onChange={handleChangeSpecies}
                  />
                  <span className={styles.Checkmark}></span>
                </label>
              </div>
              <div className={styles.ButtonWrapper}>
                <Button label="Précédent" white md onClick={() => goToStep(1)} />
                {isLoading ? (
                  <Button label="Partcipate" md disabled icon={<Loader />} />
                ) : (
                  <Button label="Partcipate" md onClick={currentUser ? async () => await handleParticipate(participantData, currentUser.uid, userToken,) : () => goToStep(3)} />
                )}

              </div>
            </>
          )}
          {formStep == '3' && (

            <>
              <div className={styles.Title}>
                Sign up to validate your participation:
              </div>
              <div className={styles.LoginButtonsWrapper}>
                <div>
                  <button className={styles.LoginButton}>
                    <Facebook />
                    Facebook Sign Up
                  </button>
                </div>
                <div>
                  <button
                    className={styles.LoginButton}
                    onClick={toggleSignUpMenu}
                  >
                    <Email />
                    Email Sign Up
                  </button>
                </div>
                <div>
                  <button
                    className={cn(styles.LoginButton, styles.GmailButton)}
                    onClick={handleSignInAndParticipate}>
                    <Gmail />
                    Gmail Sign Up

                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {openSignUpMenu &&
        <SignInModal
          openModal={openSignUpMenu}
          handleClose={toggleSignUpMenu}
          emailModal={openSignUpMenu}
          isSignUpForm={openSignUpMenu}
          participantData={participantData}
        />
      }
      {openCreateProfileModal && (
        <CreateProfileModal
          handleCancel={handleCancelCreateProfileModal}
          openModal={openCreateProfileModal}
          participantData={participantData}
          userCredential={userCredential}
          isGoogle={true}
        />
      )}
    </>
  );
};
export default ParticipateMultiForm;
