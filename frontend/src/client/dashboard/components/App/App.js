/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import { CSSTransitionGroup } from 'react-addons-css-transition-group';
import styles from './App.styl';
import withContext from '../../../decorators/withContext';
import withStyles from '../../../decorators/withStyles';

import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

import { RouteHandler } from 'react-router';
import Router from 'react-router';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

@withContext
@withStyles(styles)
class App extends React.Component {
	static propTypes = {
		error: PropTypes.object
	};

	static childContextTypes = {
		router: React.PropTypes.func,
		routeDepth: React.PropTypes.number,
		muiTheme: React.PropTypes.object
	};

	getChildContext() {
		return {
			 muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
		};
	};

	render() {
		let key = this.props.pathname;

		return !this.props.error ? (
			<div className='app-container'>
				<Header/>
                <Sidebar/>
				<div className='app-content'>
					<RouteHandler/>
				</div>
				<Footer />
			</div>
		) : <RouteHandler/> || this.props.children ;
	};
}

export default App;
