import "@scss/main.scss";

import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

var jsonData = require("./cart.json");

var shoppingCart = (function () {
  var cart = [];

  // Constructor
  function Item(name, price, count, discount) {
    this.name = name;
    this.price = price;
    this.count = count;
    this.discount = discount;
  }

  // Save cart
  let saveCart = () => {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  };

  // Load cart
  let loadCart = () => {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  };
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  var obj = {};

  // Add to cart
  obj.addItemToCart = (name, price, count, discount) => {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count, discount);
    cart.push(item);
    saveCart();
  };
  // Set count from item
  obj.setCountForItem = (name, count) => {
    for (var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = (name) => {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = (name) => {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = () => {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = () => {
    var totalCount = 0;
    for (var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = () => {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };
  // Total cart with discount
  obj.totalDiscount = () => {
    var totalDiscount = 0;
    for (var item in cart) {
      totalDiscount += cart[item].discount * cart[item].count;
    }
    return Number(totalDiscount.toFixed(2));
  };

  // List cart
  obj.listCart = () => {
    var cartCopy = [];
    for (var i in cart) {
      var item = cart[i];
      var itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];
        //console.log({ itemCopy });
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  //get all products from json
  (function () {
    var content = ``;
    jsonData.items.forEach(function (e) {
      content += `<div class="product">
                <div class="product_body">
                    <div class="product__img">
                    <img src=${e.image} alt="product" /></div>
                    <div class="product__discount">${e.discount} %</div>
                </div>
                <div class="product__footer">
                    <div class="product__footer__left">
                        <div>${e.name}</div>
                        <div>
                        <span class="old-price">${e.price.display}</span>
                        <span class="new-price">${e.price.actual}</span>
                        </div>
                    </div>
                    <div class="product__footer__right">
                        <a
                        href="#"
                        data-name=${e.name.split(" ").join("_")}
                        data-price=${e.price.display}
                        data-discount=${e.price.display - e.price.actual}
                        class="add-to-cart btn"
                        >Add to cart</a
                    >
                    </div>
                </div>
                </div>`;
    });
    document.querySelector(".products").innerHTML += content;
  })();

  return obj;
})();

// Add item
const addToCart = document.querySelectorAll(".add-to-cart");
for (const button of addToCart) {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    //var recordId = event.currentTarget.dataset.name;

    var name = event.currentTarget.dataset.name;
    var price = Number(event.currentTarget.dataset.price);
    var discount = Number(event.currentTarget.dataset.discount);

    shoppingCart.addItemToCart(name, price, 1, discount);
    displayCart();
  });
}

// Clear items
const clearCart = document.querySelectorAll(".clear-cart");
for (const button of clearCart) {
  button.addEventListener("click", function (event) {
    shoppingCart.clearCart();
    displayCart();
  });
}

let displayCart = () => {
  var cartArray = shoppingCart.listCart();

  var output = "";

  output += `<thead><tr>
                <th>Item </th>
                <th>Qty</th>
                <th>Price</th>
            </tr></thead>`;
  for (var i in cartArray) {
    output += `
            <tr>
                <td>
                    <div class="show-cart__item">
                    ${cartArray[i].name.split("_").join(" ")}
                    </div>
                </td>
                <td>
                <button class='minus-item' data-name=${
                  cartArray[i].name
                } ><i class="far fa-minus-square"></i></button>
                <input type='number' 
                    class='item-count' 
                    data-name=${cartArray[i].name}
                value=${cartArray[i].count} />
                <button class='plus-item' data-name=${
                  cartArray[i].name
                }><i class="far fa-plus-square"></i></button>
                </td>
                <td>${cartArray[i].total}</td>
            </tr>
      `;
  }

  document.querySelector(".show-cart").innerHTML = output;
  document.querySelector(".total-count").innerHTML = shoppingCart.totalCount();
  document.querySelector(
    ".total-discount"
  ).innerHTML = shoppingCart.totalDiscount();

  document.querySelector(".order-total").innerHTML =
    shoppingCart.totalCart() - shoppingCart.totalDiscount();

  var totalCart = document.querySelectorAll(".total-cart");

  for (var i = 0; i < totalCart.length; ++i) {
    totalCart[i].innerHTML = shoppingCart.totalCart();
  }
};

// decrease count of the same product
$(".show-cart").on("click", ".minus-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});

// increase  count of the same product
$(".show-cart").on("click", ".plus-item", function (event) {
  var name = $(this).data("name");
  shoppingCart.addItemToCart(name);
  displayCart();
});

// Item count input
$(".show-cart").on("change", ".item-count", function (event) {
  var name = $(this).data("name");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
