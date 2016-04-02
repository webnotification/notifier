import FastClick from 'fastclick';

import router from './router';
import Location from './core/Location';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactDOM from 'react-dom';

const container = document.getElementById('app');
const context = {
  onSetTitle: value => document.title = value,
  onSetMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    let elements = Array.from(document.getElementsByTagName('meta'));
    elements
      .filter((el)=> { return el.getAttribute('name') === name })
      .forEach((el)=>{ el.parentNode.removeChild(el) });

    let meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
};

// Server rendered styles not needed when client runs
function cleanupCSS(){
  let el = document.getElementById('css');
  if (el)
    el.parentNode.removeChild(el);
}

function run() {
  router.run((Handler, state)=>{
    ReactDOM.render(<Handler context={context} {...state}/>, container, ()=>{
      console.log('Rendered on Client');
      cleanupCSS();
    })
  });
}

function handlePopState(event) {
  Location.navigateTo(window.location.pathname, {replace: !!event.state});
}

function onLoad(){
  FastClick.attach(document.body)
}

// Needed for developer tools
window.React = React;

// Needed for some material ui components
injectTapEventPlugin();


// Run the application when both DOM is ready
// and page content is loaded
new Promise(resolve => {
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', resolve);
    window.addEventListener('popstate', handlePopState);
  } else {
    window.attachEvent('onload', resolve);
    window.attachEvent('popstate', handlePopState);
  }
}).then(onLoad).then(run);
