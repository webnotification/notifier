/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './Footer.styl';
import withViewport from '../../../decorators/withViewport';
import withStyles from '../../../decorators/withStyles';
import { Link } from 'react-router';

@withViewport
@withStyles(styles)
class Footer extends React.Component {

  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    // This is just an example how one can render CSS
    let { width, height } = this.props.viewport;
    this.renderCss(`.Footer-viewport:after {content:' ${width}x${height}';}`);

    return (
      <div className="Footer">
        <div className="Footer-container">
          <span className="Footer-text">© Your Company</span>
          <span className="Footer-spacer">·</span>
          <Link to="/" className='Footer-link'> Home </Link>
          <span className="Footer-spacer">·</span>
          <Link to="/about" className='Footer-link'> Privacy </Link>
          <span className="Footer-spacer">·</span>
          <Link to="/contact" className='Footer-link'> NotFound </Link>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">Viewport:</span>
        </div>
      </div>
    );
  };

}

export default Footer;
