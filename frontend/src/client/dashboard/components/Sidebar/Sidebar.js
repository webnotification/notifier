import React from 'react';
import PureSidebar from './PureSidebar';
import withStyles from '../../../decorators/withStyles';
import styles from './Sidebar.styl';

@withStyles(styles)
class Sidebar extends React.Component {
	render() {
        return (
            <PureSidebar/>
        );
	}
}

export default Sidebar;
