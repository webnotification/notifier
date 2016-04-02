import React from 'react';

import withStyles from '../../../decorators/withStyles';
import styles from './Header.styl';

import {AppBar, Styles} from 'material-ui';
import Navigation from '../Navigation';

import logo from './logo-small@2x.png';
import { Link } from 'react-router';


@withStyles(styles)
class Header extends React.Component {
  render(){
    return (
      <header className='Header'>
        <AppBar>
          <Link to='home' className='Header-Title'>
            {<img title='Notification' src={logo}/>}
          </Link>
          <div className='Header-spacer'/>
          <Navigation className='Header-Navigation'/>
          {
            this.props.user
            ? <p> Logged In As: {this.props.user.name} </p>
            : null
          }
        </AppBar>
      </header>
    )
  };
}

export default Header;
