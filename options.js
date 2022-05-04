let priceListTable = document.getElementById("price-table");

function buildProductsTable() {
    chrome.storage.sync.get("mainStorage", (data) => {
        let prices = (data.mainStorage?.hasOwnProperty('prices') ? data.mainStorage.prices : []).sort((a, b) => { return b.discount.match(/\d+/) - a.discount.match(/\d+/); });

        for (let item of prices) {
            let productRow = document.createElement('tr');

            appendCellToTableRow(item.name, productRow);
            appendCellToTableRow(item.currentPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }), productRow);
            appendCellToTableRow(item.previousPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }), productRow);
            appendCellToTableRow(getLowestPrice(item).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }), productRow);
            appendCellToTableRow(getHighestPrice(item).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }), productRow);
            appendCellToTableRow(item.discount, productRow);
            appendCellToTableRow(item.history.length, productRow);
            appendCellToTableRow(createDeleteLink(item.name), productRow, 'link');

            priceListTable.append(productRow);
        }
    });
}

function createDeleteLink(itemName) {
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    const linkText = document.createTextNode('Deletar');
    deleteLink.appendChild(linkText);

    deleteLink.addEventListener("click", () => {
        chrome.storage.sync.get("mainStorage", (data) => {
            let prices = data.mainStorage?.prices ?? [];

            prices = prices.filter(a => a.name != itemName);

            chrome.storage.sync.set({ mainStorage: { prices } });

            window.location.reload();
        });
    });

    return deleteLink;
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

function appendCellToTableRow(value, tableRow, type = 'text') {
    if (type === 'text') {
        let cell = document.createElement('td');
        cell.innerText = value;
        tableRow.append(cell);
    }
    else if (type === 'link') {
        let cell = document.createElement('td');
        cell.appendChild(value);
        tableRow.append(cell);
    }
}

buildProductsTable();


// // Reacts to a button click by marking the selected button and saving
// // the selection
// function handleButtonClick(event) {
//     // Remove styling from the previously selected color
//     let current = event.target.parentElement.querySelector(
//         `.${selectedClassName}`
//     );
//     if (current && current !== event.target) {
//         current.classList.remove(selectedClassName);
//     }

//     // Mark the button as selected
//     let color = event.target.dataset.color;
//     event.target.classList.add(selectedClassName);
//     chrome.storage.sync.set({ color });
// }