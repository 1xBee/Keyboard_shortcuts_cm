// src/lib/tab-navigation.js

export function clickTabByLetter(letter, reverse = false) {
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

  let startIdx = 0;
  const activeTab = document.querySelector('.nav-tabs a.nav-link.active');
  
  if (activeTab) {
    const activeIndex = tabs.indexOf(activeTab);
    if (activeIndex !== -1) {
      startIdx = reverse 
        ? (activeIndex - 1 + tabs.length) % tabs.length
        : (activeIndex + 1) % tabs.length;
    }
  }

  let found = null;
  for (let i = 0; i < tabs.length; i++) {
    const idx = reverse
      ? (startIdx - i + tabs.length) % tabs.length
      : (startIdx + i) % tabs.length;
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
    
    // Auto-click button for "All Items" tab
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

export function clickNewButton() {
  const button = document.querySelector('.mb-3 [type="button"].btn.btn-secondary');
  if (button && isAllItemsTabActive()) {
    button.click();
    console.log("Clicked New button");
    return true;
  }
  return false;
}

function isAllItemsTabActive() {
  const activeTab = document.querySelector('.nav-tabs a.nav-link.active');
  if (activeTab) {
    const tabText = activeTab.textContent.trim().toLowerCase();
    return tabText === 'all items';
  }
  return false;
}