export function focusAndSelectInput(inputEl) {
  if (!inputEl) return;
  inputEl.focus();
  if (inputEl.tagName === 'INPUT') {
    inputEl.select();
  }
  
  const rect = inputEl.getBoundingClientRect();
  const isVisible = rect.top >= 0 && rect.left >= 0 && 
                   rect.bottom <= window.innerHeight && 
                   rect.right <= window.innerWidth;
  
  if (!isVisible) {
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
}

export function clearAllInputs(selectors) {
  document.querySelectorAll(selectors.inputs).forEach(input => {
    if (!(input instanceof HTMLInputElement)) {
      return; // Skip non-input elements like select, textarea, etc.
    }
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 
      "value"
    ).set;
    
    nativeInputValueSetter.call(input, "");
    
    const inputEvent = new Event("input", { bubbles: true });
    inputEvent.simulated = true;
    
    const changeEvent = new Event("change", { bubbles: true });
    changeEvent.simulated = true;
    
    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);
  });
}

export function getAllHeaderInputs(selectors) {
  return Array.from(document.querySelectorAll(selectors.inputs));
}

export function getAllHeaders(selectors) {
  return Array.from(document.querySelectorAll(selectors.headers));
}