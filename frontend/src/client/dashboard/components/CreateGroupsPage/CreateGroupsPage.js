import React, { PropTypes } from 'react';
import styles from './CreateGroupsPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'
import router from '../../router';
import {Paper, TextField, RaisedButton, SelectField, MenuItem, Snackbar} from 'material-ui';
import SentPage from './../SentPage/SentPage'

@withStyles(styles)
class CreateGroupsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { website: "", snackbar_open: false, group_status: "", created: false };
    };
    
    componentDidMount() {
        request.get('/api/user/details').end(function(err, res){
            var data = JSON.parse(res.text).result;
            this.setState({website: data.website});
        }.bind(this));
    };
    
    handleStatus(err, res){
        if(!err && JSON.parse(res.text).success === true )
            this.setState({created: true});
        else if(!err && JSON.parse(res.text).error === 'IntegrityError' )
            this.setState({group_status: 'Group name already exists', snackbar_open: true});
        else
            this.setState({group_status: 'An error occured while creating Group', snackbar_open: true});
    };
    
    handleSend(){
        request.post('/api/group/create')
            .set('Content-Type', 'application/json')
            .send({ website: this.state.website, 
                    group_name: this.refs.group_name.getValue(), 
                    percentage: this.refs.percentage.getValue()
            })
            .end(this.handleStatus.bind(this));
    };

    handleSendAnother(){
        this.setState({created: false});
    };

    handleRequestClose(){
        this.setState({snackbar_open: false});
    };

    render() {
        if(this.state.created === false){
            return( 
                <div>
                    <h2> Create Group </h2>
                    <TextField ref="group_name" hintText="Group Name" />
                    <br/>
                    <TextField ref="percentage" hintText="Percentage" />
                    <br/>
                    <RaisedButton label="Send" secondary={true} onMouseDown={this.handleSend.bind(this)}/>
                    <Snackbar
                      open={this.state.snackbar_open}
                      message={this.state.group_status}
                      autoHideDuration={2000}
                      onRequestClose={this.handleRequestClose.bind(this)}
                    />
                </div>
            );
        }
        else{
            let info_message = 'Group successfully created.';
            let redirect_message = 'Create Another Group';
            return(
                    <SentPage info_message={info_message} 
                              redirect_message={redirect_message} 
                              handleSendAnother={this.handleSendAnother.bind(this)} 
                              />
            );
        }
    };
}

export default CreateGroupsPage;
