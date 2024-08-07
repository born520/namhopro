document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem('sheetData')) {
    fetchData();
  } else {
    const cachedData = JSON.parse(localStorage.getItem('sheetData'));
    renderTable(cachedData);
  }
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
  const fragment = document.createDocumentFragment(); // 최적화를 위해 DocumentFragment 사용

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cellData, colIndex) => {
      const td = document.createElement('td');
      td.innerHTML = cellData;
      applyStyles(td, rowIndex, colIndex, data);
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  table.innerHTML = '';
  table.appendChild(fragment); // 한 번에 DOM에 추가
}

function applyStyles(td, rowIndex, colIndex, data) {
  // 스타일 적용
  td.style.backgroundColor = data.backgrounds[rowIndex][colIndex] || '';
  td.style.color = data.fontColors[rowIndex][colIndex] || '';
  td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex] || 'left';
  td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex] || 'top';
  td.style.fontWeight = data.fontWeights[rowIndex][colIndex] || 'normal';
  td.style.fontSize = (data.fontSizes[rowIndex][colIndex] || 12) + 'px';
  applyBorderStyles(td);
}

function applyBorderStyles(td) {
  td.style.border = '1px solid black';
}
