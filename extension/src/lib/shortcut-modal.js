// extension/src/lib/shortcuts-modal.js

const MODAL_ID = 'keyboard-shortcuts-modal';
const BACKDROP_ID = 'keyboard-shortcuts-backdrop';

let modalElement = null;
let backdropElement = null;

/**
 * Show the keyboard shortcuts modal
 * @param {Object} shortcutInfo - The shortcut information from getShortcutInfo()
 */
export function showShortcutsModal(shortcutInfo) {
  // If modal already exists, just show it
  if (modalElement) {
    modalElement.style.display = 'block';
    backdropElement.style.display = 'block';
    // Force reflow before adding show class for animation
    modalElement.offsetHeight;
    backdropElement.offsetHeight;
    modalElement.classList.add('show');
    backdropElement.classList.add('show');
    document.body.classList.add('modal-open');
    return;
  }

  // Create modal
  modalElement = createModalElement(shortcutInfo);
  backdropElement = createBackdropElement();

  // Inject into page
  document.body.appendChild(backdropElement);
  document.body.appendChild(modalElement);
  document.body.classList.add('modal-open');

  // Set display and force reflow, then animate
  modalElement.style.display = 'block';
  backdropElement.style.display = 'block';
  modalElement.offsetHeight; // Force reflow
  
  modalElement.classList.add('show');
  backdropElement.classList.add('show');

  // Add event listeners
  addEventListeners();
}

/**
 * Hide the keyboard shortcuts modal
 */
export function hideShortcutsModal() {
  if (!modalElement) return;

  // Hide with animation
  modalElement.classList.remove('show');
  backdropElement.classList.remove('show');

  setTimeout(() => {
    if (modalElement) { // Check if still exists
      modalElement.style.display = 'none';
      backdropElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Clean up
      removeEventListeners();
      modalElement.remove();
      backdropElement.remove();
      modalElement = null;
      backdropElement = null;
    }
  }, 150);
}


/**
 * Create the modal element
 */
function createModalElement(shortcutInfo) {
  const modal = document.createElement('div');
  modal.id = MODAL_ID;
  modal.className = 'modal fade';
  modal.tabIndex = -1;
  modal.setAttribute('role', 'dialog');
  
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

/**
 * Create the backdrop element
 */
function createBackdropElement() {
  const backdrop = document.createElement('div');
  backdrop.id = BACKDROP_ID;
  backdrop.className = 'modal-backdrop fade';
  return backdrop;
}

/**
 * Generate HTML for all modes
 */
/**
 * Generate HTML for all modes
 */
function generateModesHTML(modes) {
  return modes.map(mode => {
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
  }).join('');
}

/**
 * Generate HTML for shortcuts list
 */
function generateShortcutsHTML(shortcuts) {
  return shortcuts.map(shortcut => `
    <tr>
      <td>${formatKeys(shortcut.key)}</td>
      <td><strong>${shortcut.action}</strong></td>
      <td class="text-muted">${shortcut.description}</td>
    </tr>
  `).join('');
}

/**
 * Format keyboard keys with <kbd> tags
 */
function formatKeys(keyString) {
  // Split by + and wrap each part in <kbd>
  return keyString
    .split('+')
    .map(key => `<kbd class="bg-white border border-dark text-dark rounded-2 fw-bold shadow-sm">${key.trim()}</kbd>`)
    .join(' + ');
}

/**
 * Add event listeners for closing modal
 */
function addEventListeners() {
  // Close button
  const closeButtons = modalElement.querySelectorAll('[data-dismiss="modal"]');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', hideShortcutsModal);
  });

  // Escape key
  document.addEventListener('keydown', handleEscapeKey);

  // Click outside (backdrop) - but not modal content
  backdropElement.addEventListener('click', hideShortcutsModal);
  
  // Stop propagation when clicking modal content
  const modalDialog = modalElement.querySelector('.modal-dialog');
  if (modalDialog) {
    modalDialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

/**
 * Remove event listeners
 */
function removeEventListeners() {
  document.removeEventListener('keydown', handleEscapeKey);
  if (backdropElement) {
    backdropElement.removeEventListener('click', hideShortcutsModal);
  }
}

/**
 * Handle escape key press
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    hideShortcutsModal();
  }
}