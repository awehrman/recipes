import React, { useCallback, useLayoutEffect } from 'react';

type ThemeProps = {
  sizes: {
    tablet: string;
  };
};

type ButtonProps = {
  isExpanded: boolean;
  navRef: React.MutableRefObject<HTMLElement | null>;
  navIconRef: React.MutableRefObject<HTMLButtonElement | null>;
  setIsExpanded: (_value: boolean) => void;
  themeContext: ThemeProps;
};

type HookProps = {
  handleNavigationToggle: (e: React.MouseEvent) => void;
};

const useNavigationButton = ({
  isExpanded,
  navRef,
  navIconRef,
  setIsExpanded,
  themeContext
}: ButtonProps): HookProps => {
  const {
    sizes: { tablet }
  } = themeContext;
  const tabletSize = parseInt(tablet, 10);

  const navRefCurrent = navRef.current;

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      // enable event listeners if we're in at least tablet size
      if (window.innerWidth > tabletSize) {
        const yPosition = e.clientY - 20 < 0 ? 20 : e.clientY - 10;

        // move the menu icon to where ever our cursor is
        if (navIconRef?.current) {
          navIconRef.current.style.top = `${yPosition}px`;
        }

        // keep updating this anytime we move our mouse around the nav
        if (navRefCurrent) {
          navRefCurrent.addEventListener('mousemove', handleMouseOver);
        }
      }
    },
    [navIconRef, navRefCurrent, tabletSize]
  );

  const handleMouseLeave = useCallback(() => {
    // cleanup this event if we're not in the nav
    if (navRefCurrent) {
      navRefCurrent.removeEventListener('mousemove', handleMouseOver);
    }

    // if we're in mobile, make sure we put our menu icon back at the top
    if (navIconRef?.current && window.innerWidth > tabletSize) {
      navIconRef.current.style.top = '20px';
    }
  }, [handleMouseOver, navRefCurrent, navIconRef, tabletSize]);

  useLayoutEffect(() => {
    if (navRefCurrent) {
      navRefCurrent.addEventListener('mouseover', handleMouseOver);
      navRefCurrent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (navRefCurrent) {
        navRefCurrent.removeEventListener('mouseover', handleMouseOver);
        navRefCurrent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseOver, handleMouseLeave, navRefCurrent]);

  function handleNavigationToggle(e: React.MouseEvent) {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  }

  return {
    handleNavigationToggle
  };
};

export default useNavigationButton;
