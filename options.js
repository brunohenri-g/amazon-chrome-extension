let priceListTable = document.getElementById("price-table");

function buildProductsTable() {
    chrome.storage.sync.get("mainStorage", (data) => {
        console.log(data);
        let prices = data.mainStorage.hasOwnProperty('prices') ? data.mainStorage.prices : [];

        for (let item of prices) {
            let productRow = document.createElement('tr');

            appendCellToTableRow(item.name, productRow);
            appendCellToTableRow(item.currentPrice, productRow);
            appendCellToTableRow(item.previousPrice, productRow);
            appendCellToTableRow('Em Desenvolvimento', productRow);
            appendCellToTableRow(item.discount, productRow);

            priceListTable.append(productRow);
        }
    });
}

function appendCellToTableRow(value, tableRow) {
    let cell = document.createElement('td');
    cell.innerText = value;
    tableRow.append(cell);
}

buildProductsTable();