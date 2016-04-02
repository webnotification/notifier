import React, { PropTypes } from 'react';

function withMui(ComposedComponent){
  return class withMui {
    static childContextTypes = {
      muiTheme: PropTypes.object
    }

    render(){
      return <ComposedComponent {...this.props}/>;
    }
  }
}

export default withMui;