import React, {PropTypes} from 'react';
import withStyles from '../../../decorators/withStyles';
import styles from './HomePage.styl';

// import backdrop_url from './bg.jpg';
import {RaisedButton, FontIcon} from 'material-ui';

@withStyles(styles)
class HomePage extends React.Component {
  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  render(){
    return (
      <div className='HomePage'>
        <div className='main-backdrop'>
          <div className="demo-button-wrap">
          </div>
        </div>
      </div>
    )
  };
}

export default HomePage;
