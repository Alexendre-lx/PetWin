import styles from '@petwin/components/common/Header/header.module.scss';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Logo from '@petwin/icons/logo';
import Image from 'next/image';
import userAvatar from '@petwin/images/userAvatar.png';
import { useRouter } from 'next/router';
import myPet from '@petwin/images/dog.png';
import NotificationLink from '../NotificationLink/NotificationLink';
import SignInModal from '@petwin/components/common/SignInModal/SignInModal';
import SearchIcon from '@petwin/icons/search';
import { UserContext, UserContextType } from '@petwin/context/userContext';

interface DataUserHeader {
  profilePicture: string;
  name: string;
}



function Header() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openProfileMenu, setOpenProfileMenu] = useState<boolean>(false);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [modalSelected, setModalSelected] = useState<string>('Votes');
  const [openNotificationMenu, setOpenNotificationMenu] =
    useState<boolean>(false);
  const [openSignInMenu, setOpenSignInMenu] = useState<boolean>(false);
  const [openSignUpMenu, setOpenSignUpMenu] = useState<boolean>(false);
  const { currentUser, logOut, userProfilePicture, userName, fetchData } = useContext(
    UserContext
  ) as UserContextType;

  useEffect(()=>{
    fetchData()
  }, [])

  const signOut = async () => {
    await logOut();
    router.push('/');
  };
  const handleClose = () => {
    setOpenModal((s) => !s);
    setShowBalance(false);
  };

  const handleBalance = () => {
    setShowBalance((s) => !s);
  };

  function handleModalSelect(key: string) {
    setModalSelected(key);
  }

  const profileMenuRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setOpenProfileMenu(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function toggleProfileMenu() {
    setOpenProfileMenu((prevState) => !prevState);
  }

  function toggleSignInMenu() {
    setOpenSignInMenu((prevState) => !prevState);
  }

  function toggleSignUpMenu() {
    setOpenSignUpMenu((prevState) => !prevState);
  }

  const toggleNotificationMenu = useCallback(() => {
    setOpenNotificationMenu(!openNotificationMenu);
  }, [openNotificationMenu]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        openNotificationMenu &&
        target &&
        !target.closest(`.${styles.NotificationPopup}`) &&
        !target.closest(`.${styles.Notification}`)
      ) {
        toggleNotificationMenu;
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openNotificationMenu, toggleNotificationMenu]);
  return (
    <>
      <header
        className={cn(styles.NavbarContainer, {
          [styles.HomePage]: router.pathname === '/',
        })}
      >
        <div className={cn(styles.Navbar, 'row')}>
          <div className={cn(styles.LeftNav, 'col-4')}>
            <ul>
              <li>
                <Link
                  className={cn(styles.Link, {
                    [styles.Active]: router.pathname.includes('/contests'),
                  })}
                  href="/contests"
                >
                  Concours
                </Link>
              </li>
              <li>
                <Link
                  className={cn(styles.Link, {
                    [styles.Active]: router.pathname === '/participate',
                  })}
                  href="/participate"
                >
                  Participer
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={cn(
              styles.NavbarLogo,
              'col-4 d-flex justify-content-center align-items-center'
            )}
          >
            <Link href={'/'}>
              <Logo />
            </Link>
          </div>
          <div className={cn(styles.RightNav, 'col-4 p-0')}>
            <ul className={styles.RightNavItems}>
              <li
                className={cn(styles.RightNavItem, styles.Search, {
                  [styles.ActiveIcon]:
                    router.pathname === '/contestants/search',
                })}
              >
                <Link href={'/contestants/search'} className="cursor-pointer">
                  <SearchIcon />
                </Link>
              </li>

              <li
                ref={profileMenuRef}
                className={cn(
                  styles.RightNavItem,
                  styles.User,
                  'position-relative'
                )}
              >
                <a onClick={currentUser ? toggleProfileMenu : toggleSignInMenu}>
                  {currentUser ? (
                    <>
                      <Image
                        src={
                          userProfilePicture !== null
                            ? userProfilePicture
                            : userAvatar
                        }
                        width={25}
                        height={25}
                        alt="user-avatar"
                      />
                      <p>{userName && userName}</p>
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </a>
                <div
                  className={cn(
                    'position-absolute bg-white',
                    styles.ProfileMenu,
                    {
                      'd-block': openProfileMenu,
                      'd-none': !openProfileMenu,
                    }
                  )}
                >
                  <Link
                    href={`/profiles/${currentUser?.uid}`}
                    onClick={toggleProfileMenu}
                    className={styles.ProfileMenuProfile}
                  >
                    <Image
                      src={userProfilePicture ? userProfilePicture : userAvatar}
                      width={25}
                      height={25}
                      alt="user-avatar"
                    />
                    <p>Mon Profile</p>
                  </Link>
                  <Link
                    href={`/profiles/${currentUser?.uid}`}
                    onClick={toggleProfileMenu}
                  >
                    <Image src={myPet} alt="user-avatar" />
                    <p>Mes animaux</p>
                  </Link>
                  <Link href={'/participate'} onClick={toggleProfileMenu}>
                    <p>Participer</p>
                  </Link>
                  <a
                    onClick={toggleProfileMenu}
                    className={styles.ProfileMenuLogout}
                  >
                    <p onClick={signOut}>Se déconnecter</p>
                  </a>
                </div>
              </li>
              {currentUser ? (
                <NotificationLink
                  openNotificationMenu={openNotificationMenu}
                  toggleNotificationMenu={toggleNotificationMenu}
                />
              ) : (
                <li className={cn(styles.RightNavItem, styles.Lvl)}>
                  <p onClick={toggleSignUpMenu}>S'inscrire</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.MobileHeader}>
          <Link href={'/'}>
            <Logo />
          </Link>
        </div>
      </header>

      {openSignUpMenu ? (
        <SignInModal
          openModal={openSignUpMenu}
          handleClose={toggleSignUpMenu}
          isSignUpForm={true}
        />
      ) : (
        openSignInMenu && (
          <SignInModal
            openModal={openSignInMenu}
            handleClose={toggleSignInMenu}
          />
        )

      )}
    </>
  );
}

export default Header;
