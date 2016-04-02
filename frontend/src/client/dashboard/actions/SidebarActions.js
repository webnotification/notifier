import alt from '../alt';

class SidebarActions {
	constructor(){
		this.generateActions('toggle')
	}
}

export default alt.createActions(SidebarActions);