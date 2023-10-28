'use client';

import { ReactNode } from 'react';
import AppHeader from './AppHeader';

type Props = {
  children: ReactNode;
};

function FlowbarLayout({ children }: Props) {
  return (
    <div className="relative">
      <div className="w-screen bg-[url('/images/bg.jpeg')] bg-no-repeat bg-cover bg-center min-h-screen">
        <div className="max-w-7xl mx-auto px-10 pb-20">
          <AppHeader />
        </div>
      </div>
    </div>
  );
}

export default FlowbarLayout;
