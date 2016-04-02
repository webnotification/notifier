import React, { PropTypes } from 'react';
import styles from './LoginPage.styl';
import withStyles from '../../../decorators/withStyles';
import request from 'superagent';
import {Link} from 'react-router'

import router from '../../router';


import {
  Paper,
  TextField,
  FontIcon,
  RaisedButton,
  CircularProgress,
  FlatButton
} from 'material-ui';

@withStyles(styles)
class LoginPage extends React.Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  state = {
    loading: false,
    error: false
  };

  post_login(err, res){
    this.setState({
      error: err ? err.message : false,
      loading: false
    });

    if (!err){
      let result = res.body.data
      window.location = result.redirect_url;
      // router.transitionTo(result.redirect_url, {
      //   user: result.user
      // });
    };
  }

  submit_login(){
    this.setState({loading: true});
    let params = this.props.query;
    let param_str = '';
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        param_str += encodeURIComponent(p) + "=" + encodeURIComponent(params[p]) + "&";
      }
    }
    let url = '/login?' + param_str;
    request
      .post(url)
      .accept('json')
      .send({
        username: this.refs.username.getValue(),
        password: this.refs.password.getValue()
      })
      .end(this.post_login.bind(this));
  }

  render() {
    let title = 'Log In';
    this.context.onSetTitle(title);

    let loginButton = (
      this.state.loading
      ? <CircularProgress className='form-loading' mode='indeterminate'/>
      : <RaisedButton ref='submit' className='form-button' label='Submit' secondary={true} onClick={this.submit_login.bind(this)}/>
    );

    let banner = (
      this.state.error
      ? <pre className='form-banner banner-error'> {this.state.error} </pre>
      : null
    );

    return (
      <div className="LoginPage">
        <Paper className="LoginPage-container form-container">
          { banner }
          <TextField ref='username' className='form-field login-email' hintText='username' floatingLabelText='Username'/>
          <TextField ref='password' className='form-field login-password' hintText='Password' floatingLabelText='Password' type='password'/>
          {loginButton}
          <Link className='link-register' to='register'> Register </Link>
        </Paper>
      </div>
    );
  }

}

export default LoginPage;
