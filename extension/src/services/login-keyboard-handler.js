// src/services/login-keyboard-handler.js
import BaseKeyboardHandler from './base-keyboard-handler.js';

export default class LoginKeyboardHandler extends BaseKeyboardHandler {
  constructor() {
    super();
    this.submitClicked = false;
  }

  getShortcutInfo() {
    const baseInfo = super.getShortcutInfo();
    return {
      name: "Login Page",
      modes: [
        {
          ...baseInfo.modes[0],
          shortcuts: [
            {
              key: "Ctrl + [Any Key]",
              action: "Log in",
              description: "Click the Login button"
            },
            ...baseInfo.modes[0].shortcuts
          ]
        }
      ]
    };
  }

  processKey(e) {
    if (super.processKey(e)) return;
    
    const { key, ctrlKey, altKey } = e;
    
    if (this.vCtrl && !ctrlKey && !altKey) {
      if (!this.submitClicked) { 
        // Click submit button on any other key
        const submitButton = document.querySelector('[type=submit]');
        if (submitButton) {
          setTimeout(() => {
            submitButton.click();
            this.submitClicked = true;
            console.log("Clicked submit button");
          }, 0);
        }
      }
    }
  }
}