import { Menu, Transition } from '@headlessui/react';
import {
  BookOpenIcon,
  ChevronDownIcon,
  LogoutIcon,
  UserIcon,
  VideoCameraIcon,
  CollectionIcon,
  AcademicCapIcon,
} from '@heroicons/react/outline';
import { LoginIcon, UserAddIcon, ViewListIcon } from '@heroicons/react/solid';
import { useInjection } from '@polyflix/di';
import { motion } from 'framer-motion';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/polyflix-logo.png';
import { useAuth } from '../../../authentication/hooks/useAuth.hook';
import { AuthService } from '../../../authentication/services/auth.service';
import { Avatar } from '../../../ui/components/Avatar/Avatar.component';
import LanguageButton from '../../../ui/components/Buttons/LanguageButton/LanguageButton.component';
import { OutlineButton } from '../../../ui/components/Buttons/OutlineButton/OutlineButton.component';
import { Container } from '../../../ui/components/Container/Container.component';
import { Image } from '../../../ui/components/Image/Image.component';
import { Typography } from '../../../ui/components/Typography/Typography.component';
import { cn } from '../../utils/classes.util';
import { Url } from '../../utils/url.util';
import Hamburger from './Hamburger/Hamburger.component';

type Props = {
  /** If false, the navigation will be hidden */
  visible: boolean
}

export const NAV_HEIGHT = 65;

/**
 * The navigation component
 */
export const Navigation: React.FC<Props> = ({ visible }) => {
  const authService = useInjection<AuthService>(AuthService);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  const isNavbarExited = Boolean(Url.hasParameter('play')) === true;

  const getAuthenticatedContent = () => (
    <div className="flex items-center ">
      <LanguageButton />
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="outline-none hover:text-nx-red inline-flex items-center transition-all justify-center w-full px-4 py-2 font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <span className="hidden md:block">{user?.displayName}</span>
                {user && <Avatar className="md:hidden" user={user} />}
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-nx-red"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute border-nx-red right-0 w-56 mt-2 origin-top-right bg-black divide-y divide-nx-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1">
                  <Menu.Item>
                    <Link to={`/profile/videos/${user?.id}`}>
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <VideoCameraIcon className="text-nx-red w-5 mr-3" />
                          {t('userVideos.seo.ownTitle')}
                        </span>
                      </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={`/profile/collections/${user?.id}`}>
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <CollectionIcon className="text-nx-red w-5 mr-3" />
                          {t('userCollections.seo.ownTitle')}
                        </span>
                      </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={`/profile/courses/${user?.id}`}>
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <BookOpenIcon className="text-nx-red w-5 mr-3" />
                          {t('userCourses.seo.ownTitle')}
                        </span>
                      </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={`/profile/paths/${user?.id}`}>
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <AcademicCapIcon className="text-nx-red w-5 mr-3" />
                          {t('userPaths.seo.ownTitle')}
                        </span>
                      </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={`/profile/subtitles/${user?.id}`}>
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <ViewListIcon className="text-nx-red w-5 mr-3" />
                          {t('userSubtitleImprovement.seo.ownTitle')}
                        </span>
                      </Link>
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    <Link to="/profile">
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <UserIcon className="text-nx-red w-5 mr-3" />
                          {t('userProfile.seo.title')}
                        </span>
                      </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/groups">
                        <span className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm">
                          <UserIcon className="text-nx-red w-5 mr-3" />
                          {t('groupManagement.seo.title')}
                        </span>
                      </Link>
                  </Menu.Item>
                </div>
                <Menu.Item>
                  <span
                    onClick={() => authService.logout()}
                    className="cursor-pointer text-nx-white flex rounded-md items-center w-full px-2 py-2 text-sm"
                  >
                    <LogoutIcon className="text-nx-red w-5 mr-3" />
                    {t('shared.navbar.signOut')}
                  </span>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );

  const getPublicContent = () => (
    <div className="flex items-center">
      <Link to="/auth/register">
        <UserAddIcon className="text-nx-white w-6 md:hidden" />
        <Typography className="hidden md:block" as="span">
          {t('shared.navbar.signUp.0')}
          {' '}
          <Typography bold as="span">
            {t('shared.navbar.signUp.1')}
            .
          </Typography>
        </Typography>
      </Link>
      <LanguageButton />
      <div className="mx-2" />
      <Link to="/auth/login">
        <LoginIcon className="text-nx-white w-6 md:hidden" />
        <OutlineButton className="hidden md:block" as="button">
          {t('shared.navbar.signIn')}
        </OutlineButton>
      </Link>
    </div>
  );

  const getCommonContent = () => (
    <div className="flex items-center flex-row-reverse md:flex-row relative">
      <Link to={isAuthenticated ? '/' : '#'}>
        <Image className="h-10 md:h-12" alt="Polyflix logo" src={logo} />
      </Link>
      <div className="mx-2" />
      <Hamburger onToggle={setIsMenuOpen} />
      <div
        className={cn(
          isMenuOpen ? 'top-nav' : '-top-full',
          'fixed rounded-b-md p-4 md:p-0 bg-black transition-all left-0 w-full md:relative gap-2 md:gap-4 flex flex-col md:flex-row md:w-4/5',
        )}
      >
        {isAuthenticated && (
        <Link to="/">
          <Typography as="span">{t('home.seo.title')}</Typography>
        </Link>
        )}
        {isAuthenticated && (
        <Link to="/courses">
          <Typography as="span">{t('courses.seo.title')}</Typography>
        </Link>
        )}
        {isAuthenticated && (
        <Link to="/paths">
          <Typography as="span">{t('paths.seo.title')}</Typography>
        </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {visible && (
        <motion.nav
          style={{
            height: NAV_HEIGHT,
          }}
          exit={{
            top: isNavbarExited ? -100 : 0,
          }}
          className="w-full flex items-center top-0 transition-all px-4 fixed bg-white dark:bg-black z-40"
        >
          <Container mxAuto fluid className="w-full">
            <div className="flex justify-between items-center w-full border-t-0 border-r-0 border-l-0">
              {getCommonContent()}
              {user ? getAuthenticatedContent() : getPublicContent()}
            </div>
          </Container>
        </motion.nav>
      )}
    </>
  );
};
