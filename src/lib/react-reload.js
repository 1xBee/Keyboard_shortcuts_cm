// src/lib/react-reload.js
import { saveFilters, restoreFilters } from './filters.js';

export function reloadReactApp(selectors) {
  saveFilters(selectors);
  
  const rootApp = document.getElementById("rootApp");
  if (rootApp && window.ReactDOM && window.React && window.App) {
    window.ReactDOM.unmountComponentAtNode(rootApp);
    window.ReactDOM.render(window.React.createElement(window.App, null), rootApp);
    
    setTimeout(() => {
      if (document.querySelector(selectors.inputs)) {
        restoreFilters(selectors);
      } else {
        setTimeout(() => restoreFilters(selectors), 500);
      }
    }, 100);
    
    console.log("React app reloaded");
    return true;
  } else {
    console.log("React components not found in window");
    return false;
  }
}