import React, { PropTypes } from 'react';
import styles from './ProfilePage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';


//@withStyles(styles)
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: null };
    };
    
    componentDidMount() {
        request.get('/api/user/details').end(function(err, res){
            var user = JSON.parse(res.text).result;
            this.setState({user: user});
        }.bind(this));
    };

    render() {
        var user = this.state.user;
        if(user){
            return (
              <div className="ProfilePage">
                <h2> Profile </h2>
                <h5><strong>username</strong>: {user.username}</h5>
                <h5><strong>website</strong>: {user.website} </h5>
              </div>
            );
        }
        return <div>Loading...</div>;
    }
}

export default ProfilePage;
