// src/lib/date-picker.js
export function openDatePickerForFocusedInput() {
  const input = document.activeElement;
  
  if (input && input.tagName === 'INPUT') {
    const isDateInput = input.type === 'date' || 
                       input.classList.contains('date-picker') || 
                       input.getAttribute('data-type') === 'date';
    
    if (isDateInput && input.showPicker) {
      input.showPicker();
      console.log("Opened date picker");
      return true;
    }
  }
  return false;
}