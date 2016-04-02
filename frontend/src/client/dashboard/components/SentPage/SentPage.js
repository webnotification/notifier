import React, { PropTypes } from 'react';
import styles from './SentPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';
import {RaisedButton} from 'material-ui';

//@withStyles(styles)
class SentPage extends React.Component {
    constructor(props) {
        super(props);
    };
    
    componentDidMount() {
    };

    render() {
        return (
          <div className="SentPage">
                <h3>{this.props.info_message}</h3>
                <RaisedButton label={this.props.redirect_message} 
                              secondary={true} 
                              onMouseDown={this.props.handleSendAnother}/>
          </div>
        );
    }
}

export default SentPage;
