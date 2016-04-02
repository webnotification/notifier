import React, { PropTypes } from 'react';
import styles from './PermissionAnalyticsPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';
import Griddle from 'griddle-react';


class PermissionAnalyticsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null };
    };
    
    componentDidMount() {
        request.get('/api/analytics/permission').end(function(err, res){
            console.log(JSON.parse(res.text));
            var data = JSON.parse(res.text);
            this.setState({data:data});
        }.bind(this));
    };

    render() {
        if(this.state.data){
            return(
                <Griddle results={this.state.data.permissions} 
                    tableClassName="table" 
                    showFilter={true}
                    showSettings={true} 
                    columns={["group", "timestamp", "accept", "reject"]}
                    resultsPerPage={20} 
                />  
            );
        }
        return <div>Loading...</div>;
    };
}

export default PermissionAnalyticsPage;
