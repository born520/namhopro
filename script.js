// script.js

document.addEventListener("DOMContentLoaded", function() {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwKJ6G65T3rM9ZVvkQvWQsr0PaLdczDPtdDT-wopwi18fvI8D6DNIVh2FrqnHXqeTG3/exec');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    localStorage.setItem('sheetData', JSON.stringify(result));
    renderTable(result);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable(data) {
  if (data.error) {
    console.error('Error in data:', data.error);
    return;
  }
  const table = document.getElementById('data-table');
  table.innerHTML = ''; // Clear any existing content

  const mergeMap = {};
  data.mergedCells.forEach(cell => {
    mergeMap[`${cell.row}-${cell.column}`] = cell;
  });

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cellData, colIndex) => {
      const cellKey = `${rowIndex + 1}-${colIndex + 1}`;
      if (mergeMap[cellKey]) {
        const mergeInfo = mergeMap[cellKey];
        const td = document.createElement('td');
        td.innerHTML = cellData; // Insert cell data as HTML
        td.rowSpan = mergeInfo.numRows;
        td.colSpan = mergeInfo.numColumns;
        applyStyles(td, rowIndex, colIndex, data);
        tr.appendChild(td);
        // Skip the cells that are part of the merge
        for (let r = 0; r < mergeInfo.numRows; r++) {
          for (let c = 0; c < mergeInfo.numColumns; c++) {
            if (r !== 0 || c !== 0) {
              row[colIndex + c] = null;
            }
          }
        }
      } else if (row[colIndex] !== null) {
        const td = document.createElement('td');
        td.innerHTML = cellData;
        applyStyles(td, rowIndex, colIndex, data);
        tr.appendChild(td);
      }
    });
    table.appendChild(tr);
  });
}

function applyStyles(td, rowIndex, colIndex, data) {
  td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
  td.style.color = data.fontColors[rowIndex][colIndex] || '';
  td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'left';
  td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'top';
  td.style.fontWeight = data.fontWeights[rowIndex][colIndex] || 'normal';
  td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 12) + 'px';

  if (data.fontStyles[rowIndex][colIndex].includes('strikethrough')) {
    td.classList.add('strikethrough');
  }

  applyBorderStyles(td);
}

function applyBorderStyles(td) {
  // 모든 셀의 테두리를 항상 표시
  td.style.borderTop = '1px solid black';
  td.style.borderRight = '1px solid black';
  td.style.borderBottom = '1px solid black';
  td.style.borderLeft = '1px solid black';
}
