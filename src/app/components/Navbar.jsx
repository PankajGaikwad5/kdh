'use client';
import React, { useState } from 'react';
import { Menu, MenuItem, HoveredLink } from '../../components/ui/navbar-menu'; // Adjust path if needed

const Navbar = () => {
  const [active, setActive] = useState(null);

  return (
    <div className='fixed top-0 bg-transparent left-1/2 transform -translate-x-1/2 z-50'>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item='Home' href={'/'}>
          <HoveredLink href='/'>Go to Home</HoveredLink>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item='Products'
          href={'/products'}
        >
          <HoveredLink href='/products'>View Projects</HoveredLink>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item='About'
          href={'/about'}
        >
          <HoveredLink href='/about'>About Us</HoveredLink>
        </MenuItem>

        <MenuItem
          setActive={setActive}
          active={active}
          item='Contact'
          href={'/contact'}
        >
          <HoveredLink href='/contact'>Contact Us</HoveredLink>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Navbar;
