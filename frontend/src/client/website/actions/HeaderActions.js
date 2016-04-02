import alt from '../alt';

class HeaderActions {
	constructor(){
		this.generateActions('toggleSidebar')
	}
}

export default alt.createActions(HeaderActions);