import { useEffect, useRef, useState } from 'react';

type UseClickOutsideProps<T extends HTMLInputElement> = {
  inputRef: React.RefObject<T>;
}

// TODO rename or separate out visibility logic
const useClickOutside = <T extends HTMLInputElement>(cb: () => void): UseClickOutsideProps<T> => {
  const inputRef = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isAddNewButton = (event.target as HTMLElement).id === 'add-new-keyword-button';
      if (!isAddNewButton && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return { inputRef };
};

export default useClickOutside;