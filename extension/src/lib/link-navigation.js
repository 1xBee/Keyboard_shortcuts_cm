let currentLink = null;

export function getAllLinksWithPosition(selectors) {
  const rows = Array.from(document.querySelectorAll(selectors.rows));
  const linksWithPosition = [];
  
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll(selectors.cells));
    cells.forEach((cell, columnIndex) => {
      const links = Array.from(cell.querySelectorAll(selectors.links));
      links.forEach(link => {
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
  link.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function navigateLink(direction, selectors) {
  const linksWithPosition = getAllLinksWithPosition(selectors);
  
  if (!linksWithPosition.length) {
    console.log("No links found");
    return false;
  }

  let currentPosition = null;
  
  if (currentLink && document.contains(currentLink)) {
    currentPosition = linksWithPosition.find(item => item.link === currentLink);
  }

  if (!currentPosition) {
    currentLink = linksWithPosition[0].link;
    focusAndHighlightLink(currentLink);
    console.log("Started navigation from top");
    return true;
  }

  let newPosition = null;

  if (direction === "up" || direction === "down") {
    const sameColumnLinks = linksWithPosition.filter(item => 
      item.columnIndex === currentPosition.columnIndex
    );
    const currentIndexInColumn = sameColumnLinks.findIndex(item => 
      item.link === currentLink
    );

    if (direction === "up") {
      const newIndexInColumn = currentIndexInColumn > 0 
        ? currentIndexInColumn - 1 
        : sameColumnLinks.length - 1;
      newPosition = sameColumnLinks[newIndexInColumn];
    } else {
      const newIndexInColumn = currentIndexInColumn < sameColumnLinks.length - 1 
        ? currentIndexInColumn + 1 
        : 0;
      newPosition = sameColumnLinks[newIndexInColumn];
    }
  } else if (direction === "left" || direction === "right") {
    const currentRow = currentPosition.rowIndex;
    const availableColumns = [...new Set(linksWithPosition.map(item => 
      item.columnIndex
    ))].sort((a, b) => a - b);
    const currentColPosition = availableColumns.indexOf(currentPosition.columnIndex);
    
    let newColPosition;
    if (direction === "left") {
      newColPosition = currentColPosition > 0 
        ? currentColPosition - 1 
        : availableColumns.length - 1;
    } else {
      newColPosition = currentColPosition < availableColumns.length - 1 
        ? currentColPosition + 1 
        : 0;
    }
    
    const newColumnIndex = availableColumns[newColPosition];
    
    let sameRowNewColumn = linksWithPosition.find(item => 
      item.rowIndex === currentRow && item.columnIndex === newColumnIndex
    );
    
    if (sameRowNewColumn) {
      newPosition = sameRowNewColumn;
    } else {
      const newColumnLinks = linksWithPosition.filter(item => 
        item.columnIndex === newColumnIndex
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

export function resetLinkNavigation() {
  currentLink = null;
}