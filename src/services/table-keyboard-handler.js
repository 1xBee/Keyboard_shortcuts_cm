// src/services/table-keyboard-handler.js
import { createStatusIndicator, showGreenLight, showOrangeLight, hideLight } from '../lib/status-indicator.js';
import { clearAllInputs } from '../lib/input-helpers.js';
import { focusHeaderByLetter, clickHeaderForFocusedInput } from '../lib/header-navigation.js';
import { navigateLink, resetLinkNavigation } from '../lib/link-navigation.js';
import { clickNextPage, clickPreviousPage } from '../lib/pagination.js';
import { saveFilters, restoreFilters } from '../lib/filters.js';
import { reloadReactApp } from '../lib/react-reload.js';
import { openDatePickerForFocusedInput } from '../lib/date-picker.js';

export default class TableKeyboardHandler {
  constructor(selectors = {}) {
    this.vCtrl = false;
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
      // do not turn on the light,
      return;
    } else if (e.key === "Shift") return;

    if (this.vCtrl && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
    }
    
    this.processKey(e);

    this.vCtrl = false;
    if (!this.linkNavigation) hideLight();
  }

  handleClick() {
    this.stopAll();
  }

  stopAll() {
    this.vCtrl = false;
    this.linkNavigation = false;
    hideLight();
    resetLinkNavigation();
  }

  processKey(e) {
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