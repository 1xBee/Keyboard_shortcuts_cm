let statusIndicator = null;

export function createStatusIndicator() {
  if (document.getElementById('nav-status-indicator')) return;
  
  statusIndicator = document.createElement('div');
  statusIndicator.id = 'nav-status-indicator';
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

export function showGreenLight() {
  if (!statusIndicator) return;
  statusIndicator.style.display = 'block';
  statusIndicator.style.backgroundColor = '#4caf50';
  statusIndicator.style.borderColor = '#4caf50';
  statusIndicator.style.boxShadow = '0 2px 10px rgba(76, 175, 80, 0.5)';
  statusIndicator.title = 'Virtual Ctrl Mode Active';
}

export function showOrangeLight() {
  if (!statusIndicator) return;
  statusIndicator.style.display = 'block';
  statusIndicator.style.backgroundColor = '#ff9800';
  statusIndicator.style.borderColor = '#ff9800';
  statusIndicator.style.boxShadow = '0 2px 10px rgba(255, 152, 0, 0.5)';
  statusIndicator.title = 'Link Navigation Mode Active';
}

export function hideLight() {
  if (!statusIndicator) return;
  statusIndicator.style.display = 'none';
  statusIndicator.title = '';
}