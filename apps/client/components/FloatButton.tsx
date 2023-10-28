'use client';

import useFloatButton, {
  toggleFloatButtonAnimation,
  toggleRocketOpacityButtonAnimation,
  toggleRocketPositionButtonAnimation,
  toggleSubMenuAnimation,
} from '@/hooks/useFloatButton';
import {
  EllipsisHorizontalIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  RocketLaunchIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

function calculateScrollPercent() {
  const offset = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const percent = (offset / height) * 100;
  return percent;
}

type Props = {
  onTriggerAsideMenu: () => void;
};

function FloatButton({ onTriggerAsideMenu }: Props) {
  const { percent, setPercent, showSubmenu, setShowSubmenu } = useFloatButton();

  const router = useRouter();

  // float button
  const floatButtonRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // rocket button
  const rocketRef = useRef<HTMLDivElement>(null);
  const isRocketShown = useRef(false);

  // submenu button
  const isSubMenuShown = useRef(false);
  const homeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRocketRef = useRef<HTMLDivElement>(null);
  const showAsideRef = useRef<HTMLDivElement>(null);

  const toggleRocketBasedOnScroll = useCallback((percent: number) => {
    if (percent > 5) {
      if (!isRocketShown.current) {
        isRocketShown.current = true;
        rocketRef.current &&
          toggleRocketPositionButtonAnimation(rocketRef.current, false);
      }
    } else {
      if (isRocketShown.current) {
        isRocketShown.current = false;
        rocketRef.current &&
          toggleRocketPositionButtonAnimation(rocketRef.current, true);
      }
    }
  }, []);

  useEffect(() => {
    const percent = calculateScrollPercent();
    setPercent(percent);
    toggleRocketBasedOnScroll(percent);
  }, [setPercent, toggleRocketBasedOnScroll]);

  const handleScroll = useCallback(() => {
    const percent = calculateScrollPercent();
    setPercent(percent);

    if (isSubMenuShown.current) {
      isSubMenuShown.current = false;
      toggleRocketOpacityButtonAnimation(rocketRef.current!, false);
      toggleSubMenuAnimation(
        {
          homeButton: homeRef.current!,
          searchButton: searchRef.current!,
          menuRocketButton: menuRocketRef.current!,
          showAsideButton: showAsideRef.current!,
        },
        true,
      );
      setShowSubmenu(false);
    }

    toggleRocketBasedOnScroll(percent);

    if (scrollingRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      scrollingRef.current = true;
      floatButtonRef.current &&
        toggleFloatButtonAnimation(floatButtonRef.current, false);
    }

    timeoutRef.current = setTimeout(() => {
      scrollingRef.current = false;
      floatButtonRef.current &&
        toggleFloatButtonAnimation(floatButtonRef.current, true);
    }, 1000);
  }, [setPercent, toggleRocketBasedOnScroll, setShowSubmenu]);

  useEffect(() => {
    console.log('init scroll event');
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleFloatButtonClick = () => {
    if (
      !rocketRef.current ||
      !menuRocketRef.current ||
      !homeRef.current ||
      !searchRef.current ||
      !showAsideRef.current
    ) {
      return;
    }

    if (showSubmenu) {
      // close submenu
      isSubMenuShown.current = false;
      toggleRocketOpacityButtonAnimation(rocketRef.current, false);
      toggleSubMenuAnimation(
        {
          homeButton: homeRef.current,
          searchButton: searchRef.current,
          menuRocketButton: menuRocketRef.current,
          showAsideButton: showAsideRef.current,
        },
        true,
      );
    } else {
      // open submenu
      isSubMenuShown.current = true;
      toggleRocketOpacityButtonAnimation(rocketRef.current, true);
      toggleSubMenuAnimation(
        {
          homeButton: homeRef.current,
          searchButton: searchRef.current,
          menuRocketButton: menuRocketRef.current,
          showAsideButton: showAsideRef.current,
        },
        false,
      );
    }
    setShowSubmenu(!showSubmenu);
  };

  const handleShowMenuClick = () => {
    onTriggerAsideMenu();

    isSubMenuShown.current = false;
    toggleRocketOpacityButtonAnimation(rocketRef.current!, false);
    toggleSubMenuAnimation(
      {
        homeButton: homeRef.current!,
        searchButton: searchRef.current!,
        menuRocketButton: menuRocketRef.current!,
        showAsideButton: showAsideRef.current!,
      },
      true,
    );
    setShowSubmenu(false);
  };

  return (
    <div className="fixed bottom-20 right-16" ref={floatButtonRef}>
      <div
        className="absolute w-12 h-12 flex justify-center items-center cursor-pointer text-label"
        onClick={() => scrollTo(0, 0)}
        ref={rocketRef}
      >
        <RocketLaunchIcon className="w-8 h-8 -rotate-45" />
      </div>

      <div
        title="返回顶部"
        className="absolute w-12 h-12 gradient-bg rounded-full flex justify-center items-center cursor-pointer"
        onClick={() => scrollTo(0, 0)}
        ref={menuRocketRef}
      >
        <div className="bg-background rounded-full w-11 h-11 flex justify-center items-center text-label">
          <RocketLaunchIcon className="w-6 h-6 -rotate-45" />
        </div>
      </div>

      <div
        title="返回首页"
        className="absolute w-12 h-12 gradient-bg rounded-full flex justify-center items-center cursor-pointer"
        onClick={() => router.push('/')}
        ref={homeRef}
      >
        <div className="bg-background rounded-full w-11 h-11 flex justify-center items-center text-label">
          <HomeModernIcon className="w-6 h-6" />
        </div>
      </div>

      <div
        title="打开搜索"
        className="absolute w-12 h-12 gradient-bg rounded-full flex justify-center items-center cursor-pointer"
        ref={searchRef}
      >
        <div className="bg-background rounded-full w-11 h-11 flex justify-center items-center text-label">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </div>
      </div>

      <div
        title="打开菜单"
        className="flex lg:hidden absolute w-12 h-12 gradient-bg rounded-full justify-center items-center cursor-pointer"
        onClick={handleShowMenuClick}
        ref={showAsideRef}
      >
        <div className="bg-background rounded-full w-11 h-11 flex justify-center items-center text-label">
          <NewspaperIcon className="w-6 h-6" />
        </div>
      </div>

      <div
        className="absolute gradient-bg w-12 h-12 rounded-full border-2 border-label text-label cursor-pointer flex items-center justify-center"
        onClick={handleFloatButtonClick}
      >
        {showSubmenu ? (
          <XMarkIcon className="w-8 h-8" />
        ) : percent >= 5 ? (
          <span>{`${Math.floor(percent)}%`}</span>
        ) : (
          <EllipsisHorizontalIcon className="w-8 h-8" />
        )}
      </div>
    </div>
  );
}

export default FloatButton;
