function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
  const headers = lines[0].split(',');
  const dataRows = lines.slice(1);
  return { headers, dataRows };
}

function buildTable(headers, dataRows) {
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  // Create the header row
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText.trim();
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);

  // Create data rows
  dataRows.forEach(row => {
    const rowElement = document.createElement('tr');
    const cells = row.split(',');
    cells.forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText.trim();
      rowElement.appendChild(td);
    });
    tableBody.appendChild(rowElement);
  });
}

async function fetchAndBuildTable() {
  const loading = document.getElementById('loading');
  const table = document.getElementById('spellingTable');
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  loading.style.display = 'block';
  table.style.display = 'none';
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  try {
    const response = await fetch('/api/spelling-list');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const csv = await response.text();

    const { headers, dataRows } = parseCSV(csv);
    buildTable(headers, dataRows);

    loading.style.display = 'none';
    table.style.display = 'table';
  } catch (error) {
    console.error(error);
    loading.textContent = 'Error loading spelling list.';
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await fetchAndBuildTable();

  const regenerateButton = document.getElementById('regenerateButton');
  regenerateButton.addEventListener('click', fetchAndBuildTable);
});
