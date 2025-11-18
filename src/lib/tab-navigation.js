// src/lib/tab-navigation.js

export function clickTabByLetter(letter, reverse = false) {
  letter = letter.toLowerCase();
  const tabs = Array.from(document.querySelectorAll('.nav-tabs a.nav-link'));
  
  if (!tabs.length) {
    console.log("No tabs found");
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
    
    if (tabText.startsWith(letter)) {
      found = tab;
      break;
    }
  }

  if (found) {
    found.click();
    console.log("Clicked tab:", found.textContent.trim());
    return true;
  }
  
  return false;
}