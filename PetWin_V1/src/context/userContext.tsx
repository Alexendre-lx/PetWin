import { createContext, useState, useEffect, ReactNode, SetStateAction, Dispatch } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
  onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
} from "firebase/auth";
import { auth } from "../../config/firebaseClient-config";
import axios from "axios";
interface DataUserHeader {
  profilePicture: string;
  name: string;
}


export type UserContextType = {
  signUp: (email: string, pwd: string) => Promise<UserCredential>,
  currentUser: User | null,
  signIn: (email: string, pwd: string) => Promise<UserCredential>,
  googleSignIn: () => Promise<UserCredential>,
  logOut: () => Promise<any>,
  userProfilePicture: string | null,
  userName: string | null,
  getUserToken: (user: User) => Promise<string>
  fetchData: () => Promise<void>
};




export const UserContext = createContext<UserContextType | null>(null);

async function getUserProfilePicture(userId: string): Promise<DataUserHeader | null> {
  try {
    const response = await axios.get(`http://localhost:8080/api/users/getUserProfilePicture?userId=${userId}`);
    if (!response.data) {
      return null
    }
    return response.data;
  } catch (error) {
    return null
  }
}
const getUserToken = async (user: User): Promise<string> => {
  if (user) {
    const token = await user.getIdToken();
    return String(token);
  } else {
    return '';
  }
}


export function UserContextProvider({ children }: { children: ReactNode }) {
  const signUp = async (email: string, pwd: string) =>
    await createUserWithEmailAndPassword(auth, email, pwd);

  const signIn = (email: string, pwd: string) =>
    signInWithEmailAndPassword(auth, email, pwd);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredentials = await signInWithPopup(auth, provider);
    return userCredentials
  };


  const logOut = () => signOut(auth);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null)

  const fetchData = async () => {
    if (currentUser) {
      const dataUser = await getUserProfilePicture(currentUser.uid);
      setUserProfilePicture(dataUser?.profilePicture ?? null);
      setUserName(dataUser?.name ?? null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setLoadingData(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
   fetchData();
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ signUp, signIn, currentUser, logOut, userProfilePicture, userName, googleSignIn, getUserToken, fetchData }}>
      {children}
    </UserContext.Provider>
  );
}
