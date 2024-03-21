import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <span class="cart__button" id="addToCart" data-id="${product.Id}">
        <span class="add__to-cart">Add to Cart</span>
        <span class="added">Added</span>
        <i class="fas fa-shopping-cart"></i>
        <i class="fas fa-box"></i>
      </span> 
    </div></section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details we can render out the HTML
    this.renderProductDetails("main");
    // once the HTML is rendered we can add a listener to Add to Cart button
    // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
    this.addToCartEventListener();
  }
  addToCartEventListener() {
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }
  addToCart() {
    let cartContents = getLocalStorage("so-cart");
    //check to see if there was anything there
    if (!cartContents) {
      cartContents = [];
    }
    /* checking if product is already in the cart */
    const existingProductIndex = cartContents.findIndex(item => item.Id === this.product.Id);
    if (existingProductIndex !== -1) {
      // Product already exists in the cart, increment its quantity
      cartContents[existingProductIndex].Quantity += 1;
    } else {
      // Product not in cart, add it with a default quantity of 1
      const productWithQuantity = { ...this.product, Quantity: 1 };
      cartContents.push(productWithQuantity);
    }
    // then add the current product to the list
    setLocalStorage("so-cart", cartContents);

    /* animation for addToCart */
    let button = document.getElementById("addToCart");
    button.classList.add("clicked");
  }
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product)
    );
  }
}