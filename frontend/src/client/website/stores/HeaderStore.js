import alt            from '../alt';
import HeaderActions  from '../actions/HeaderActions';
import SidebarActions from '../actions/SidebarActions';

class HeaderStore {
	constructor(){
    this.bindActions(HeaderActions);

    this.title = 'Notification';
		this.rightIcon= 'muidocs-icon-custom-github';
    this.sidebarHidden = true;
	}
  toggleSidebar(val){
    console.log('Toggline: ', val);
  }
}

export default alt.createStore(HeaderStore, 'HeaderStore');
