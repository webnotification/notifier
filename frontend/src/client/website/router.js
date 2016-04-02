import Router, { HistoryLocation } from 'react-router';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import routes from './routes';


var router;

export default {
	getCurrentPath() {
    return router.getCurrentPath();
  },

  makePath(to, params, query) {
    return router.makePath(to, params, query);
  },

  makeHref(to, params, query) {
    return router.makeHref(to, params, query);
  },

  transitionTo(to, params, query) {
    router.transitionTo(to, params, query);
  },

  replaceWith(to, params, query) {
    router.replaceWith(to, params, query);
  },

  goBack() {
    router.goBack();
  },

  run(render) {
    router.run(render);
  }
};



if(canUseDOM) {
	router = Router.create({
		routes: routes,
		location: HistoryLocation
	});
}