import { useState } from 'react';

export const toggleFloatButtonAnimation = (
  floatButton: HTMLDivElement,
  isShow: boolean,
) => {
  const rect = floatButton.getBoundingClientRect();
  // 64 is the right property of the fixed button
  // 12 is the scroll bar width
  const buttonX = rect.left + rect.width / 2 - (window.innerWidth - 64 - 12);

  const animationOptions = {
    duration: 500,
    fill: 'forwards' as const,
    easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
  };

  if (!isShow) {
    floatButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(2.5rem)' },
      ],
      animationOptions,
    );
  } else {
    floatButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(0)' },
      ],
      animationOptions,
    );
  }
};

export const toggleRocketPositionButtonAnimation = (
  rocketButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 500,
    fill: 'forwards' as const,
  };

  if (!isShow) {
    rocketButton.animate(
      [{ transform: `translateY(0)` }, { transform: 'translateY(-4rem)' }],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
      },
    );
  } else {
    rocketButton.animate(
      [{ transform: `translateY(-4rem)` }, { transform: 'translateY(0)' }],
      animationOptions,
    );
  }
};

export const toggleRocketOpacityButtonAnimation = (
  rocketButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 300,
    fill: 'forwards' as const,
  };

  if (isShow) {
    rocketButton.animate([{ opacity: 1 }, { opacity: 0 }], animationOptions);
  } else {
    rocketButton.animate([{ opacity: 0 }, { opacity: 1 }], animationOptions);
  }
};

export const toggleSearchButtonAnimation = (
  searchButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 300,
    fill: 'forwards' as const,
  };

  const rect = searchButton.getBoundingClientRect();
  // 80 is the bottom property of the fixed button
  const buttonY = rect.top - (window.innerHeight - 80);

  if (!isShow) {
    searchButton.animate(
      [
        { transform: `translateY(${buttonY}px)` },
        { transform: 'translateY(-5rem)' },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
      },
    );
  } else {
    searchButton.animate(
      [
        { transform: `translateY(${buttonY}px)` },
        { transform: 'translateY(0)' },
      ],
      animationOptions,
    );
  }
};

export const toggleHomeButtonAnimation = (
  homeButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 300,
    fill: 'forwards' as const,
  };

  const rect = homeButton.getBoundingClientRect();
  const buttonY = rect.top - (window.innerHeight - 80);
  const buttonX = rect.left - (window.innerWidth - 64 - 12);

  if (!isShow) {
    homeButton.animate(
      [
        { transform: `translateY(${buttonY}px) translateX(${buttonX}px)` },
        { transform: 'translateY(-4rem) translateX(-4rem)' },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
      },
    );
  } else {
    homeButton.animate(
      [
        { transform: `translateY(${buttonY}px) translateX(${buttonX}px)` },
        { transform: 'translateY(0) translateX(0)' },
      ],
      animationOptions,
    );
  }
};

export const toggleMenuRocketButtonAnimation = (
  menuRocketButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 300,
    fill: 'forwards' as const,
  };

  const rect = menuRocketButton.getBoundingClientRect();
  const buttonX = rect.left - (window.innerWidth - 64 - 12);

  if (!isShow) {
    menuRocketButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(-5rem)' },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
      },
    );
  } else {
    menuRocketButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(0)' },
      ],
      animationOptions,
    );
  }
};

export const toggleShowAsideButtonAnimation = (
  showAsideButton: HTMLDivElement,
  isShow: boolean,
) => {
  const animationOptions = {
    duration: 300,
    fill: 'forwards' as const,
  };

  const rect = showAsideButton.getBoundingClientRect();
  const buttonX = rect.left - (window.innerWidth - 64 - 12);

  if (!isShow) {
    showAsideButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(-10rem)' },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 2.37)',
      },
    );
  } else {
    showAsideButton.animate(
      [
        { transform: `translateX(${buttonX}px)` },
        { transform: 'translateX(0)' },
      ],
      animationOptions,
    );
  }
};

export const toggleSubMenuAnimation = (
  buttons: {
    searchButton: HTMLDivElement;
    homeButton: HTMLDivElement;
    menuRocketButton: HTMLDivElement;
    showAsideButton: HTMLDivElement;
  },
  show: boolean,
) => {
  toggleSearchButtonAnimation(buttons.searchButton, show);
  toggleHomeButtonAnimation(buttons.homeButton, show);
  toggleMenuRocketButtonAnimation(buttons.menuRocketButton, show);
  toggleShowAsideButtonAnimation(buttons.showAsideButton, show);
};

function useFloatButton() {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [percent, setPercent] = useState(0);

  return {
    percent,
    setPercent,
    showSubmenu,
    setShowSubmenu,
  };
}

export default useFloatButton;
