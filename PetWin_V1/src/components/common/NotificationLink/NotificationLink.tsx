import Eye from '@petwin/icons/eye';
import NotificationRing from '@petwin/icons/notificationRing';
import Link from 'next/link';
import styles from '../Header/header.module.scss';
import cn from 'classnames';
import { NotificationLinkProps } from './NotificationLinkProps.props';

function NotificationLink({
  openNotificationMenu,
  toggleNotificationMenu,
}: NotificationLinkProps) {
  return (
    <li className={cn(styles.RightNavItem, styles.Notification, 'group')}>
      <div onClick={toggleNotificationMenu} className="cursor-pointer">
        <NotificationRing />
      </div>
      <div
        className={cn(
          openNotificationMenu
            ? styles.NotificationPopupActive
            : styles.NotificationPopup
        )}
      >
        <div className="text-gray-700 pt-1">
          <div
            id="dropdownNotification"
            className={cn(
              styles.NotificationPopup,
              'z-20 w-full max-w-sm bg-white rounded-lg shadow dark:bg-gray-800'
            )}
          >
            <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-[#ed6639] dark:bg-[#ed6639] dark:text-white">
              Notifications
            </div>
            <div>
              <a href="" className="flex p-2 no-underline">
                <div className="w-full pl-3">
                  <div className="no-underline text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                    New notification
                  </div>
                  <div className="no-underline text-xs text-[#ed6639] dark:text-[#ed6639]">
                    a few moments ago
                  </div>
                </div>
              </a>
            </div>
            <Link
              href="/profile#notifications"
              className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-[#ed6639] dark:bg-[#ed6639] dark:text-white"
            >
              <div className="inline-flex items-center ">
                <Eye />
                View all
              </div>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export default NotificationLink;
