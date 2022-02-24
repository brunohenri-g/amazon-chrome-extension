let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: filterAllDroppedPrices,
    });
});

function filterAllDroppedPrices() {
    chrome.storage.sync.get("color", ({ color }) => {
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

        console.log(allPromotions.sort((a, b) => { return b.discount.match(/\d+/) - a.discount.match(/\d+/); }));
    });
}