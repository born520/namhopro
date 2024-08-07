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
    localStorage.setItem('sheetData', JSON.stringify(result)); // 캐시된 데이터 저장
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
  table.innerHTML = ''; // 초기화

  data.tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cellData, colIndex) => {
      const td = document.createElement('td');
      td.innerHTML = cellData; // 셀 데이터 렌더링
      applyStyles(td, rowIndex, colIndex, data);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function applyStyles(td, rowIndex, colIndex, data) {
  const styles = data.fontStyles[rowIndex][colIndex];
  const borders = data.borders[rowIndex][colIndex];
  
  td.style.backgroundColor = data.backgrounds[rowIndex][colIndex];
  td.style.color = data.fontColors[rowIndex][colIndex];
  td.style.textAlign = data.horizontalAlignments[rowIndex][colIndex];
  td.style.verticalAlign = data.verticalAlignments[rowIndex][colIndex];
  td.style.fontWeight = data.fontWeights[rowIndex][colIndex];
  td.style.fontSize = data.fontSizes[rowIndex][colIndex] + 'px';

  // 취소선 적용
  if (styles.includes('strikethrough')) {
    td.classList.add('strikethrough');
  }

  // 테두리 적용
  applyBorderStyles(td, borders);
}

function applyBorderStyles(td, borders) {
  if (borders) {
    td.style.borderTop = borders.top ? '1px solid black' : 'none';
    td.style.borderRight = borders.right ? '1px solid black' : 'none';
    td.style.borderBottom = borders.bottom ? '1px solid black' : 'none';
    td.style.borderLeft = borders.left ? '1px solid black' : 'none';
  } else {
    // 테두리 정보가 없는 경우 모든 테두리를 제거
    td.style.borderTop = 'none';
    td.style.borderRight = 'none';
    td.style.borderBottom = 'none';
    td.style.borderLeft = 'none';
  }
}
