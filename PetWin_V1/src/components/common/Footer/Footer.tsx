import styles from './footer.module.scss';
import cn from 'classnames';
import Home from '@petwin/icons/home';
import Search from '@petwin/icons/search';
import ParticipateMobile from '@petwin/icons/participateMobile';
import ContestMobile from '@petwin/icons/contestMobile';
import ProfileMobile from '@petwin/icons/profileMobile';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import SignInModal from '@petwin/components/common/SignInModal/SignInModal';
import { UserContext, UserContextType } from '@petwin/context/userContext';

function Footer() {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);

  const { currentUser, logOut, userProfilePicture } = useContext(UserContext) as UserContextType;

  const [openSignInMenu, setOpenSignInMenu] = useState<boolean>(false);

  function toggleSignInMenu() {
    setOpenSignInMenu((prevState) => !prevState);
  }

  return (
    <>
      <footer className={cn(styles.Footer)}>
        <Link href="/">Copyright © 2023 PetWin</Link>
      </footer>
      <div className={cn(styles.MobileMenu, 'sticky bottom-0')}>
        <ul>
          <li>
            <Link
              href={'/'}
              className={cn(router.pathname == '/' && styles.Active)}
            >
              <Home />
              <div>Home</div>
            </Link>
          </li>
          <li>
            <Link
              href={'/contestants/search'}
              className={cn(
                router.pathname == '/contestants/search' && styles.Active
              )}
            >
              <Search />
              <div>Search</div>
            </Link>
          </li>
          <li>
            <Link
              href={'/participate'}
              className={cn(
                router.pathname == '/participate' && styles.ActiveBold
              )}
            >
              <ParticipateMobile />
              <div>Participate</div>
            </Link>
          </li>
          <li>
            <Link
              href={'/contests'}
              className={cn(
                router.pathname.includes('/contests') && styles.Active
              )}
            >
              <ContestMobile />
              <div>Contest</div>
            </Link>
          </li>
          <li>
            {currentUser ? (
              <Link
                href={`/profiles/${currentUser.uid}`}
                className={cn(
                  router.pathname == `/profiles/${currentUser.uid}` && styles.ActiveBold
                )}
              >
                <ProfileMobile />
                <div>Profile</div>
              </Link>
            ) : (
              <a onClick={toggleSignInMenu}>
                <ProfileMobile />
                <div>Profile</div>
              </a>
            )}
          </li>
        </ul>
      </div>
      {openSignInMenu && (
      <SignInModal openModal={openSignInMenu} handleClose={toggleSignInMenu} />

      )}
    </>
  );
}

export default Footer;
