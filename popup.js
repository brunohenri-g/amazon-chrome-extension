let refreshPriceButton = document.getElementById("refreshPriceButton");

refreshPriceButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: filterAllDroppedPrices,
    });
});

function filterAllDroppedPrices() {
    let prices = [];

    chrome.storage.sync.get("mainStorage", (data) => {
        console.log(data);
        prices = data.mainStorage.prices;
    });

    const allDropPrices = [...document.querySelectorAll("#g-items li.g-item-sortable div.itemPriceDrop")];
    let allPromotions = [];

    for (let i = 0; i < allDropPrices.length; i++) {
        const dropPriceElement = allDropPrices[i];

        const spanDropPrice = dropPriceElement.querySelector('[id^=itemPriceDrop_]');
        const nameOfProduct = dropPriceElement.closest('div.a-column').querySelector('div > h2 > a').innerText;
        const currentPrice = dropPriceElement.closest('div.a-column').querySelector('span.a-offscreen').innerText.match(/[\d]*,[\d]*/)[0];
        const previousPrice = dropPriceElement.innerText.match(/[\d]*,[\d]*/)[0];

        if (!spanDropPrice.innerText.startsWith('Queda')) {
            const discount = spanDropPrice.innerText.trim().replace(/^(\D*)/, '');
            allPromotions.push({ name: nameOfProduct, currentPrice, previousPrice, discount });
        }
    }

    prices.push(...allPromotions.sort((a, b) => { return b.discount.match(/\d+/) - a.discount.match(/\d+/); }));

    chrome.storage.sync.set({ mainStorage: { prices } });
}