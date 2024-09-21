// Global variables for price and cid
let price = 19.5; // Example price
let cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0]
];

function compute() {
    var price_display = document.getElementById("price");
    price_display.textContent = ""; // Reset the previous price display
    var price_element = document.createElement("h3");
    price_element.textContent = `The price is $${price}`;
    price_display.append(price_element);

    // Get customer money input
    var cm = parseFloat(document.getElementById("cash").value);

    if (!cm) {
        alert("Please enter a value");
        return;
    } else if (cm < price) {
        alert("Customer does not have enough money to purchase the item");
    } else if (cm === price) {
        document.getElementById("change-due").textContent = "No change due - customer paid with exact cash";
    } else if (cm > price) {
        let change = cm - price;
        let result = getChange(cid, change);

        if (result.status === "INSUFFICIENT_FUNDS") {
            document.getElementById("change-due").textContent = "Status: INSUFFICIENT_FUNDS";
        } else if (result.status === "CLOSED") {
            document.getElementById("change-due").textContent = `Status: CLOSED ${formatChange(result.change)}`;
        } else {
            document.getElementById("change-due").textContent = `Status: OPEN ${formatChange(result.change)}`;
        }
    }
}

function reset() {
    document.getElementById("price").textContent = '';
    document.getElementById("cash").value = '';
    document.getElementById("change-due").textContent = '';
}




function getChange(cid, change) {
    let currencyUnits = [
        ["PENNY", 0.01],
        ["NICKEL", 0.05],
        ["DIME", 0.1],
        ["QUARTER", 0.25],
        ["ONE", 1],
        ["FIVE", 5],
        ["TEN", 10],
        ["TWENTY", 20],
        ["ONE HUNDRED", 100]
    ];

    // Calculate the total cash in the drawer
    let totalCid = cid.reduce((total, denomination) => total + denomination[1], 0).toFixed(2);

    // If total cash in drawer is less than the change required, return insufficient funds
    if (parseFloat(totalCid) < change) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    // If total cash in drawer equals the change required, return all the cash and close the drawer
    if (parseFloat(totalCid) === change) {
        return { status: "CLOSED", change: cid };
    }

    // Initialize an array to hold the change to be given back
    let changeArr = [];
    
    // Iterate over each currency unit from highest to lowest
    for (let i = currencyUnits.length - 1; i >= 0; i--) {
        let currencyName = currencyUnits[i][0];
        let currencyValue = currencyUnits[i][1];
        let availableAmount = cid[i][1];
        let amountToGive = 0;

        // While the change is greater than or equal to the currency value and there is enough in the drawer
        while (change >= currencyValue && availableAmount >= currencyValue) {
            change -= currencyValue;
            change = Math.round(change * 100) / 100; // Avoid floating point issues
            availableAmount -= currencyValue;
            amountToGive += currencyValue;
        }

        // If we gave any amount of this currency, add it to the change array
        if (amountToGive > 0) {
            changeArr.push([currencyName, amountToGive]);
        }
    }

    // If after calculating the change, we still owe money, return insufficient funds
    if (change > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    // Otherwise, we can return the correct change and the status is OPEN
    return { status: "OPEN", change: changeArr };
}






function formatChange(changeArray) {
    return changeArray
        .filter(item => item[1] > 0) // Only include denominations with non-zero values
        .map(item => `${item[0]}: $${item[1].toFixed(2)}`) // Format the remaining denominations
        .join(" ");
}
