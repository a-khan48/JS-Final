let baseCurrency = document.getElementById("base-currency");
let currencyAmount = document.getElementById("amount");
let targetCurrency = document.getElementById("target-currency");
let convertedAmount = document.getElementById("converted-amount");
let historicalRates = document.getElementById("historical-rates-container");
let historicalRatesBtn = document.getElementById("historical-rates");
let saveFavBtn = document.getElementById("save-favorite");
let favCurrencyPairs = document.getElementById("favorite-currency-pairs");

const myHeaders = new Headers();
myHeaders.append("apikey", "fgEZVjcyAc0FVYVdWGJS0VJuGLn4VSvq");

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
function fetchAvailableCurrencies() {
  fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then(response => response.json())
    .then(result => {CurrencyDropdownSymbols(result.symbols);
    })
    .catch(error => console.log('unable to fetch available currencies', error));
}

function CurrencyDropdownSymbols(symbols) {
  for (const currencySymbol in symbols) {
    const option = document.createElement("option");

    option.value = currencySymbol;
    option.text = `${currencySymbol} - ${symbols[currencySymbol]}`;
    baseCurrency.add(option.cloneNode(true));
    targetCurrency.add(option);
  }
}

function Conversion() {
    let from = baseCurrency.value;
    let to = targetCurrency.value;
    let amount = currencyAmount.value;
    let url = `https://api.apilayer.com/exchangerates_data/convert?from=${from}&to=${to}&amount=${amount}`;
  
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {

        if (result.success) {
      let targetCurrencyName = targetCurrency.options[targetCurrency.selectedIndex].text.split(" - ")[1];
          convertedAmount.textContent = `${result.result.toFixed(2)} ${targetCurrencyName}`;
        } else {
          convertedAmount.textContent = "Error"
          console.error('Conversion error', result.error);
        }
      })
      .catch(error => console.log('unable to fetch conversion data', error));
  }

  historicalRatesBtn.addEventListener("click", fetchHistoricalRates);
  
  function fetchHistoricalRates() {
    let from = baseCurrency.value;
    let to = targetCurrency.value;
    let date = "2021-01-01"; 
    let url = `https://api.apilayer.com/exchangerates_data/${date}?symbols=${to}&base=${from}`;
  
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let rate = Object.values(result.rates)[0];
        let baseCurrencyName = baseCurrency.options[baseCurrency.selectedIndex].text.split(" - ")[1];
        let targetCurrencyName = targetCurrency.options[targetCurrency.selectedIndex].text.split(" - ")[1];
        historicalRates.textContent = `Historical exchange rate on ${date}:  ${baseCurrencyName} = ${rate.toFixed(2)} ${targetCurrencyName}`;
      })
      .catch(error => console.log('unable to fetch historical rates', error));
  }

  saveFavBtn.addEventListener("click", () => {
    let from = baseCurrency.value;
    let to = targetCurrency.value;
    const newBtn = document.createElement("button");

    favCurrencyPairs.append(newBtn);
    newBtn.innerText = `${from}/${to}`;
    newBtn.addEventListener("click", () => {
      Conversion(from, to, amount.value);
      baseCurrency.value = from;
      targetCurrency.value = to;
    });
  });

  document.addEventListener("DOMContentLoaded", function() {
    fetchAvailableCurrencies();
  });
  currencyAmount.addEventListener("input", Conversion);
  baseCurrency.addEventListener("change", Conversion);
  targetCurrency.addEventListener("change", Conversion);