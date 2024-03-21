import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="remove-item" data-id="${item.Id}">X</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__quantity">
    <p class="item-quantity">qty: ${item.Quantity}</p>
    <div class="inc-and-dec">
      <button class="increase-button">Increase</button>
      <button class="decrease-button">Decrease</button>
    </div>
  </div>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

export function countProducts(item) {
  return parseFloat(item.FinalPrice);
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
    this.total = 0;
  }
  async init() {
    const list = getLocalStorage(this.key);
    this.getTotal(list);
    this.renderCartContents(list);
  }
  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(this.parentSelector).innerHTML = htmlItems.join("");
    /* remove item from cart */  
    document.querySelectorAll('.remove-item').forEach(item => {
      item.addEventListener('click', () => {
        const itemId = item.dataset.id;
        let cartItems = getLocalStorage(this.key);

        if (!Array.isArray(cartItems)) {
          cartItems = [];
        }

        cartItems = cartItems.filter(cartItem => cartItem.Id !== itemId);
        setLocalStorage(this.key, cartItems);

        // Re-render cart contents after removing item
        this.renderCartContents();
      });
    });
    /* increase and decrease items */
    document.querySelectorAll('.increase-button').forEach((button, index) => {
      button.addEventListener('click', () => {
        this.increaseQuantity(index);
      });
    });

    document.querySelectorAll('.decrease-button').forEach((button, index) => {
      button.addEventListener('click', () => {
        this.decreaseQuantity(index);
      });
    });
  }
  getTotal(list) {
    const amounts = list.map((item) => item.FinalPrice);
    this.total = amounts.reduce((sum, item) => sum + item);
  }
  /*getTotal() {
    const cartItems = getLocalStorage(this.key);
    const items = Array.isArray(cartItems) ? cartItems : [cartItems];

    // Sum up the final prices of all items using reduce
    const total = items.reduce((acc, item) => acc + countProducts(item), 0);

    return total;
  }*/
  /* increase and decrease function */
  increaseQuantity(index) {
    let cartItems = getLocalStorage(this.key);
    cartItems[index].Quantity += 1;
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }

  decreaseQuantity(index) {
    let cartItems = getLocalStorage(this.key);
    if (cartItems[index].Quantity > 1) {
      cartItems[index].Quantity -= 1;
    }
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }
}