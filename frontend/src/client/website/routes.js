import {Route, NotFoundRoute, DefaultRoute, Redirect} from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route name='app' path='/' handler={App}>
    <Route path='/contact'   name='contact'    handler={ContactPage}/>
    <Route path='/login'     name='login'      handler={LoginPage}/>
    <Route path='/register'  name='register'   handler={RegisterPage}/>

    <DefaultRoute name='home' handler={HomePage}/>
    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

export default routes;
