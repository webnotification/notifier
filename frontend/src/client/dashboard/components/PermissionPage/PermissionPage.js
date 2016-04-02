import React, { PropTypes } from 'react';
import styles from './PermissionPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';
import {Paper, TextField, RaisedButton, SelectField, MenuItem, Snackbar} from 'material-ui';
import SentPage from './../SentPage/SentPage'

@withStyles(styles)
class PermissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { website: "", 
                       groups: [], 
                       selected_group_id: 0,
                       permission_status: "",
                       snackbar_open: false,
                       permission_sent: false
        };
    };
    
    componentDidMount() {
        request.get('/api/group/list').end(function(err, res){
            var data = JSON.parse(res.text);
            this.setState({website: data.website, groups: data.groups, selected_group_id: data.groups[0].id});
        }.bind(this));
    };
    
    handleChange(event, index, value){
        this.setState({selected_group_id: value}); 
    };
    
    handleStatus(err, res){
        if(!err && JSON.parse(res.text).success === true )
            this.setState({permission_sent: true});
        else
            this.setState({permission_status: 'An error occured while sending Permission Request', snackbar_open: true});
    };
    
    handleSend(){
        request.post('/api/permission/send')
            .set('Content-Type', 'application/json')
            .send({website: this.state.website, group_id: this.state.selected_group_id})
            .end(this.handleStatus.bind(this));
    };

    handleSendAnother(){
        this.setState({permission_sent: false});
    };

    handleRequestClose(){
        this.setState({snackbar_open: false});
    };

    render() {
        if(this.state.permission_sent === false){
            return(
                <div>
                    <h2> Send Permission Request </h2>
                    <div> Group: </div>
                    <SelectField value={this.state.selected_group_id} onChange={this.handleChange.bind(this)}>
                        {this.state.groups.map(
                             group => (<MenuItem key={group.id} value={group.id} primaryText={group.name}> </MenuItem>)
                        )}
                    </SelectField>
                    <br/>
                    <RaisedButton label="Send" secondary={true} onMouseDown={this.handleSend.bind(this)}/>
                    <br/>
                    <Snackbar
                      open={this.state.snackbar_open}
                      message={this.state.permission_status}
                      autoHideDuration={2000}
                      onRequestClose={this.handleRequestClose.bind(this)}
                    />
                </div>
            );
        }
        else{
            let info_message = 'Permission Request successfully sent.';
            let redirect_message = 'Send another Permission Request';
            return(
                    <SentPage info_message={info_message} 
                              redirect_message={redirect_message} 
                              handleSendAnother={this.handleSendAnother.bind(this)} 
                              />
            );
        }
    };
}

export default PermissionPage;
