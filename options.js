let priceListDiv = document.getElementById("price-list");

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

// Add a button to the page for each supplied color
function constructOptions() {
    chrome.storage.sync.get("mainStorage", (data) => {
        let prices = data.mainStorage.hasOwnProperty('prices') ? data.mainStorage.prices : [];

        for (let item of prices) {
            let itemList = document.createElement("p");
            itemList.innerText = item.name;
            priceListDiv.appendChild(itemList);
        }
    });
}

// Initialize the page by constructing the color options
constructOptions();