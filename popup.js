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
        const allDropPrices = [...document.querySelectorAll("#g-items li.g-item-sortable .itemPriceDrop")];
        let allPromotions = [];

        for (let i = 0; i < allDropPrices.length; i++) {
            let spanDropPrice = allDropPrices[i].querySelector('[id^=itemPriceDrop_]');

            if (!spanDropPrice.innerText.startsWith('Queda')) {
                const discount = spanDropPrice.innerText.trim().replace(/^(\D*)/, '');

                allPromotions.push(discount);
            }
        }

        console.log(allPromotions.sort((a, b) => { return b.match(/\d+/) - a.match(/\d+/); }));
    });
}