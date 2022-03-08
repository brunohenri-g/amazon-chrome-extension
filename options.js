let priceListTable = document.getElementById("price-table");

function buildProductsTable() {
    chrome.storage.sync.get("mainStorage", (data) => {
        console.log(data.mainStorage);
        let prices = (data.mainStorage?.hasOwnProperty('prices') ? data.mainStorage.prices : []).sort((a, b) => { return b.discount.match(/\d+/) - a.discount.match(/\d+/); });

        for (let item of prices) {
            let productRow = document.createElement('tr');

            appendCellToTableRow(item.name, productRow);
            appendCellToTableRow(item.currentPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}), productRow);
            appendCellToTableRow(item.previousPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}), productRow);
            appendCellToTableRow(getLowestPrice(item).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}), productRow);
            appendCellToTableRow(getHighestPrice(item).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}), productRow);
            appendCellToTableRow(item.discount, productRow);
            appendCellToTableRow(item.history.length, productRow);

            priceListTable.append(productRow);
        }
    });
}

function getLowestPrice(item) {
    let min = Number.MAX_SAFE_INTEGER;

    for (let history of item.history)
        if (history.price < min)
            min = history.price;

    return min;
}

function getHighestPrice(item) {
    let max = 0;

    for (let history of item.history)
        if (history.price > max)
            max = history.price;

    return max;
}

function appendCellToTableRow(value, tableRow) {
    let cell = document.createElement('td');
    cell.innerText = value;
    tableRow.append(cell);
}

buildProductsTable();