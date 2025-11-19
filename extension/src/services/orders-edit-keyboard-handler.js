// src/services/orders-edit-keyboard-handler.js
import { createStatusIndicator, showGreenLight, hideLight } from '../lib/status-indicator.js';
import { clickTabByLetter, clickNewButton } from '../lib/tab-navigation.js';
import { injectModalStyles, createModal, removeModal } from '../lib/shortcut-modal.js';

export default class OrdersEditKeyboardHandler {
  constructor() {
    this.vCtrl = false;
    createStatusIndicator();
  }

  getShortcutInfo() {
    return {
      "name": "Orders Page",
      "modes": [
        {
          "mode": "command",
          "color": "green",
          "trigger": "Press and release Ctrl",
          "shortcuts": [
            {
              "key": "Ctrl + N",
              "action": "New delivery",
              "description": "Click the 'create new delivery' button in 'All items' tab"
            },
            {
              "key": "Ctrl + [Letter]",
              "action": "Click Tab By Letter",
              "description": "Click tab starting with the letter"
            },
            {
              "key": "Ctrl + K",
              "action": "Kallah invoice",
              "description": "Click tab Kallah side invoice"
            },            {
              "key": "Ctrl + C",
              "action": "Chosson invoice",
              "description": "Click tab Chosson side invoice"
            },
            {
              "key": "Ctrl + Escape",
              "action": "Stop commend",
              "description": "Cancel and reset keyboard handler"
            }
          ]
        }
      ]
    };
  }

  handleKeyUp(e) {
    if (e.key === "Control" && this.vCtrl) {
      showGreenLight();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Control") {
      this.vCtrl = true;
      return;
    } else if (e.key === "Shift") return;

    if (this.vCtrl && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
    }
    
    this.processKey(e);
    this.vCtrl = false;
    hideLight();
  }

  handleClick() {
    this.stopAll();
  }

  stopAll() {
    this.vCtrl = false;
    hideLight();
    removeModal();
  }

  processKey(e) {
    const { key, ctrlKey, altKey } = e;
    
    if (this.vCtrl && !ctrlKey && !altKey) {
      if (key === "Escape") {
        this.stopAll();
        return;
      }
      if (key === '?') {
        createModal(this.getShortcutInfo());
        return;
      }else if (key.toLowerCase() === 'n'){
        clickNewButton();
        return;
      } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        clickTabByLetter(key);
        return;
      }
    }
  }
}