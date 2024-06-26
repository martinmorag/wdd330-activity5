import { doc } from 'prettier';
import ShoppingCart from './ShoppingCart.mjs';

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

function getItems() {
  const storage = getLocalStorage('so-cart');
  let result = 0;
  function getThingsDone() { 
    storage.forEach(item => {
      if (item.Quantity > 0) {
        result += item.Quantity;
      }
    });
  }
  getThingsDone(); 
  document.querySelector('.items').textContent =  result;
}


// helper to get parameter strings
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  //if there is a callback...call it and pass data
  if (callback) {
    callback(data);
  }
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#footer");
  
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);



  getItems();

  function checkQuantityChanges() {
    const storage = getLocalStorage('so-cart');
    storage.forEach(item => {
      const previousQuantity = item.Quantity;

      // Set up a setInterval to periodically check for changes in the Quantity property
      setInterval(() => {
        const currentStorage = getLocalStorage('so-cart');
        const currentItem = currentStorage.find(i => i.Id === item.Id);

        if (currentItem && currentItem.Quantity !== previousQuantity) {
          console.log(`Change detected in Quantity of item ${item.Id}`);
          // Call the function you want to execute upon Quantity change here
          getItems();
          // Update previousQuantity to reflect the change
          previousQuantity = currentItem.Quantity;
        }
      }, 100); // Adjust the interval as needed
    });
  }
  checkQuantityChanges();

  function checkCartChanges() {
    let previousCartLength = getLocalStorage('so-cart').length;

    // Set up a setInterval to periodically check for changes in the cart items
    setInterval(() => {
      const currentCartLength = getLocalStorage('so-cart').length;

      if (currentCartLength !== previousCartLength) {
        console.log('Change detected in cart items');
        // Call the function you want to execute upon cart change here
        getItems();
        // Update previousCartLength to reflect the change
        previousCartLength = currentCartLength;
      }
    }, 100); // Adjust the interval as needed
  }

  // Call the function to start checking for cart changes
  checkCartChanges();
}

// function to take a list of objects and a template and insert the objects as HTML into the DOM

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function alertMessage(message, scroll=true) {
  let alert = document.createElement("div");
  alert.classList.add("theAlert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;
  alert.addEventListener('click', function(e) {
    if(e.target.tagName == 'SPAN') { // how can we tell if they clicked on our X or on something else?  hint: check out e.target.tagName or e.target.innerText
      main.removeChild(this);
    }
  })
  const main = document.querySelector('main');
  main.prepend(alert);
  if(scroll)
    window.scrollTo(0,0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}
