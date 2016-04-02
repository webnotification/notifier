import React, { PropTypes } from 'react';
import styles from './ViewGroupsPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';
import {List, ListItem, Paper} from 'material-ui';

class ViewGroupsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { website: "", groups: [] };
    };
    
    componentDidMount() {
        request.get('/api/group/list').end(function(err, res){
            console.log(JSON.parse(res.text));
            var data = JSON.parse(res.text);
            this.setState({website: data.website, groups: data.groups});
        }.bind(this));
    };

    render() {
        return(
            <div>
                <h3> Groups </h3>
                <List>
                    {this.state.groups.map(group => <ListItem>{group.name}</ListItem>)}
                </List>
            </div>
        );
    };
}

export default ViewGroupsPage;
