// src/lib/pagination.js
import { focusAndSelectInput } from './input-helpers.js';

export function clickNextPage(selectors) {
  const container = document.querySelector(selectors.nextPage);
  if (container) {
    const btn = container.querySelector('button') || container;
    if (btn && !btn.disabled) {
      btn.click();
      console.log("Clicked next page");
      return true;
    }
  }
  return false;
}

export function clickPreviousPage(selectors) {
  const container = document.querySelector(selectors.prevPage);
  if (container) {
    const btn = container.querySelector('button') || container;
    if (btn && !btn.disabled) {
      btn.click();
      console.log("Clicked previous page");
      return true;
    }
  }
  return false;
}

export function focusPageSizeSelect() {
  const pageSizeSelect = document.querySelector('.select-wrap .-pageSizeOptions select');
  if (pageSizeSelect) {
    focusAndSelectInput(pageSizeSelect);
    console.log("Focused page size select");
    return true;
  }
  return false;
}

export function focusPageJumpInput() {
  const pageJumpInput = document.querySelector('.-pageJump input');
  if (pageJumpInput) {
    focusAndSelectInput(pageJumpInput);
    console.log("Focused page jump input");
    return true;
  }
  return false;
}