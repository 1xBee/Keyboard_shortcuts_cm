import { focusAndSelectInput, getAllHeaders, getAllHeaderInputs } from './input-helpers.js';

export function focusHeaderByLetter(letter, selectors, reverse = false) {
  letter = letter.toLowerCase();
  const headers = getAllHeaders(selectors);
  const allInputs = getAllHeaderInputs(selectors);
  
  if (!headers.length) {
    console.log("No headers found");
    return false;
  }

  let startIdx = 0;
  const focusedElement = document.activeElement;
  if (focusedElement && (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'SELECT')) {
    const focusedInputIndex = allInputs.indexOf(focusedElement);
    if (focusedInputIndex !== -1) {
      startIdx = reverse 
        ? (focusedInputIndex - 1 + headers.length) % headers.length
        : (focusedInputIndex + 1) % headers.length;
    }
  }

  let found = null;
  for (let i = 0; i < headers.length; i++) {
    const idx = reverse
      ? (startIdx - i + headers.length) % headers.length
      : (startIdx + i) % headers.length;
    const header = headers[idx];
    const headerText = header.textContent.trim().toLowerCase();
    
    if (headerText.startsWith(letter)) {
      found = header;
      break;
    }
  }

  if (found) {
    const allHeaders = getAllHeaders(selectors);
    const headerIndex = allHeaders.indexOf(found);
    
    if (headerIndex !== -1 && allInputs[headerIndex]) {
      const input = allInputs[headerIndex];
      focusAndSelectInput(input);
      console.log("Focused input for header:", found.textContent.trim());
      return true;
    }
  }
  
  return false;
}

export function clickHeaderByIndex(selectors, index) {
  const headers = getAllHeaders(selectors);
  if (headers[index]) {
    headers[index].click();
    console.log("Clicked header:", headers[index].textContent.trim());
    return true;
  }
  return false;
}

export function clickHeaderForFocusedInput(selectors) {
  const focusedElement = document.activeElement;
  if (focusedElement && (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'SELECT')) {
    const inputs = getAllHeaderInputs(selectors);
    const index = inputs.indexOf(focusedElement);
    return clickHeaderByIndex(selectors, index);
  }
  return false;
}