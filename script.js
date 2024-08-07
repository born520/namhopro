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

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cellData, colIndex) => {
      const td = document.createElement('td');
      td.innerHTML = cellData; // Insert cell data as HTML
      applyStyles(td, rowIndex, colIndex, data);
      tr.appendChild(td);
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

  applyBorderStyles(td, data.borders[rowIndex][colIndex]);
}

function applyBorderStyles(td, borders) {
  if (borders) {
    td.style.borderTop = borders.top ? '1px solid black' : 'none';
    td.style.borderRight = borders.right ? '1px solid black' : 'none';
    td.style.borderBottom = borders.bottom ? '1px solid black' : 'none';
    td.style.borderLeft = borders.left ? '1px solid black' : 'none';
  } else {
    td.style.borderTop = 'none';
    td.style.borderRight = 'none';
    td.style.borderBottom = 'none';
    td.style.borderLeft = 'none';
  }
}
