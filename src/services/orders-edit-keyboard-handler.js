// src/services/orders-edit-keyboard-handler.js
import { createStatusIndicator, showGreenLight, hideLight } from '../lib/status-indicator.js';

export default class OrdersEditKeyboardHandler {
  constructor() {
    this.vCtrl = false;
    createStatusIndicator();
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
  }

  clickTabByLetter(letter) {
    letter = letter.toLowerCase();
    const tabs = Array.from(document.querySelectorAll('.nav-tabs a.nav-link'));
    
    if (!tabs.length) {
      console.log("No tabs found");
      return false;
    }

    // Special handling for invoice tabs
    if (letter === 'k') {
      const invoiceTabs = tabs.filter(tab => 
        tab.textContent.trim().toLowerCase().includes('invoice')
      );
      if (invoiceTabs.length > 0) {
        invoiceTabs[0].click();
        console.log("Clicked first invoice tab");
        return true;
      }
      return false;
    }
    
    if (letter === 'c') {
      const invoiceTabs = tabs.filter(tab => 
        tab.textContent.trim().toLowerCase().includes('invoice')
      );
      if (invoiceTabs.length > 1) {
        invoiceTabs[1].click();
        console.log("Clicked second invoice tab");
        return true;
      }
      return false;
    }

    // Regular tab navigation by first letter
    let startIdx = 0;
    const activeTab = document.querySelector('.nav-tabs a.nav-link.active');
    
    if (activeTab) {
      const activeIndex = tabs.indexOf(activeTab);
      if (activeIndex !== -1) {
        startIdx = (activeIndex + 1) % tabs.length;
      }
    }

    let found = null;
    for (let i = 0; i < tabs.length; i++) {
      const idx = (startIdx + i) % tabs.length;
      const tab = tabs[idx];
      const tabText = tab.textContent.trim().toLowerCase();
      
      // Skip invoice tabs for regular letter matching
      if (tabText.includes('invoice')) {
        continue;
      }
      
      if (tabText.startsWith(letter)) {
        found = tab;
        break;
      }
    }

    if (found) {
      const tabText = found.textContent.trim().toLowerCase();
      found.click();
      console.log("Clicked tab:", found.textContent.trim());
      
      // Check if the tab we're clicking is "All Items"
      if (tabText === 'all items') {
        setTimeout(() => {
          const button = document.querySelector('.mb-3 [type="button"].btn.btn-dark');
          if (button) {
            button.click();
            console.log("Clicked All Items button");
          }
        }, 100);
      }
      
      return true;
    }
    
    return false;
  }

  processKey(e) {
    const { key, ctrlKey, altKey } = e;
    
    if (this.vCtrl && !ctrlKey && !altKey) {
      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        this.clickTabByLetter(key);
        return;
      }
    }
  }
}