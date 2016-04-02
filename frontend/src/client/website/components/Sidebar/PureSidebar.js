import React from 'react';

import mui         from 'material-ui';
import {LeftNav}   from 'material-ui';

import { SubheaderMenuItem, LinkMenuItem } from 'material-ui/lib/menu/index';

// New Menus need to be required like this
import MenuItem  from  'material-ui/lib/menus/menu-item';


let menuItems = [
  { route: 'home', text: 'Home' },
  { route: 'about', text: 'About' },
  { route: 'profile', text: 'Profile' },
  {
     type: SubheaderMenuItem,
     payload: 'https://github.com/callemall/material-ui',
     text: 'GitHub'
  },
  {
     text: 'Disabled',
     disabled: true
  },
  {
     type: LinkMenuItem,
     payload: 'https://www.google.com',
     text: 'Disabled Link',
     disabled: true
  },
];


class Sidebar extends React.Component{
  render(){
    console.log('S-State: ', this.state);
    console.log('S-Props: ', this.props);
    return (
      <LeftNav
        docked={this.props.isDocked}
        menuItems={menuItems} />
    );
  };
}

export default Sidebar;
