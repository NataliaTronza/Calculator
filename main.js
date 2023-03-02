const storage = document.querySelector('#storage');
const transfer = document.querySelector('#transfer');
const storageNum = document.querySelector('#storageNum');
const transferNum = document.querySelector('#transferNum');
const lines = document.querySelectorAll('.line');
const costs = document.querySelectorAll('.price');
const radiosBunny = document.querySelectorAll('.bunnyRadio');
const radiosScaleway = document.querySelectorAll('.scaleRadio');
const storageStart = document.querySelector('#storageStart');
const storageEnd = document.querySelector('#storageEnd');
const transferStart = document.querySelector('#transferStart');
const transferEnd = document.querySelector('#transferEnd');
const radioForms = [[], radiosBunny, radiosScaleway, []]

storageStart.innerText = storageNum.min;
storageEnd.innerText = storageNum.max;
transferStart.innerText = transferNum.min;
transferEnd.innerText = transferNum.max;

// const mediaQuery = window.matchMedia('(min-width: 950px)');
// mediaQuery.addListener(setData)

const prices = [
  {
    company: "backblaze",
    storagePrice: 0.005,
    transferPrice: 0.01,
    minPay: 7,
    color: "#FF0000"
  },
  {
    company: "bunny",
    storagePrice: {
      hdd: 0.01,
      ssd: 0.02
    },
    transferPrice: 0.01,
    maxPay: 10,
    color: "#FF9900"
  },
  {
    company: "scaleway",
    storagePrice: {
      multi: {
        freeLimit: 75,
        price: 0.06
      },
      single: {
        freeLimit: 75,
        price: 0.03
      }
    },
    transferPrice: {
      freeLimit: 75,
      price: 0.02
    },
    color: "#FF14FF"
  },
  {
    company: "vultr",
    storagePrice: 0.01,
    transferPrice: 0.01,
    minPay: 5,
    color: "#5A91EA"
  }
]

const radioValues = [];

for (let i = 0; i < radioForms.length; i++) {
  if (radioForms[i].length > 0) {
    radioValues.push(isChecked(radioForms[i]));
    for (let input of radioForms[i]) {
      input.addEventListener('input', function () {
        radioValues[i] = this.value
      })
      input.addEventListener('input', storageCounter);
      input.addEventListener('input', transferCounter);
    }
  } else {
    radioValues.push('')
  }
}

// console.log(radioValues)
let screenSize;
function getScreenSize() {
  if (window.matchMedia("(min-width: 950px)").matches) {
    screenSize = 'desktop'
  } else {
    screenSize = 'mobile'
  }
  for (let i = 0; i < lines.length; i++) {
    if (screenSize === 'desktop') {
      lines[i].style.height = '18px';
      lines[i].style.width = 'unset';
    } else {
      lines[i].style.width = '18px';
      lines[i].style.height = 'unset'
    }
  }
}

getScreenSize();
window.addEventListener('resize', (e) => {
  getScreenSize();
});

// const screenSize = getScreenSize()

const finalCost = []
let storageResult = [0, 0, 0, 0];
let transferResult = [0, 0, 0, 0];

function storageCounter() {
  let value = storageNum.value
  storage.innerHTML = value
  storageResult = prices.map((elem, i) => {
    return countStoragePrice(elem, value, i)
  })

  let sum = getSum(storageResult, transferResult);

  setData(sum, lines)
}

function transferCounter() {
  let value = transferNum.value
  transfer.innerHTML = value;
  transferResult = prices.map(elem => {
    return countTransferPrice(elem, value)
  })
  let sum = getSum(storageResult, transferResult);
  setData(sum, lines)
}

storageNum.oninput = storageCounter;
transferNum.oninput = transferCounter;

function countStoragePrice(elem, value, i) {
  let price;
  let newValue = value;
  if (typeof elem.storagePrice === 'object') {
    for (let key in elem.storagePrice) {
      if (key === radioValues[i]) {
        if (typeof elem.storagePrice[key] === 'object') {
          price = elem.storagePrice[key].price;
          newValue = value - elem.storagePrice[key].freeLimit;
          if (newValue < 0) {
            newValue = 0
          }
          // console.log(newValue)
          // if (value <= elem.storagePrice[key].freeLimit) {
          //   price = 0
          // } else {
          //   price = elem.storagePrice[key].price
          // }
        } else {
          price = elem.storagePrice[key]
        }

      }
    }
    // totalPrice = price*value;
  } else {
    price = elem.storagePrice;
    // totalPrice = elem.storagePrice*value;
  }
  const totalPrice = price * newValue;
  // console.log("totalPrice:",totalPrice)
  return totalPrice
}


function countTransferPrice(elem, value) {
  let price;
  let newValue = value
  if (typeof elem.transferPrice === 'object') {
    price = elem.transferPrice.price;
    newValue = value - elem.transferPrice.freeLimit;
    if (newValue < 0) {
      newValue = 0
    }
    // if (value <= elem.transferPrice.freeLimit) {
    //   price = 0
    // } else {
    //   price = elem.transferPrice.price
    // }
  } else {
    price = elem.transferPrice;
  }
  const totalPrice = price * newValue;
  return totalPrice;
}

function getSum(arr1, arr2) {
  let sum = [];
  for (let i = 0; i < arr1.length; i++) {
    sum.push(arr1[i] + arr2[i])
  }
  return sum;
}

function setData(price, elems) {
  for (let i = 0; i < price.length; i++) {
    if (prices[i].minPay) {
      if (price[i] < prices[i].minPay && price[i] > 0) {
        price[i] = prices[i].minPay;
      }
    }
    if (prices[i].maxPay) {
      if (price[i] > prices[i].maxPay) {
        price[i] = prices[i].maxPay;
      }
    }
    finalCost[i] = price[i];
    // elems[i].style.width = `${price[i] * 5}px`;
    if (screenSize === 'desktop') {
      elems[i].style.width = `${price[i] * 5}px`;
      /* the viewport is at least 400 pixels wide */
      console.log('950 and more')
    } else {
      elems[i].style.height = `${price[i] * 5}px`;
      console.log('950 and less')
      /* the viewport is less than 400 pixels wide */
    }
    costs[i].innerText = price[i].toFixed(2) + '$';
  }
  const min = getMinIndex(finalCost);
  for (let i = 0; i < elems.length; i++) {
    if (i === min) {
      elems[i].style.backgroundColor = prices[i].color;
    } else {
      elems[i].style.backgroundColor = 'grey';
    }
  }
  // elems[min].style.backgroundColor = 'blue';
  // const newElems = elems.filter((elem, i) => i !== min);
  // console.log(newElems)
  // for (let i = 0; i < newElems.lenght; i++) {

  // }
}

function isChecked(arr) {
  let radioValue;
  for (let elem of arr) {
    if (elem.checked) {
      radioValue = elem.value
    }
  }
  return radioValue
}

function getMinIndex(arr) {
  let result = 0;
  let min = arr[result]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
      result = i
    }
  }
  return result
}

console.log(getMinIndex([3, 56, 1, 8, 56]))

