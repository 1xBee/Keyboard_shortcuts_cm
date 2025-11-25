// src/services/base-keyboard-handler.js
import { createStatusIndicator, showGreenLight, hideLight } from '../lib/status-indicator.js';
import { showShortcutsModal, hideShortcutsModal } from '../lib/shortcut-modal.js';

export default class BaseKeyboardHandler {
  constructor() {
    this.vCtrl = false;
    createStatusIndicator();
  }

  getShortcutInfo() {
    return {
      name: "Base Shortcuts",
      modes: [
        {
          mode: "command",
          color: "green",
          trigger: "Press and release Ctrl",
          shortcuts: [
            {
              key: "Ctrl + /",
              action: "Show shortcuts",
              description: "Display keyboard shortcuts modal"
            },
            {
              key: "Ctrl + Escape",
              action: "Stop command",
              description: "Cancel and reset keyboard handler"
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
    this.afterProcessKey();
  }

  afterProcessKey() {
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
      if (key === '/') {
        showShortcutsModal(this.getShortcutInfo());
        return true;
      } else if (key === "Escape") {
        this.stopAll();
        return true;
      }
    }
    
    return false;
  }
}