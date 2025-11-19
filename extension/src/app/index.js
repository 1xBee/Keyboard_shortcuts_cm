// src/app/index.js
import TableKeyboardHandler from '../services/table-keyboard-handler.js';
import LoginKeyboardHandler from '../services/login-keyboard-handler.js';
import OrdersEditKeyboardHandler from '../services/orders-edit-keyboard-handler.js';

let currentHandler = null;

function initializeHandler() {
  // Cleanup previous handler
  if (currentHandler) {
    document.removeEventListener("keyup", currentHandler.keyUpListener);
    document.removeEventListener("keydown", currentHandler.keyDownListener);
    document.removeEventListener("click", currentHandler.clickListener);
  }

  // Router: Select handler based on path
  const path = window.location.pathname.toLowerCase();
  const tablePages = ['/items', '/deliveries', '/orders', '/logs', '/users', '/pos', '/customers', '/vendors', '/vendorgroups'];

  if (path === '/account/login') {
    currentHandler = new LoginKeyboardHandler();
  } else if (path.startsWith('/orders/edit')) {
    currentHandler = new OrdersEditKeyboardHandler();
  } else if (tablePages.some(page => path.startsWith(page))) {
    currentHandler = new TableKeyboardHandler();
  } else {
    currentHandler = new TableKeyboardHandler();
  }

  // Create bound listeners
  currentHandler.keyUpListener = (e) => currentHandler.handleKeyUp(e);
  currentHandler.keyDownListener = (e) => currentHandler.handleKeyDown(e);
  currentHandler.clickListener = () => currentHandler.handleClick();

  // Setup event listeners
  document.addEventListener("keyup", currentHandler.keyUpListener);
  document.addEventListener("keydown", currentHandler.keyDownListener);
  document.addEventListener("click", currentHandler.clickListener);

  console.log("Keyboard shortcuts loaded for:", path);
}

// Initial load
initializeHandler();

// Listen for URL changes (for SPA navigation)
let lastPath = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== lastPath) {
    lastPath = window.location.pathname;
    console.log("URL changed to:", lastPath);
    initializeHandler();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});