import Link from 'next/link';
import React, { useContext, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { lighten } from 'polished';
import { signOut } from 'next-auth/react';

import Button from './common/button';
import NavigationIcon from 'public/icons/ellipsis-v-regular.svg';
import HomeIcon from 'public/icons/home-solid.svg';
import CloudDownloadIcon from 'public/icons/cloud-download-alt-solid.svg';
import LemonIcon from 'public/icons/lemon-solid.svg';
import FolderIcon from 'public/icons/folder-open-solid.svg';
import GearsIcon from 'public/icons/parser.svg';
import useNavigationButton from '../hooks/use-navigation-button';

type NavProps = {
  isExpanded: boolean;
  setIsExpanded: (_value: boolean) => void;
};

type IconProps = {
  icon: JSX.Element;
  label: string;
};

type LinkProp = {
  href: string;
  label: string;
  icon: JSX.Element;
};

const links: LinkProp[] = [
  { href: '/', label: 'Home', icon: <HomeIcon /> },
  { href: '/import', label: 'Import', icon: <CloudDownloadIcon /> },
  { href: '/ingredients', label: 'Ingredients', icon: <LemonIcon /> },
  { href: '/recipes', label: 'Recipes', icon: <FolderIcon /> },
  { href: '/parser', label: 'Parser', icon: <GearsIcon /> }
];

const Navigation: React.FC<NavProps> = ({ isExpanded, setIsExpanded }) => {
  const themeContext = useContext(ThemeContext);
  const navRef = useRef<HTMLElement | null>(null);
  const navIconRef = useRef<HTMLButtonElement | null>(null);
  const { handleNavigationToggle } = useNavigationButton({
    isExpanded,
    navRef,
    navIconRef,
    setIsExpanded,
    themeContext
  });

  const IconAndLabel = ({ icon, label }: IconProps): JSX.Element => (
    <>
      {icon}
      {label}
    </>
  );

  function renderLinks() {
    const linkElements = links.map((link) => (
      <li key={link.label}>
        <Link href={link.href} shallow>
          <IconAndLabel icon={link.icon} label={link.label} />
        </Link>
      </li>
    ));

    return <ul>{linkElements}</ul>;
  }

  return (
    <NavStyles ref={navRef} isExpanded={isExpanded} theme={themeContext}>
      <NavigationButton
        ref={navIconRef}
        icon={<NavigationIcon />}
        onClick={handleNavigationToggle}
      />

      {renderLinks()}

      <SignOut label="Sign Out" onClick={() => signOut()} />
    </NavStyles>
  );
};

export default Navigation;

type NavStylesProps = {
  ref: React.MutableRefObject<HTMLElement | null>;
  isExpanded: boolean;
};

type NavigationButtonProps = {
  ref: React.MutableRefObject<HTMLButtonElement | null>;
};

const NavStyles = styled.nav<NavStylesProps>`
  /* mobile top nav */
  background: ${({ theme }) => theme.colors.menuBackground};
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /* we want this higher than the nprogress bar */

  ul {
    display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
    list-style-type: none;
    padding: 0;
    margin: 20px;
    margin-bottom: 60px;

    li {
      margin: 20px 0;

      &:first-of-type {
        margin-top: 0;
      }

      a {
        font-family: var(--font-sourceSansPro), Verdana, sans-serif;
        border: 0;
        background: transparent;
        cursor: pointer;
        text-decoration: none;
        color: ${({ theme }) => theme.colors.menuColor};
        font-size: 1em;
        font-weight: 400;
        padding: 6px;

        &:hover {
          color: ${({ theme }) => lighten(0.1, theme.colors.menuColor)};
        }

        svg {
          margin-right: 20px;
          height: 14px;
        }
      }
    }
  }

  /* tablet and larger moves the nav to the left */
  @media (min-width: ${({ theme }) => theme.sizes.tablet}) {
    width: ${({ theme }) => theme.sizes.menuWidth};
    left: -${({ isExpanded, theme }) => (isExpanded ? '0px' : theme.sizes.menuOffset)};
    bottom: 0;
    transition: 0.2s ease-out;
  }
`;

const SignOut = styled(Button)`
  display: flex;
  margin: 10px auto;
  border: 0;
  color: ${({ theme }) => theme.colors.altGreen};
  font-weight: bold;
  background: transparent;
  cursor: pointer;

  @media (min-width: ${({ theme }) => theme.sizes.tablet}) {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const NavigationButton = styled(Button)<NavigationButtonProps>`
  top: 20px;
  color: ${({ theme }) => theme.colors.menuColor};
  cursor: pointer;
  display: block;
  padding: 10px;
  text-align: left;
  margin-right: 10px;
  float: right;
  border: 0;
  background: transparent;
  font-size: 1em;

  svg {
    height: 16px !important;
  }

  &:hover {
    color: ${({ theme }) => lighten(0.1, theme.colors.menuColor)};
  }

  @media (min-width: ${({ theme }) => theme.sizes.tablet}) {
    position: relative;
    width: 40px;
    text-align: center;
    margin: 0 auto;
    margin-right: 0;

    &:focus {
      outline-width: 0;
      color: ${({ theme }) => theme.colors.highlight};
    }
  }
`;
