(() => {
  // extension/src/lib/status-indicator.js
  var statusIndicator = null;
  function createStatusIndicator() {
    if (document.getElementById("nav-status-indicator"))
      return;
    statusIndicator = document.createElement("div");
    statusIndicator.id = "nav-status-indicator";
    statusIndicator.style.cssText = `
    position: fixed;
    top: 65px;
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid #ccc;
    transition: all 0.3s ease;
    z-index: 10000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    display: none;
  `;
    document.body.appendChild(statusIndicator);
  }
  function showGreenLight() {
    if (!statusIndicator)
      return;
    statusIndicator.style.display = "block";
    statusIndicator.style.backgroundColor = "#4caf50";
    statusIndicator.style.borderColor = "#4caf50";
    statusIndicator.style.boxShadow = "0 2px 10px rgba(76, 175, 80, 0.5)";
    statusIndicator.title = "Virtual Ctrl Mode Active";
  }
  function showOrangeLight() {
    if (!statusIndicator)
      return;
    statusIndicator.style.display = "block";
    statusIndicator.style.backgroundColor = "#ff9800";
    statusIndicator.style.borderColor = "#ff9800";
    statusIndicator.style.boxShadow = "0 2px 10px rgba(255, 152, 0, 0.5)";
    statusIndicator.title = "Link Navigation Mode Active";
  }
  function hideLight() {
    if (!statusIndicator)
      return;
    statusIndicator.style.display = "none";
    statusIndicator.title = "";
  }

  // extension/src/lib/shortcut-modal.js
  var MODAL_ID = "keyboard-shortcuts-modal";
  var BACKDROP_ID = "keyboard-shortcuts-backdrop";
  var modalElement = null;
  var backdropElement = null;
  function showShortcutsModal(shortcutInfo) {
    if (modalElement) {
      modalElement.style.display = "block";
      backdropElement.style.display = "block";
      modalElement.offsetHeight;
      backdropElement.offsetHeight;
      modalElement.classList.add("show");
      backdropElement.classList.add("show");
      document.body.classList.add("modal-open");
      return;
    }
    modalElement = createModalElement(shortcutInfo);
    backdropElement = createBackdropElement();
    document.body.appendChild(backdropElement);
    document.body.appendChild(modalElement);
    document.body.classList.add("modal-open");
    modalElement.style.display = "block";
    backdropElement.style.display = "block";
    modalElement.offsetHeight;
    modalElement.classList.add("show");
    backdropElement.classList.add("show");
    addEventListeners();
  }
  function hideShortcutsModal() {
    if (!modalElement)
      return;
    modalElement.classList.remove("show");
    backdropElement.classList.remove("show");
    setTimeout(() => {
      if (modalElement) {
        modalElement.style.display = "none";
        backdropElement.style.display = "none";
        document.body.classList.remove("modal-open");
        removeEventListeners();
        modalElement.remove();
        backdropElement.remove();
        modalElement = null;
        backdropElement = null;
      }
    }, 150);
  }
  function createModalElement(shortcutInfo) {
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.setAttribute("role", "dialog");
    modal.innerHTML = `
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            ${shortcutInfo.name} - Keyboard Shortcuts
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ${generateModesHTML(shortcutInfo.modes)}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;
    return modal;
  }
  function createBackdropElement() {
    const backdrop = document.createElement("div");
    backdrop.id = BACKDROP_ID;
    backdrop.className = "modal-backdrop fade";
    return backdrop;
  }
  function generateModesHTML(modes) {
    return modes.map((mode) => {
      return `
      <div class="mb-4">
        <h6 class="font-weight-bold">
          <span class="d-inline-block rounded-circle mr-2" style="width: 12px; height: 12px; background-color: ${mode.color};"></span>
          ${mode.mode.charAt(0).toUpperCase() + mode.mode.slice(1)} Mode
        </h6>
        <p class="text-muted small mb-3">
          <em>${mode.trigger}</em>
        </p>
        <table class="table table-sm table-hover">
          <thead class="thead-light">
            <tr>
              <th style="width: 35%">Key</th>
              <th style="width: 25%">Action</th>
              <th style="width: 40%">Description</th>
            </tr>
          </thead>
          <tbody>
            ${generateShortcutsHTML(mode.shortcuts)}
          </tbody>
        </table>
      </div>
    `;
    }).join("");
  }
  function generateShortcutsHTML(shortcuts) {
    return shortcuts.map((shortcut) => `
    <tr>
      <td>${formatKeys(shortcut.key)}</td>
      <td><strong>${shortcut.action}</strong></td>
      <td class="text-muted">${shortcut.description}</td>
    </tr>
  `).join("");
  }
  function formatKeys(keyString) {
    return keyString.split("+").map((key) => `<kbd class="bg-white border border-dark text-dark rounded-2 fw-bold shadow-sm">${key.trim()}</kbd>`).join(" + ");
  }
  function addEventListeners() {
    const closeButtons = modalElement.querySelectorAll('[data-dismiss="modal"]');
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", hideShortcutsModal);
    });
    document.addEventListener("keydown", handleEscapeKey);
    backdropElement.addEventListener("click", hideShortcutsModal);
    const modalDialog = modalElement.querySelector(".modal-dialog");
    if (modalDialog) {
      modalDialog.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }
  function removeEventListeners() {
    document.removeEventListener("keydown", handleEscapeKey);
    if (backdropElement) {
      backdropElement.removeEventListener("click", hideShortcutsModal);
    }
  }
  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      hideShortcutsModal();
    }
  }

  // extension/src/services/base-keyboard-handler.js
  var BaseKeyboardHandler = class {
    constructor() {
      this.vCtrl = false;
      createStatusIndicator();
    }
    getShortcutInfo() {
      return {
        name: "Base Shortcuts",
        modes: [
          {
            mode: "command",
            color: "green",
            trigger: "Press and release Ctrl",
            shortcuts: [
              {
                key: "Ctrl + /",
                action: "Show shortcuts",
                description: "Display keyboard shortcuts modal"
              },
              {
                key: "Ctrl + Escape",
                action: "Stop command",
                description: "Cancel and reset keyboard handler"
              }
            ]
          }
        ]
      };
    }
    handleKeyUp(e) {
      if (e.key === "Control" && this.vCtrl) {
        showGreenLight();
      }
    }
    handleKeyDown(e) {
      if (e.key === "Control") {
        this.vCtrl = true;
        return;
      } else if (e.key === "Shift")
        return;
      if (this.vCtrl && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
      }
      this.processKey(e);
      this.vCtrl = false;
      this.afterProcessKey();
    }
    afterProcessKey() {
      hideLight();
    }
    handleClick() {
      this.stopAll();
    }
    stopAll() {
      this.vCtrl = false;
      hideLight();
      hideShortcutsModal();
    }
    processKey(e) {
      const { key, ctrlKey, altKey } = e;
      if (this.vCtrl && !ctrlKey && !altKey) {
        if (key === "/") {
          showShortcutsModal(this.getShortcutInfo());
          return true;
        } else if (key === "Escape") {
          this.stopAll();
          return true;
        }
      }
      return false;
    }
  };

  // extension/src/lib/input-helpers.js
  function focusAndSelectInput(inputEl) {
    if (!inputEl)
      return;
    inputEl.focus();
    if (inputEl.tagName === "INPUT") {
      inputEl.select();
    } else if (inputEl.tagName === "SELECT") {
      inputEl.showPicker();
    }
    const rect = inputEl.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    if (!isVisible) {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }
  function clearAllInputs(selectors) {
    document.querySelectorAll(selectors.inputs).forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
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
  function getAllHeaderInputs(selectors) {
    return Array.from(document.querySelectorAll(selectors.inputs));
  }
  function getAllHeaders(selectors) {
    return Array.from(document.querySelectorAll(selectors.headers));
  }

  // extension/src/lib/header-navigation.js
  function focusHeaderByLetter(letter, selectors, reverse = false) {
    letter = letter.toLowerCase();
    const headers = getAllHeaders(selectors);
    const allInputs = getAllHeaderInputs(selectors);
    if (!headers.length) {
      console.log("No headers found");
      return false;
    }
    let startIdx = 0;
    const focusedElement = document.activeElement;
    if (focusedElement && (focusedElement.tagName === "INPUT" || focusedElement.tagName === "SELECT")) {
      const focusedInputIndex = allInputs.indexOf(focusedElement);
      if (focusedInputIndex !== -1) {
        startIdx = reverse ? (focusedInputIndex - 1 + headers.length) % headers.length : (focusedInputIndex + 1) % headers.length;
      }
    }
    let found = null;
    for (let i = 0; i < headers.length; i++) {
      const idx = reverse ? (startIdx - i + headers.length) % headers.length : (startIdx + i) % headers.length;
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
  function clickHeaderByIndex(selectors, index) {
    const headers = getAllHeaders(selectors);
    if (headers[index]) {
      headers[index].click();
      console.log("Clicked header:", headers[index].textContent.trim());
      return true;
    }
    return false;
  }
  function clickHeaderForFocusedInput(selectors) {
    const focusedElement = document.activeElement;
    if (focusedElement && (focusedElement.tagName === "INPUT" || focusedElement.tagName === "SELECT")) {
      const inputs = getAllHeaderInputs(selectors);
      const index = inputs.indexOf(focusedElement);
      return clickHeaderByIndex(selectors, index);
    }
    return false;
  }

  // extension/src/lib/link-navigation.js
  var currentLink = null;
  function getAllLinksWithPosition(selectors) {
    const rows = Array.from(document.querySelectorAll(selectors.rows));
    const linksWithPosition = [];
    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll(selectors.cells));
      cells.forEach((cell, columnIndex) => {
        const links = Array.from(cell.querySelectorAll(selectors.links));
        links.forEach((link) => {
          linksWithPosition.push({ link, rowIndex, columnIndex });
        });
      });
    });
    return linksWithPosition;
  }
  function focusAndHighlightLink(link) {
    link.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(link);
    selection.removeAllRanges();
    selection.addRange(range);
    link.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function navigateLink(direction, selectors) {
    const linksWithPosition = getAllLinksWithPosition(selectors);
    if (!linksWithPosition.length) {
      console.log("No links found");
      return false;
    }
    let currentPosition = null;
    if (currentLink && document.contains(currentLink)) {
      currentPosition = linksWithPosition.find((item) => item.link === currentLink);
    }
    if (!currentPosition) {
      currentLink = linksWithPosition[0].link;
      focusAndHighlightLink(currentLink);
      console.log("Started navigation from top");
      return true;
    }
    let newPosition = null;
    if (direction === "up" || direction === "down") {
      const sameColumnLinks = linksWithPosition.filter(
        (item) => item.columnIndex === currentPosition.columnIndex
      );
      const currentIndexInColumn = sameColumnLinks.findIndex(
        (item) => item.link === currentLink
      );
      if (direction === "up") {
        const newIndexInColumn = currentIndexInColumn > 0 ? currentIndexInColumn - 1 : sameColumnLinks.length - 1;
        newPosition = sameColumnLinks[newIndexInColumn];
      } else {
        const newIndexInColumn = currentIndexInColumn < sameColumnLinks.length - 1 ? currentIndexInColumn + 1 : 0;
        newPosition = sameColumnLinks[newIndexInColumn];
      }
    } else if (direction === "left" || direction === "right") {
      const currentRow = currentPosition.rowIndex;
      const availableColumns = [...new Set(linksWithPosition.map(
        (item) => item.columnIndex
      ))].sort((a, b) => a - b);
      const currentColPosition = availableColumns.indexOf(currentPosition.columnIndex);
      let newColPosition;
      if (direction === "left") {
        newColPosition = currentColPosition > 0 ? currentColPosition - 1 : availableColumns.length - 1;
      } else {
        newColPosition = currentColPosition < availableColumns.length - 1 ? currentColPosition + 1 : 0;
      }
      const newColumnIndex = availableColumns[newColPosition];
      let sameRowNewColumn = linksWithPosition.find(
        (item) => item.rowIndex === currentRow && item.columnIndex === newColumnIndex
      );
      if (sameRowNewColumn) {
        newPosition = sameRowNewColumn;
      } else {
        const newColumnLinks = linksWithPosition.filter(
          (item) => item.columnIndex === newColumnIndex
        );
        newPosition = newColumnLinks[0];
      }
    }
    if (newPosition) {
      currentLink = newPosition.link;
      focusAndHighlightLink(currentLink);
      console.log("Navigated to row:", newPosition.rowIndex, "column:", newPosition.columnIndex);
      return true;
    }
    return false;
  }
  function resetLinkNavigation() {
    currentLink = null;
  }

  // extension/src/lib/pagination.js
  function clickNextPage(selectors) {
    const container = document.querySelector(selectors.nextPage);
    if (container) {
      const btn = container.querySelector("button") || container;
      if (btn && !btn.disabled) {
        btn.click();
        console.log("Clicked next page");
        return true;
      }
    }
    return false;
  }
  function clickPreviousPage(selectors) {
    const container = document.querySelector(selectors.prevPage);
    if (container) {
      const btn = container.querySelector("button") || container;
      if (btn && !btn.disabled) {
        btn.click();
        console.log("Clicked previous page");
        return true;
      }
    }
    return false;
  }

  // extension/src/lib/filters.js
  var savedFilters = {};
  function saveFilters(selectors) {
    savedFilters = {};
    const headers = getAllHeaders(selectors);
    const inputs = getAllHeaderInputs(selectors);
    inputs.forEach((input, index) => {
      const headerText = headers[index] ? headers[index].textContent.trim() : `header_${index}`;
      if (input.value) {
        savedFilters[headerText] = input.value;
      }
    });
    const pageSizeSelect = document.querySelector(".select-wrap .-pageSizeOptions select");
    if (pageSizeSelect && pageSizeSelect.value) {
      savedFilters["__pageSize__"] = pageSizeSelect.value;
    }
    const pageJumpInput = document.querySelector(".-pageJump input");
    if (pageJumpInput && pageJumpInput.value) {
      savedFilters["__pageJump__"] = pageJumpInput.value;
    }
    console.log("Saved filters:", savedFilters);
    return savedFilters;
  }
  function restoreFilters(selectors) {
    const headers = getAllHeaders(selectors);
    const inputs = getAllHeaderInputs(selectors);
    headers.forEach((header, index) => {
      const headerText = header.textContent.trim();
      const input = inputs[index];
      if (input && savedFilters[headerText]) {
        const value = savedFilters[headerText];
        if (input.tagName === "SELECT") {
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

  // extension/src/lib/react-reload.js
  function reloadReactApp(selectors) {
    saveFilters(selectors);
    const rootApp = document.getElementById("rootApp");
    if (rootApp && window.ReactDOM && window.React && window.App) {
      window.ReactDOM.unmountComponentAtNode(rootApp);
      window.ReactDOM.render(window.React.createElement(window.App, null), rootApp);
      setTimeout(() => {
        if (document.querySelector(selectors.inputs)) {
          restoreFilters(selectors);
        } else {
          setTimeout(() => restoreFilters(selectors), 500);
        }
      }, 100);
      console.log("React app reloaded");
      return true;
    } else {
      console.log("React components not found in window");
      return false;
    }
  }

  // extension/src/lib/date-picker.js
  function openDatePickerForFocusedInput() {
    const input = document.activeElement;
    if (input && input.tagName === "INPUT") {
      const isDateInput = input.type === "date" || input.classList.contains("date-picker") || input.getAttribute("data-type") === "date";
      if (isDateInput && input.showPicker) {
        input.showPicker();
        console.log("Opened date picker");
        return true;
      }
    }
    return false;
  }

  // extension/src/services/table-keyboard-handler.js
  var TableKeyboardHandler = class extends BaseKeyboardHandler {
    constructor(selectors = {}) {
      super();
      this.linkNavigation = false;
      this.selectors = {
        headers: `.rt-resizable-header-content${selectors.additionalHeaders ? ", " + selectors.additionalHeaders : ""}`,
        inputs: `.rt-th input, .rt-th select${selectors.additionalInputs ? ", " + selectors.additionalInputs : ""}`,
        rows: selectors.rows || ".rt-tr",
        cells: selectors.cells || ".rt-td",
        links: selectors.links || "a",
        nextPage: selectors.nextPage || ".-next",
        prevPage: selectors.prevPage || ".-previous"
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
                key: "Ctrl + \u2192",
                action: "Next page",
                description: "Go to next page"
              },
              {
                key: "Ctrl + \u2190",
                action: "Prev. page",
                description: "Go to previous page"
              },
              {
                key: "Ctrl + F5",
                action: "Reload w/ filters",
                description: "Reload app while preserving filters"
              },
              {
                key: "Ctrl + \u2191/\u2193",
                action: "Enter link navigation",
                description: "Start link navigation mode"
              },
              ...baseInfo.modes[0].shortcuts
            ]
          },
          {
            mode: "linkNavigation",
            color: "orange",
            trigger: "Activated by Ctrl + \u2191/\u2193",
            shortcuts: [
              {
                key: "\u2191",
                action: "Navigate Up",
                description: "Move to previous link"
              },
              {
                key: "\u2193",
                action: "Navigate Down",
                description: "Move to next link"
              },
              {
                key: "\u2190",
                action: "Navigate Left",
                description: "Move to link on the left"
              },
              {
                key: "\u2192",
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
      if (super.processKey(e))
        return;
      const { key, ctrlKey, shiftKey, altKey } = e;
      if (this.vCtrl && !ctrlKey && !altKey) {
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
  };

  // extension/src/services/login-keyboard-handler.js
  var LoginKeyboardHandler = class extends BaseKeyboardHandler {
    constructor() {
      super();
      this.submitClicked = false;
    }
    getShortcutInfo() {
      const baseInfo = super.getShortcutInfo();
      return {
        name: "Login Page",
        modes: [
          {
            ...baseInfo.modes[0],
            shortcuts: [
              {
                key: "Ctrl + [Any Key]",
                action: "Log in",
                description: "Click the Login button"
              },
              ...baseInfo.modes[0].shortcuts
            ]
          }
        ]
      };
    }
    processKey(e) {
      if (super.processKey(e))
        return;
      const { key, ctrlKey, altKey } = e;
      if (this.vCtrl && !ctrlKey && !altKey) {
        if (!this.submitClicked) {
          const submitButton = document.querySelector("[type=submit]");
          if (submitButton) {
            setTimeout(() => {
              submitButton.click();
              this.submitClicked = true;
              console.log("Clicked submit button");
            }, 0);
          }
        }
      }
    }
  };

  // extension/src/lib/tab-navigation.js
  function clickTabByLetter(letter, reverse = false) {
    letter = letter.toLowerCase();
    const tabs = Array.from(document.querySelectorAll(".nav-tabs a.nav-link"));
    if (!tabs.length) {
      console.log("No tabs found");
      return false;
    }
    if (letter === "k") {
      const invoiceTabs = tabs.filter(
        (tab) => tab.textContent.trim().toLowerCase().includes("invoice")
      );
      if (invoiceTabs.length > 0) {
        invoiceTabs[0].click();
        console.log("Clicked first invoice tab");
        return true;
      }
      return false;
    }
    if (letter === "c") {
      const invoiceTabs = tabs.filter(
        (tab) => tab.textContent.trim().toLowerCase().includes("invoice")
      );
      if (invoiceTabs.length > 1) {
        invoiceTabs[1].click();
        console.log("Clicked second invoice tab");
        return true;
      }
      return false;
    }
    let startIdx = 0;
    const activeTab = document.querySelector(".nav-tabs a.nav-link.active");
    if (activeTab) {
      const activeIndex = tabs.indexOf(activeTab);
      if (activeIndex !== -1) {
        startIdx = reverse ? (activeIndex - 1 + tabs.length) % tabs.length : (activeIndex + 1) % tabs.length;
      }
    }
    let found = null;
    for (let i = 0; i < tabs.length; i++) {
      const idx = reverse ? (startIdx - i + tabs.length) % tabs.length : (startIdx + i) % tabs.length;
      const tab = tabs[idx];
      const tabText = tab.textContent.trim().toLowerCase();
      if (tabText.includes("invoice")) {
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
      if (tabText === "all items") {
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
  function clickNewButton() {
    const button = document.querySelector('.mb-3 [type="button"].btn.btn-secondary');
    if (button && isAllItemsTabActive()) {
      button.click();
      console.log("Clicked New button");
      return true;
    }
    return false;
  }
  function clickDeliveriesButton() {
    const button = document.querySelector(".btn.btn-outline-primary.mt-2[href]");
    if (button) {
      button.click();
      console.log("Clicked Deliveries button");
      return true;
    }
    return false;
  }
  function isAllItemsTabActive() {
    const activeTab = document.querySelector(".nav-tabs a.nav-link.active");
    if (activeTab) {
      const tabText = activeTab.textContent.trim().toLowerCase();
      return tabText === "all items";
    }
    return false;
  }

  // extension/src/services/orders-edit-keyboard-handler.js
  var OrdersEditKeyboardHandler = class extends BaseKeyboardHandler {
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
      if (super.processKey(e))
        return;
      const { key, ctrlKey, altKey } = e;
      if (this.vCtrl && !ctrlKey && !altKey) {
        if (key.toLowerCase() === "n") {
          clickNewButton();
          return;
        } else if (key.toLowerCase() === "d") {
          clickDeliveriesButton();
          return;
        } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
          clickTabByLetter(key);
          return;
        }
      }
    }
  };

  // extension/src/app/index.js
  var currentHandler = null;
  function initializeHandler() {
    if (currentHandler) {
      document.removeEventListener("keyup", currentHandler.keyUpListener);
      document.removeEventListener("keydown", currentHandler.keyDownListener);
      document.removeEventListener("click", currentHandler.clickListener);
    }
    const path = window.location.pathname.toLowerCase();
    const tablePages = ["/items", "/deliveries", "/orders", "/logs", "/users", "/pos", "/customers", "/vendors", "/vendorgroups"];
    if (path === "/account/login") {
      currentHandler = new LoginKeyboardHandler();
    } else if (path.startsWith("/orders/edit")) {
      currentHandler = new OrdersEditKeyboardHandler();
    } else if (tablePages.some((page) => path.startsWith(page))) {
      currentHandler = new TableKeyboardHandler();
    } else {
      currentHandler = new BaseKeyboardHandler();
    }
    currentHandler.keyUpListener = (e) => currentHandler.handleKeyUp(e);
    currentHandler.keyDownListener = (e) => currentHandler.handleKeyDown(e);
    currentHandler.clickListener = () => currentHandler.handleClick();
    document.addEventListener("keyup", currentHandler.keyUpListener);
    document.addEventListener("keydown", currentHandler.keyDownListener);
    document.addEventListener("click", currentHandler.clickListener);
    console.log("Keyboard shortcuts loaded for:", path);
  }
  initializeHandler();
  var lastPath = window.location.pathname;
  var observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      console.log("URL changed to:", lastPath);
      initializeHandler();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
