import {Route, NotFoundRoute, DefaultRoute, Redirect} from 'react-router';
import Website from './website/routes';
import Dashboard from './dashboard/routes';

// import App from './components/App';
// import HomePage from './components/HomePage';
// import ContactPage from './components/ContactPage';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route name='app' path='/' handler={Website.App}>
    <Route path='/contact'   name='contact'    handler={Website.ContactPage}/>
    <Route path='/login'     name='login'      handler={Website.LoginPage}/>
    <Route path='/register'  name='register'   handler={Website.RegisterPage}/>

  	<Route path='/dashboard/' name='dashboard'  handler={Dashboard.HomePage}></Route>

    <DefaultRoute name='home' handler={Website.HomePage}/>
    <NotFoundRoute handler={Website.NotFoundPage}/>
  </Route>
);

export default routes;