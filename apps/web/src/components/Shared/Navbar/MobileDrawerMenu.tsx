import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import {
  CheckCircleIcon,
  CogIcon,
  EmojiHappyIcon,
  HandIcon,
  LogoutIcon,
  MoonIcon,
  ShieldCheckIcon,
  SunIcon,
  SupportIcon,
  SwitchHorizontalIcon,
  UserIcon,
  XIcon
} from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import resetAuthData from '@lib/resetAuthData';
import { Trans } from '@lingui/macro';
import { APP_VERSION } from 'data/constants';
import type { Profile } from 'lens';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE, SYSTEM } from 'src/tracking';
import { useDisconnect } from 'wagmi';

import Slug from '../Slug';

const MobileDrawerMenu = () => {
  const router = useRouter();
  const profiles = useAppStore((state) => state.profiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowMobileDrawerMenu = useAppStore((state) => state.setShowMobileDrawerMenu);
  const showMobileDrawerMenu = useAppStore((state) => state.showMobileDrawerMenu);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);

  const { theme, setTheme } = useTheme();
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();

  const statusEmoji = getAttribute(currentProfile?.attributes, 'statusEmoji');
  const statusMessage = getAttribute(currentProfile?.attributes, 'statusMessage');
  const hasStatus = statusEmoji && statusMessage;

  if (!showMobileDrawerMenu) {
    return null;
  }

  const toggleMenu = () => {
    setShowMobileDrawerMenu(false);
  };

  const logout = () => {
    Analytics.track(PROFILE.LOGOUT);
    disconnectXmtp();
    setCurrentProfile(null);
    setProfileId(null);
    resetAuthData();
    disconnect?.();
    setShowMobileDrawerMenu(false);
    router.push('/');
  };

  return (
    <div className="w-full z-[10] bottom-0 top-0 h-full bg-gray-100 dark:bg-black py-4 md:hidden fixed">
      <button className="visible md:hidden px-5" type="button" onClick={toggleMenu}>
        <XIcon className="w-6 h-6" />
      </button>
      <div className="w-full py-4 space-y-4">
        <Link
          href={`/u/${formatHandle(currentProfile?.handle)}`}
          className="flex px-5 space-x-2 items-center"
        >
          <img
            src={getAvatar(currentProfile as Profile)}
            className="w-12 h-12 rounded-full border cursor-pointer dark:border-gray-700"
            alt={formatHandle(currentProfile?.handle)}
          />
          <div>
            <div>
              <Trans>Logged in as</Trans>
            </div>
            <div className="truncate">
              <Slug className="font-bold" slug={formatHandle(currentProfile?.handle)} prefix="@" />
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <button type="button" className="py-4 px-5 w-full" onClick={() => setShowStatusModal(true)}>
            <div className="flex items-center space-x-2">
              {hasStatus ? (
                <>
                  <span>{statusEmoji}</span>
                  <span className="truncate">{statusMessage}</span>
                </>
              ) : (
                <>
                  <EmojiHappyIcon className="w-5 h-5" />
                  <span>
                    <Trans>Set status</Trans>
                  </span>
                </>
              )}
            </div>
          </button>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="mx-5 my-2">
            <Link
              href={`/u/${formatHandle(currentProfile?.handle)}`}
              className="flex items-center py-4 space-x-1.5"
              onClick={() => setShowMobileDrawerMenu(false)}
            >
              <UserIcon className="w-5 h-5" />
              <div>
                <Trans>Your Profile</Trans>
              </div>
            </Link>
            <Link
              href="/settings"
              className="flex items-center py-4 space-x-1.5"
              onClick={() => setShowMobileDrawerMenu(false)}
            >
              <CogIcon className="w-5 h-5" />
              <div>
                <Trans>Settings</Trans>
              </div>
            </Link>
            {isGardener(currentProfile?.id) && (
              <Link
                href="/mod"
                className="flex items-center py-4 space-x-1.5"
                onClick={() => setShowMobileDrawerMenu(false)}
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <div>
                  <Trans>Moderation</Trans>
                </div>
              </Link>
            )}
            <button
              type="button"
              className="w-full"
              onClick={() => {
                setTheme(theme === 'light' ? 'dark' : 'light');
                Analytics.track(theme === 'light' ? SYSTEM.SWITCH_DARK_THEME : SYSTEM.SWITCH_LIGHT_THEME);
                setShowMobileDrawerMenu(false);
              }}
            >
              <div className="flex items-center space-x-1.5 py-4">
                {theme === 'light' ? (
                  <>
                    <MoonIcon className="w-5 h-5" />
                    <div>
                      <Trans>Dark mode</Trans>
                    </div>
                  </>
                ) : (
                  <>
                    <SunIcon className="w-5 h-5" />
                    <div>
                      <Trans>Light mode</Trans>
                    </div>
                  </>
                )}
              </div>
            </button>
            <div className="flex flex-col py-4">
              <div className="flex items-center space-x-1.5">
                <SwitchHorizontalIcon className="w-4 h-4" />
                <div>
                  <Trans>Switch to</Trans>
                </div>
              </div>
              <div className="pt-3 px-4">
                {profiles.map((profile: Profile, index) => (
                  <div
                    key={profile?.id}
                    className="block w-full text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                  >
                    <button
                      type="button"
                      className="flex items-center py-1 space-x-2 w-full rounded-lg dark:hover:bg-gray-800"
                      onClick={() => {
                        const selectedProfile = profiles[index];
                        setCurrentProfile(selectedProfile);
                        setProfileId(selectedProfile.id);
                        Analytics.track(PROFILE.SWITCH_PROFILE);
                      }}
                    >
                      <span className="flex items-center py-1 space-x-2 w-full rounded-lg dark:hover:bg-gray-800">
                        <img
                          className="w-5 h-5 rounded-full border dark:border-gray-700"
                          height={20}
                          width={20}
                          src={getAvatar(profile)}
                          alt={formatHandle(profile?.handle)}
                        />
                        <div className="truncate">{formatHandle(profile?.handle)}</div>
                      </span>
                      {currentProfile?.id === profile?.id && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="mx-5 my-2">
            <Link
              href="/contact"
              className="flex items-center py-4 space-x-1.5"
              onClick={() => setShowMobileDrawerMenu(false)}
            >
              <SupportIcon className="w-5 h-5" />
              <div>
                <Trans>Contact</Trans>
              </div>
            </Link>
            <Link
              href="https://github.com/lensterxyz/lenster/issues/new?assignees=bigint&labels=needs+review&template=bug_report.yml"
              target="_blank"
              className="flex items-center space-x-1.5 py-4"
              onClick={() => setShowMobileDrawerMenu(false)}
            >
              <HandIcon className="w-5 h-5" />
              <div>
                <Trans>Report a bug</Trans>
              </div>
            </Link>
          </div>
          <div className="divider" />
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <button type="button" onClick={logout} className="p-5 w-full">
            <div className="flex items-center space-x-1.5">
              <LogoutIcon className="w-4 h-4" />
              <div>
                <Trans>Logout</Trans>
              </div>
            </div>
          </button>
          <div className="divider" />
        </div>

        {currentProfile && (
          <div className="py-2 px-5 text-sm opacity-60">
            <Link
              href={`https://github.com/lensterxyz/lenster/releases/tag/v${APP_VERSION}`}
              className="font-mono"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setShowMobileDrawerMenu(false)}
            >
              v{APP_VERSION}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
