// src/services/login-keyboard-handler.js
import { createStatusIndicator, showGreenLight, hideLight } from '../lib/status-indicator.js';
import { showShortcutsModal, hideShortcutsModal } from '../lib/shortcut-modal.js';

export default class LoginKeyboardHandler {
  constructor() {
    this.vCtrl = false;
    this.submitClicked = false;
    createStatusIndicator();
  }

  getShortcutInfo() {
    return {
      "name": "Login Page",
      "modes": [
        {
          "mode": "command",
          "color": "green",
          "trigger": "Press and release Ctrl",
          "shortcuts": [
            {
              "key": "Ctrl + [Any Key]",
              "action": "Log in",
              "description": "Click the Login button"
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
    hideShortcutsModal();
  }

  processKey(e) {
    const { key, ctrlKey, altKey } = e;
    
    if (this.vCtrl && !ctrlKey && !altKey) {
      if (key === '/'){
        showShortcutsModal(this.getShortcutInfo());
        return;
      }else if (key === "Escape") {
        this.stopAll();
        return;
      }else if (!this.submitClicked) { 
        // Click submit button on any other key
        const submitButton = document.querySelector('[type=submit]');
        if (submitButton) {
          setTimeout(()=> {
            submitButton.click();
            this.submitClicked = true;
            console.log("Clicked submit button");
          }, 0);
        }
      }
    }
  }
}