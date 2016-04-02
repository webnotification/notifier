import alt from '../alt';
import SidebarActions from '../actions/SidebarActions';
import HeaderActions  from '../actions/HeaderActions';
import HeaderStore from './HeaderStore';

class SidebarStore {
  constructor(){
    this.isDocked = false;
    this.isHidden = true;

		this.bindListeners({
			toggleSidebar: SidebarActions.TOGGLE
		})
	}
	toggleSidebar(){
    this.waitFor(HeaderStore);
		this.setState({
      isHidden: HeaderStore.getState().sidebarHidden
    });
  }
}

export default alt.createStore(SidebarStore, 'SidebarStore');
