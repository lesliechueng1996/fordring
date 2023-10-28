'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

function ThemeButton() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = (isDark: boolean) => () => {
    // TODO change mode
    setIsDarkMode(isDark);
  };

  return (
    <>
      {isDarkMode ? (
        <MoonIcon className="w-6 h-6" onClick={toggleDarkMode(false)} />
      ) : (
        <SunIcon className="w-6 h-6" onClick={toggleDarkMode(true)} />
      )}
    </>
  );
}

export default ThemeButton;
