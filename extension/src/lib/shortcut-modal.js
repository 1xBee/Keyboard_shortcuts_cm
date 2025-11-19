// src/lib/shortcut-modal.js

const MODAL_STYLES = `
  .kb-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    animation: kbFadeIn 0.15s ease-out;
  }
  .kb-modal {
    background: white; width: 90%; max-width: 500px;
    border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow: hidden; max-height: 80vh; display: flex; flex-direction: column;
  }
  .kb-header {
    padding: 20px 24px; border-bottom: 1px solid #e5e7eb;
    display: flex; justify-content: space-between; align-items: center;
  }
  .kb-title { font-size: 18px; font-weight: 600; color: #111827; margin: 0; }
  .kb-close { font-size: 13px; color: #6b7280; }
  .kb-body { overflow-y: auto; }
  .kb-row {
    display: flex; gap: 16px; padding: 14px 24px; border-bottom: 1px solid #f3f4f6;
    align-items: center;
  }
  .kb-row:last-child { border-bottom: none; }
  .kb-row:hover { background: #f9fafb; }
  .kb-key {
    min-width: 32px; height: 28px; padding: 0 8px;
    background: linear-gradient(180deg, #fff 0%, #f3f4f6 100%);
    border: 1px solid #d1d5db; border-radius: 6px;
    box-shadow: 0 2px 0 #d1d5db, inset 0 1px 0 #fff;
    font: 600 12px/28px ui-monospace, monospace;
    color: #374151; text-align: center; display: inline-block;
  }
  .kb-desc { flex: 1; }
  .kb-action { font-weight: 500; color: #111827; margin-bottom: 2px; }
  .kb-detail { font-size: 13px; color: #6b7280; }
  @keyframes kbFadeIn { from { opacity: 0; transform: scale(0.96); } }
`;

export function injectModalStyles() {
  if (document.getElementById('kb-help-styles')) return;
  const style = document.createElement('style');
  style.id = 'kb-help-styles';
  style.textContent = MODAL_STYLES;
  document.head.appendChild(style);
}

export function createModal(shortcutData) {
  if (document.getElementById('kb-shortcut-modal')) return;

  let rowsHtml = '';
  shortcutData.modes.forEach(mode => {
    mode.shortcuts.forEach(sc => {
      rowsHtml += `
        <div class="kb-row">
          <kbd class="kb-key">${sc.key}</kbd>
          <div class="kb-desc">
            <div class="kb-action">${sc.action}</div>
            <div class="kb-detail">${sc.description}</div>
          </div>
        </div>
      `;
    });
  });

  const modalHtml = `
    <div id="kb-shortcut-modal" class="kb-modal-overlay">
      <div class="kb-modal">
        <div class="kb-header">
          <h3 class="kb-title">${shortcutData.name} Shortcuts</h3>
          <span class="kb-close">Press Esc to close</span>
        </div>
        <div class="kb-body">${rowsHtml}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

export function removeModal() {
  document.getElementById('kb-shortcut-modal')?.remove();
}