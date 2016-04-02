import React from 'react';
import {LeftNav}   from 'material-ui';
import { Link } from 'react-router';
import {ListItem, FlatButton}  from  'material-ui';


class Sidebar extends React.Component{
  render(){
    return (
      <LeftNav docked={this.props.isDocked} className="sidebar">
        <ListItem primaryText="Permission Request" containerElement={<Link to="/dashboard/permission/send" />} />
        <ListItem primaryText="Notification" containerElement={<Link to="/dashboard/notification/send" />} />
        <ListItem primaryText="Notification Image" containerElement={<Link to="/dashboard/image" />} />
        <ListItem
            primaryText="Groups"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem primaryText="Create" containerElement={<Link to="/dashboard/groups/create" />} />,
              <ListItem primaryText="View"   containerElement={<Link to="/dashboard/groups/view" />} />,
            ]}
          />
        <ListItem
            primaryText="Analytics"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem primaryText="Permission" containerElement={<Link to="/dashboard/analytics/permission" />} />,
              <ListItem primaryText="Notification" containerElement={<Link to="/dashboard/analytics/notification" />} />,
            ]}
          />
      </LeftNav>
    );
  };
}

export default Sidebar;
