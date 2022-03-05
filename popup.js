let refreshPriceButton = document.getElementById("refreshPriceButton");
let clearStorageButton = document.getElementById("clearStorageButton");

refreshPriceButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: filterAllDroppedPrices,
    });
});

clearStorageButton.addEventListener("click", () => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ mainStorage: {} });
});

function filterAllDroppedPrices() {
    chrome.storage.sync.get("mainStorage", (data) => {
        let prices = data.mainStorage?.prices ?? [];

        const allDropPrices = [...document.querySelectorAll("#g-items li.g-item-sortable div.itemPriceDrop")];

        for (let i = 0; i < allDropPrices.length; i++) {
            const dropPriceElement = allDropPrices[i];

            const nameOfProduct = dropPriceElement.closest('div.a-column').querySelector('div > h2 > a').innerText;
            const existentProduct = prices.find(a => a.name == nameOfProduct);
            const spanDropPrice = dropPriceElement.querySelector('[id^=itemPriceDrop_]');
            const currentPrice = Number(dropPriceElement.closest('div.a-column').querySelector('span.a-offscreen').innerText.match(/[\d]*,[\d]*/)[0].replace('.', '').replace(',', '.'));
            const previousPrice = Number(dropPriceElement.innerText.match(/[\d]*,[\d]*/)[0].replace('.', '').replace(',', '.'));

            if (!spanDropPrice.innerText.startsWith('Queda')) {
                const discount = spanDropPrice.innerText.trim().replace(/^(\D*)/, '');

                if (!existentProduct)
                    prices.push({ name: nameOfProduct, currentPrice, previousPrice, discount, history: [{ date: Date.now(), price: currentPrice }] });
                else if (currentPrice != existentProduct.currentPrice) {
                    //remover objeto ja existente do array
                    prices = prices.filter(a => a.name != nameOfProduct);

                    existentProduct.history.push({ date: Date.now(), price: currentPrice });
                    existentProduct.currentPrice = currentPrice;
                    existentProduct.previousPrice = previousPrice;

                    prices.push(existentProduct);
                }
            }
        }
        chrome.storage.sync.set({ mainStorage: { prices } });
    });

}

