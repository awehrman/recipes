import { useEffect, useRef } from 'react';

const useClickOutside = (cb: () => void): React.RefObject<HTMLDivElement> => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        cb();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [cb]);

  return elementRef;
};

export default useClickOutside;
