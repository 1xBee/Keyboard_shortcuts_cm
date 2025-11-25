// src/services/orders-edit-keyboard-handler.js
import BaseKeyboardHandler from './base-keyboard-handler.js';
import { clickTabByLetter, clickNewButton, clickDeliveriesButton } from '../lib/tab-navigation.js';

export default class OrdersEditKeyboardHandler extends BaseKeyboardHandler {
  constructor() {
    super();
  }

  getShortcutInfo() {
    const baseInfo = super.getShortcutInfo();
    return {
      name: "Orders Page",
      modes: [
        {
          ...baseInfo.modes[0],
          shortcuts: [
            {
              key: "Ctrl + [Letter]",
              action: "Click Tab By Letter",
              description: "Click tab starting with the letter"
            },
            {
              key: "Ctrl + K",
              action: "Kallah invoice",
              description: "Click tab Kallah side invoice"
            },
            {
              key: "Ctrl + C",
              action: "Chosson invoice",
              description: "Click tab Chosson side invoice"
            },
            {
              key: "Ctrl + D",
              action: "Deliveries",
              description: "Opens deliveries for this order"
            },
            {
              key: "Ctrl + N",
              action: "New delivery",
              description: "Click the 'create new delivery' button in 'All items' tab"
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
      if (key.toLowerCase() === 'n') {
        clickNewButton();
        return;
      } else if (key.toLowerCase() === 'd') {
        clickDeliveriesButton();
        return;
      } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        clickTabByLetter(key);
        return;
      }
    }
  }
}