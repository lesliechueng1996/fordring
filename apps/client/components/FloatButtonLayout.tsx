'use client';

import { ReactNode, useEffect, useRef } from 'react';
import FloatButton from './FloatButton';

type Props = {
  children: ReactNode;
  aside: ReactNode;
};

function triggerMainAnimation(mainElement: HTMLDivElement, isShow: boolean) {
  const animationOptions = {
    duration: 500,
    fill: 'forwards' as const,
  };

  if (!isShow) {
    mainElement.animate(
      [
        { transform: 'translateY(0) translateX(0)', borderRadius: '0' },
        {
          transform: 'translateY(3rem) translateX(18rem)',
          borderRadius: '1rem',
        },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 1.37)',
      },
    );
  } else {
    mainElement.animate(
      [
        {
          transform: 'translateY(3rem) translateX(18rem)',
          borderRadius: '1rem',
        },
        { transform: 'translateY(0) translateX(0)', borderRadius: '0' },
      ],
      animationOptions,
    );
  }
}

function triggerAsideAnimation(asideElement: HTMLDivElement, isShow: boolean) {
  const animationOptions = {
    duration: 500,
    fill: 'forwards' as const,
  };

  if (!isShow) {
    asideElement.animate(
      [
        { transform: 'translateY(-100%)', opacity: 0 },
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
      ],
      {
        ...animationOptions,
        easing: 'cubic-bezier(0.42, 0, 0.48, 1.37)',
      },
    );
  } else {
    asideElement.animate(
      [
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
        { transform: 'translateY(-100%)', opacity: 0 },
      ],
      animationOptions,
    );
  }
}

function FloatButtonLayout({ children, aside }: Props) {
  const isAsideMenuShown = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  const handleTriggerAsideMenu = () => {
    if (isAsideMenuShown.current) {
      // close
      triggerMainAnimation(mainRef.current!, true);
      triggerAsideAnimation(asideRef.current!, true);
    } else {
      // open
      triggerMainAnimation(mainRef.current!, false);
      triggerAsideAnimation(asideRef.current!, false);
    }
    isAsideMenuShown.current = !isAsideMenuShown.current;
  };

  useEffect(() => {
    const handleWindowResize = (e: UIEvent) => {
      // tailwindcss large size
      if (window.innerWidth >= 1024) {
        if (isAsideMenuShown.current) {
          triggerMainAnimation(mainRef.current!, true);
          triggerAsideAnimation(asideRef.current!, true);
          isAsideMenuShown.current = false;
        }
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="w-screen bg-[url('/images/bg.jpeg')] bg-no-repeat bg-cover bg-center min-h-screen"
        ref={mainRef}
      >
        <div className="max-w-7xl mx-auto px-10 pb-20">{children}</div>
      </div>

      <div
        className="absolute top-0 left-0 w-72 pt-12 -translate-y-full opacity-0"
        ref={asideRef}
      >
        {aside}
      </div>

      <FloatButton onTriggerAsideMenu={handleTriggerAsideMenu} />
    </div>
  );
}

export default FloatButtonLayout;
