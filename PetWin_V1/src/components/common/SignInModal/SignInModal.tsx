import styles from './signInModal.module.scss';
import { Modal } from 'react-bootstrap';
import { SignInModalProps } from '@petwin/components/common/SignInModal/SignInModal.props';
import Button from '@petwin/components/common/Button/Button';
import React, { useContext, useEffect, useState } from 'react';
import Facebook from '@petwin/icons/facebook';
import Email from '@petwin/icons/email';
import cn from 'classnames';
import Gmail from '@petwin/icons/gmail';

import { UserContext, UserContextType } from '@petwin/context/userContext';
import { UserCredential } from "firebase/auth";
import { useRouter } from 'next/router';
import CreateProfileModal from '../CreateProfileModal/CreateProfileModal';
import { validerAdresseEmail } from '@petwin/utils/validationEmail'
import axios from 'axios';

const SignInModal = ({
  openModal,
  handleClose,
  isSignUpForm,
  emailModal,
  participantData,

}: SignInModalProps) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [signUpButtons, setSignUpButtons] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validation, setValidation] = useState<string>("");
  const [openCreateProfileModal, setOpenCreateProfileModal] = useState<boolean>(false);
  const [userCredential, setUserCredential] = useState<UserCredential>()
  const router = useRouter();


  const [isError, setIsError] = useState<boolean>(false)
  const { signIn, signUp, googleSignIn } = useContext(UserContext) as UserContextType;

  const getUserExists = async (userId: string): Promise<boolean> => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/userExists?userId=${userId}`);
      if (!response.data) {
        setIsError(true)
      }
      return response.data;
    } catch (error) {
      setIsError(true)
      return false
    }
  }

  const getCheckEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/checkEmail?email=${email}`);
      if (!response.data) {
        setIsError(true)
      }
      return response.data;
    } catch (error) {
      setIsError(true)
      return false

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
    if (isSignUpForm && !emailModal) setSignUpButtons(true);
    isSignUpForm && setIsSignUp(true)

  }, [isSignUpForm]);

  const toggleSignUp = () => {
    setIsSignUp((prevState) => !prevState);
    setSignUpButtons((prevState) => !prevState);
  };

  const handleSignUp = () => {
    setIsSignUp(true);
    setSignUpButtons(true);
  };

  const handleSignIn = () => {
    setIsSignUp(false);
    setSignUpButtons(false);
  };

  const toggleEmailSignUp = () => {
    setIsSignUp(true);
    setSignUpButtons(false);
  };

  const handleCancel = () => {
    handleClose();
    handleSignIn();
    setValidation('');


  };

  const handleCancelCreateProfileModal = () => {
    handleClose();
    handleSignIn();
    setOpenCreateProfileModal((prevState) => !prevState)
  }

  const cleanInputs = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }



  const handleSignInClick = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationMessage = '';
    try {
      const userCredential = await signIn(email, password);
      handleCancel()
      router.push(`/profiles/${userCredential.user.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-email') {
        validationMessage = 'Invalid email or password'
      }

    }
    setValidation(validationMessage);
  }

  const handleSignUpClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const checkEmail = await getCheckEmail(email)
    const checkEmailInput = validerAdresseEmail(email)
    let validationMessage = '';
    if (password.length < 6 || confirmPassword.length < 6) {
      validationMessage = "6 caractère minimum";
    } else if (password !== confirmPassword) {
      validationMessage = "Les deux mots de passe son différents";
    } else if (!checkEmailInput) {
      validationMessage = "Email invalide";
    } else if (!checkEmail) {
      validationMessage = "Email déjà utilisé";
    } else {
      setOpenCreateProfileModal(true)
    }
    setValidation(validationMessage);
  }


  const handleSignUpWithGoogle = async () => {

    const userCredential = await googleSignIn();
    const isRegistered = await getUserExists(userCredential.user.uid)
    if (!isRegistered) await addUser(userCredential)
    handleCancel()


  };



  return (
    !openCreateProfileModal ? (
      <Modal
        show={openModal}
        onHide={handleCancel}
        centered
        className={styles.Modal}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title className={styles.ModalTitle}>
            {isSignUp ? "S'inscrire" : 'Se connecter'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {signUpButtons ? (
            <>
              <div className={styles.LoginButtonsWrapper}>
                <div>
                  <button className={styles.LoginButton}>
                    <Facebook />
                    S'inscrire avec Facebook
                  </button>
                </div>
                <div>
                  <button
                    className={styles.LoginButton}
                    onClick={toggleEmailSignUp}
                  >
                    <Email />
                    S'inscrire avec un Email
                  </button>
                </div>
                <div>
                  <button className={cn(styles.LoginButton, styles.GmailButton)}
                    onClick={handleSignUpWithGoogle}>
                    <Gmail />
                    S'inscrire avec Google
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.InputForm}>
                <div className={styles.Label}>Email</div>
                <input
                  required
                  type="text"
                  className={styles.Input}
                  placeholder="Saisissez votre Email"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.InputForm}>
                <div className={styles.Label}>Mot de passe</div>
                <input
                  required
                  type="password"
                  className={styles.Input}
                  placeholder="Saisissez votre Mot de passe"
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </div>

              {isSignUp ? (
                <>
                  <div className={styles.InputForm}>
                    <div className={styles.Label}>Confirmez votre mot de passe</div>
                    <input
                      required
                      type="password"
                      className={styles.Input}
                      placeholder="Confirmez votre mot de passe"
                      onChange={(e: any) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.ContinueWithWrapper}>
                  <div className={styles.ContinueWith}>Ou continuez avec:</div>
                  <div className={styles.LoginButtonsWrapper}>
                    <div>
                      <button className={styles.LoginButton}>
                        <Facebook />
                        Se connecter avec Facebook
                      </button>
                    </div>
                    <div>
                      <button
                        className={cn(styles.LoginButton, styles.GmailButton)}
                        onClick={handleSignUpWithGoogle}
                      >
                        <Gmail />
                        Se connecter avec Google
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <p className={cn(styles.Alert, 'w-100 pl-1')}>{validation}</p>

            </>
          )}
          <div
            className={styles.DontHaveAnAccount}
            onClick={isSignUp ? handleSignIn : handleSignUp}
          >
            {isSignUp
              ? 'Avez-vous déjà un compte ? Se connecter'
              : `Vous n'avez pas de compte? S 'inscrire`}
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.ModalFooter}>
          <div className={styles.ButtonContainer}>
            <Button md label="Cancel" onClick={handleCancel} />
            <Button orange md label={isSignUp ? "S'inscrire" : 'Se connecter'}
              onClick={isSignUp ? handleSignUpClick : handleSignInClick} />
          </div>
        </Modal.Footer>

      </Modal>
    ) : (
      <CreateProfileModal
        handleCancel={handleCancel}
        email={email}
        password={password}
        openModal={openCreateProfileModal}
        participantData={participantData}
        userCredential={userCredential}

      />
    )

  )
};


export default SignInModal;
