import React from 'react';
import Router from 'react-router';

class Renderer {
	constructor(props){
		this.routes = props && props.routes;
		this.context = {
			onInsertCss: (css)=> { this.css.push(css) },
			onSetTitle: (title)=>{ this.data['title'] = title},
			onSetMeta : (k,v) => { this.data[k] = v },
			onPageNotFound: ()=> { this.statusCode = 400 }
		}
	}

	refreshData(){
		this.data = {title: '', css: '', body: '', description: ''};
		this.css = [];
		this.statusCode = 200;
	}

	render(targetRoute){
		this.refreshData();
		return new Promise((resolve, reject)=>{
			try {
				Router.run(this.routes, targetRoute, (Root, state)=>{
					let body = React.renderToStaticMarkup(<Root context={this.context} {...state}/>);
					this.data['body'] = body;
					this.data['css']  = this.css.join(' ');
					resolve(this.data);
				});
			} catch (err) { reject(err) }
		});
	}
}


export default Renderer;
