import { useState } from 'react';

function useCategory() {
  const [isLoading, setIsLoading] = useState(false);

  const search = () => {
    console.log('search');
  };

  return {
    search,
    isLoading,
    setIsLoading,
  };
}

export default useCategory;
