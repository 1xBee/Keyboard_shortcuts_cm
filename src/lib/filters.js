// src/lib/filters.js
import { getAllHeaders, getAllHeaderInputs } from './input-helpers.js';

let savedFilters = {};

export function saveFilters(selectors) {
  savedFilters = {};
  const headers = getAllHeaders(selectors);
  const inputs = getAllHeaderInputs(selectors);
  
  inputs.forEach((input, index) => {
    const headerText = headers[index] 
      ? headers[index].textContent.trim() 
      : `header_${index}`;
    if (input.value) {
      savedFilters[headerText] = input.value;
    }
  });
  
  const pageSizeSelect = document.querySelector('.select-wrap .-pageSizeOptions select');
  if (pageSizeSelect && pageSizeSelect.value) {
    savedFilters['__pageSize__'] = pageSizeSelect.value;
  }
  
  const pageJumpInput = document.querySelector('.-pageJump input');
  if (pageJumpInput && pageJumpInput.value) {
    savedFilters['__pageJump__'] = pageJumpInput.value;
  }
  
  console.log("Saved filters:", savedFilters);
  return savedFilters;
}

export function restoreFilters(selectors) {
  const headers = getAllHeaders(selectors);
  const inputs = getAllHeaderInputs(selectors);
  
  headers.forEach((header, index) => {
    const headerText = header.textContent.trim();
    const input = inputs[index];
    
    if (input && savedFilters[headerText]) {
      const value = savedFilters[headerText];
      
      if (input.tagName === 'SELECT') {
        input.value = value;
        const changeEvent = new Event("change", { bubbles: true });
        changeEvent.simulated = true;
        input.dispatchEvent(changeEvent);
      } else {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 
          "value"
        ).set;
        nativeInputValueSetter.call(input, value);
        
        const inputEvent = new Event("input", { bubbles: true });
        inputEvent.simulated = true;
        const changeEvent = new Event("change", { bubbles: true });
        changeEvent.simulated = true;
        
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      }
    }
  });
  
  console.log("Restored filters");
  return true;
}

export function getSavedFilters() {
  return savedFilters;
}