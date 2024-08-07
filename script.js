// script.js

document.addEventListener("DOMContentLoaded", function() {
  const cachedData = localStorage.getItem('sheetData');
  if (cachedData) {
    console.log('Rendering cached data...');
    try {
      const parsedData = JSON.parse(cachedData);
      console.log('Parsed cached data:', parsedData);
      renderTable(parsedData);
    } catch (error) {
      console.error('Error parsing cached data:', error);
    }
  }
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwKJ6G65T3rM9ZVvkQvWQsr0PaLdczDPtdDT-wopwi18fvI8D6DNIVh2FrqnHXqeTG3/exec');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Fetched data:', result); // JSON 데이터 구조 확인
    localStorage.setItem('sheetData', JSON.stringify(result));
    console.log('Rendering fetched data...');
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
  const { tableData, backgrounds, fontColors, horizontalAlignments, verticalAlignments, fontWeights, fontStyles, borders, mergedCells } = data;
  console.log('Data:', tableData);
  console.log('Backgrounds:', backgrounds);
  console.log('FontColors:', fontColors);
  console.log('HorizontalAlignments:', horizontalAlignments);
  console.log('VerticalAlignments:', verticalAlignments);
  console.log('FontWeights:', fontWeights);
  console.log('FontStyles:', fontStyles);
  console.log('Borders:', borders);
  console.log('MergedCells:', mergedCells);

  if (!tableData || !backgrounds || !fontColors || !horizontalAlignments || !verticalAlignments || !fontWeights || !fontStyles || !borders || !mergedCells) {
    console.error('Invalid data structure:', data);
    return;
  }

  const table = document.getElementById('data-table');
  const fragment = document.createDocumentFragment();

  // 병합된 셀 정보를 매핑합니다.
  const mergeMap = {};
  mergedCells.forEach(cell => {
    mergeMap[`${cell.row}-${cell.column}`] = cell;
  });

  tableData.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
      const cellKey = `${rowIndex + 1}-${colIndex + 1}`;
      const td = document.createElement('td');
      let cellData = tableData[rowIndex][colIndex] || '';

      // 이미지 URL이 포함된 경우, 이미지 컨테이너로 감쌉니다.
      if (cellData.includes('<img')) {
        cellData = cellData.replace(
          /<img/g,
          '<div class="image-container"><img'
        ).replace(
          /<\/img>/g,
          '</img></div>'
        );
      }

      td.innerHTML = cellData.replace(/<a /g, '<a target="_parent" ');

      // 셀 배경색과 글꼴 색상 적용
      if (backgrounds[rowIndex] && backgrounds[rowIndex][colIndex]) {
        td.style.backgroundColor = backgrounds[rowIndex][colIndex];
      }
      if (fontColors[rowIndex] && fontColors[rowIndex][colIndex]) {
        td.style.color = fontColors[rowIndex][colIndex];
      }

      // 셀 정렬 적용
      if (horizontalAlignments[rowIndex] && horizontalAlignments[rowIndex][colIndex]) {
        td.style.textAlign = horizontalAlignments[rowIndex][colIndex];
      }
      if (verticalAlignments[rowIndex] && verticalAlignments[rowIndex][colIndex]) {
        td.style.verticalAlign = verticalAlignments[rowIndex][colIndex];
      }

      // 글자 스타일 적용
      if (fontWeights[rowIndex] && fontWeights[rowIndex][colIndex]) {
        td.style.fontWeight = fontWeights[rowIndex][colIndex];
      }
      if (fontStyles[rowIndex] && fontStyles[rowIndex][colIndex]) {
        const styles = fontStyles[rowIndex][colIndex].split(' ');
        if (styles.includes('italic')) {
          td.style.fontStyle = 'italic';
        }
        if (styles.includes('strikethrough')) {
          td.classList.add('strikethrough'); // 취소선 클래스 추가
        }
      }

      // 테두리 적용
      const border = borders[rowIndex][colIndex];
      if (border) {
        // 테두리가 존재하는 경우에만 설정
        if (border.top) {
          td.style.borderTop = '1px solid black';
        } else {
          td.style.borderTop = 'none';
        }
        if (border.right) {
          td.style.borderRight = '1px solid black';
        } else {
          td.style.borderRight = 'none';
        }
        if (border.bottom) {
          td.style.borderBottom = '1px solid black';
        } else {
          td.style.borderBottom = 'none';
        }
        if (border.left) {
          td.style.borderLeft = '1px solid black';
        } else {
          td.style.borderLeft = 'none';
        }
      } else {
        // 테두리 정보가 없으면 기본적으로 모두 제거
        td.style.borderTop = 'none';
        td.style.borderRight = 'none';
        td.style.borderBottom = 'none';
        td.style.borderLeft = 'none';
      }

      // 병합 정보 적용
      if (mergeMap[cellKey]) {
        const mergeInfo = mergeMap[cellKey];
        td.rowSpan = mergeInfo.numRows;
        td.colSpan = mergeInfo.numColumns;
        // 병합된 셀 범위 내의 나머지 셀들을 스킵합니다.
        for (let r = 0; r < mergeInfo.numRows; r++) {
          for (let c = 0; c < mergeInfo.numColumns; c++) {
            if (r !== 0 || c !== 0) {
              tableData[rowIndex + r][colIndex + c] = null;
            }
          }
        }
      }

      if (tableData[rowIndex][colIndex] !== null) {
        tr.appendChild(td);
      }
    });
    fragment.appendChild(tr);
  });

  table.innerHTML = ''; // 테이블 초기화
  table.appendChild(fragment);
}
