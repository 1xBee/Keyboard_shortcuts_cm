// src/services/table-keyboard-handler.js
import BaseKeyboardHandler from './base-keyboard-handler.js';
import { showOrangeLight, hideLight } from '../lib/status-indicator.js';
import { clearAllInputs } from '../lib/input-helpers.js';
import { focusHeaderByLetter, clickHeaderForFocusedInput } from '../lib/header-navigation.js';
import { navigateLink, resetLinkNavigation } from '../lib/link-navigation.js';
import { clickNextPage, clickPreviousPage } from '../lib/pagination.js';
import { saveFilters, restoreFilters } from '../lib/filters.js';
import { reloadReactApp } from '../lib/react-reload.js';
import { openDatePickerForFocusedInput } from '../lib/date-picker.js';

export default class TableKeyboardHandler extends BaseKeyboardHandler {
  constructor(selectors = {}) {
    super();
    this.linkNavigation = false;
    
    // Build selectors with Pattern 2 (add to base)
    this.selectors = {
      headers: `.rt-resizable-header-content${selectors.additionalHeaders ? ', ' + selectors.additionalHeaders : ''}`,
      inputs: `.rt-th input, .rt-th select${selectors.additionalInputs ? ', ' + selectors.additionalInputs : ''}`,
      rows: selectors.rows || '.rt-tr',
      cells: selectors.cells || '.rt-td',
      links: selectors.links || 'a',
      nextPage: selectors.nextPage || '.-next',
      prevPage: selectors.prevPage || '.-previous'
    };
  }

  getShortcutInfo() {
    const baseInfo = super.getShortcutInfo();
    return {
      name: "Main Page",
      modes: [
        {
          ...baseInfo.modes[0],
          shortcuts: [
            {
              key: "Ctrl + [Letter]",
              action: "Focus columns by letter",
              description: "Focus table header starting with the letter (add Shift for reverse)"
            },
            {
              key: "Ctrl + Backspace",
              action: "Clear filters",
              description: "Clear all filter inputs"
            },
            {
              key: "Ctrl + .",
              action: "Open date picker",
              description: "Open date picker for focused input"
            },
            {
              key: "Ctrl + Enter",
              action: "Sort column",
              description: "Click the header of focused input"
            },
            {
              key: "Ctrl + →",
              action: "Next page",
              description: "Go to next page"
            },
            {
              key: "Ctrl + ←",
              action: "Prev. page",
              description: "Go to previous page"
            },
            {
              key: "Ctrl + F5",
              action: "Reload w/ filters",
              description: "Reload app while preserving filters"
            },
            {
              key: "Ctrl + ↑/↓",
              action: "Enter link navigation",
              description: "Start link navigation mode"
            },
            ...baseInfo.modes[0].shortcuts
          ]
        },
        {
          mode: "linkNavigation",
          color: "orange",
          trigger: "Activated by Ctrl + ↑/↓",
          shortcuts: [
            {
              key: "↑",
              action: "Navigate Up",
              description: "Move to previous link"
            },
            {
              key: "↓",
              action: "Navigate Down",
              description: "Move to next link"
            },
            {
              key: "←",
              action: "Navigate Left",
              description: "Move to link on the left"
            },
            {
              key: "→",
              action: "Navigate Right",
              description: "Move to link on the right"
            },
            {
              key: "Escape",
              action: "Exit link navigation",
              description: "Exit link navigation mode"
            }
          ]
        }
      ]
    };
  }

  afterProcessKey() {
    if (!this.linkNavigation) {
      hideLight();
    }
  }

  stopAll() {
    super.stopAll();
    this.linkNavigation = false;
    resetLinkNavigation();
  }

  processKey(e) {
    if (super.processKey(e)) return;
    
    const { key, ctrlKey, shiftKey, altKey } = e;
    
    if (this.vCtrl && !ctrlKey && !altKey) {
      // Check if key is a letter (a-z or A-Z)
      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        focusHeaderByLetter(key, this.selectors, shiftKey);
        return;
      }
      
      switch (key) {
        case "Backspace":
          clearAllInputs(this.selectors);
          break;
        case ".":
          openDatePickerForFocusedInput();
          break;
        case "Enter":
          clickHeaderForFocusedInput(this.selectors);
          break;
        case "ArrowRight":
          clickNextPage(this.selectors);
          break;
        case "ArrowLeft":
          clickPreviousPage(this.selectors);
          break;
        case "F5":
          saveFilters(this.selectors);
          reloadReactApp(this.selectors);
          restoreFilters(this.selectors);
          break;
        case "ArrowUp":
        case "ArrowDown":
          this.linkNavigation = true;
          showOrangeLight();
          navigateLink(key.replace("Arrow", "").toLowerCase(), this.selectors);
          break;
        default:
          break;
      }
    } else if (this.linkNavigation && !ctrlKey && !altKey) {
      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
      
      if (arrowKeys.includes(key)) {
        navigateLink(key.replace("Arrow", "").toLowerCase(), this.selectors);
      } else if (key === "Escape") {
        this.linkNavigation = false;
        resetLinkNavigation();
        hideLight();
      }
    }
  }
}