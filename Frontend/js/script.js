// =================================
// SHOP EASE - JAVASCRIPT
// =================================

console.log("ShopEase Frontend Started");

// =================================
// CART DATA
// =================================

let cart = JSON.parse(
    localStorage.getItem("shopEaseCart")
) || [];


// =================================
// PRODUCT DATA FROM BACKEND
// =================================

let products = [];



// =================================
// LOAD PRODUCTS FROM API
// =================================

async function loadProducts() {

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/products");

        const data =
            await response.json();

        products = data.map(function(product) {

            return {
                id: product.Product_ID,
                name: product.Product_Name,
                category: product.Category,
                price: Number(product.Price),
                cost: Number(product.Cost),

                description:
                    "Quality " +
                    product.Product_Name +
                    " for everyday use.",

                image: "🛍️"
            };

        });

        console.log("Products loaded from API:", products);
        console.log("Total Products:", products.length);

        displayProducts(products);

    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

    }
}

// =================================
// DISPLAY PRODUCTS
// =================================

function displayProducts(productList) {

    const productContainer =
        document.getElementById("productContainer");

    if (!productContainer) {
        return;
    }

    productContainer.innerHTML = "";

    productList.forEach(function(product) {

        // API field mapping
        const productId =
            product.Product_ID ||
            product.product_id ||
            product.id;

        const productName =
            product.Product_Name ||
            product.product_name ||
            product.name;

        const category =
            product.Category ||
            product.category;

        const price =
            Number(
                product.Price ||
                product.price ||
                0
            );

        const description =
            product.Description ||
            product.description ||
            "Quality product from ShopEase.";

       const image =
    `images/products/${productId}.jpg`;

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";


        productCard.innerHTML = `

            <div class="product-image">
    <img src="${image}" alt="${productName}">
</div>


            <div class="product-info">

                <h3>${productName}</h3>

                <p class="product-category">
                    ${category}
                </p>

                <p class="product-description">
                    ${description}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ₹${price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="add-cart-btn"
                        onclick="addToCart('${productId}')">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;


        productContainer.appendChild(productCard);

    });

    // =================================
// PRODUCT FILTER + SORT
// =================================

const searchInput = document.getElementById("searchInput");
const sortProducts = document.getElementById("sortProducts");
const categoryButtons =
    document.querySelectorAll(".category-filter button");

let selectedCategory = "All";


// MAIN FILTER FUNCTION
function applyProductFilters() {

    let filteredProducts = [...products];

    // =============================
    // SEARCH
    // =============================

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    if (searchText !== "") {

        filteredProducts = filteredProducts.filter(function(product) {

            return (
                product.name.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText)
            );

        });

    }


    // =============================
    // CATEGORY
    // =============================

    if (selectedCategory !== "All") {

        filteredProducts = filteredProducts.filter(function(product) {

            return product.category === selectedCategory;

        });

    }


    // =============================
    // SORT
    // =============================

    const sortValue =
        sortProducts
            ? sortProducts.value
            : "default";


    if (sortValue === "price-low") {

        filteredProducts.sort(function(a, b) {

            return a.price - b.price;

        });

    }


    else if (sortValue === "price-high") {

        filteredProducts.sort(function(a, b) {

            return b.price - a.price;

        });

    }


    else if (sortValue === "name-az") {

        filteredProducts.sort(function(a, b) {

            return a.name.localeCompare(b.name);

        });

    }


    else if (sortValue === "name-za") {

        filteredProducts.sort(function(a, b) {

            return b.name.localeCompare(a.name);

        });

    }


    // DISPLAY FINAL RESULT

    displayProducts(filteredProducts);
}



// =================================
// SEARCH EVENT
// =================================

if (searchInput) {

    searchInput.addEventListener("input", function() {

        applyProductFilters();

    });

}



// =================================
// SORT EVENT
// =================================

if (sortProducts) {

    sortProducts.addEventListener("change", function() {

        applyProductFilters();

    });

}



// =================================
// CATEGORY EVENT
// =================================

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCategory =
            button.textContent.trim();


        // Active button

        categoryButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        applyProductFilters();

    });

});
}

loadProducts();


// =================================
// PRODUCT SEARCH
// =================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchText = searchInput.value.toLowerCase().trim();

        const filteredProducts = products.filter(function(product) {

            return (
                product.name.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText)
            );

        });

        displayProducts(filteredProducts);

    });

}

// =================================
// CATEGORY FILTER
// =================================

const categoryButtons = document.querySelectorAll(".category-filter button");

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedCategory = button.textContent.trim();

        // All button
        if (selectedCategory === "All") {

            displayProducts(products);

        } else {

            const filteredProducts = products.filter(function(product) {

                return product.category === selectedCategory;

            });

            displayProducts(filteredProducts);
        }

        // Active button
        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

    });

});

// =================================
// LOAD CATEGORY FROM URL
// =================================

const urlParams = new URLSearchParams(window.location.search);

const selectedCategory =
    urlParams.get("category");

if (selectedCategory) {

    const selectedButton =
        Array.from(categoryButtons).find(function(button) {

            return button.textContent.trim() === selectedCategory;

        });

    if (selectedButton) {

        const filteredProducts =
            products.filter(function(product) {

                return product.category === selectedCategory;

            });

        displayProducts(filteredProducts);

        categoryButtons.forEach(function(button) {
            button.classList.remove("active");
        });

        selectedButton.classList.add("active");
    }
}

// =================================
// HOME CATEGORY CARD FILTER
// =================================

const homeCategoryCards =
    document.querySelectorAll(".category-card");

homeCategoryCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const categoryName =
            card.querySelector("h3").textContent.trim();

        window.location.href =
            "product.html?category=" +
            encodeURIComponent(categoryName);

    });

});

// =================================
// UPDATE CART COUNT
// =================================

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    let totalQuantity = 0;

    cart.forEach(function(item) {

        totalQuantity = totalQuantity + item.quantity;

    });

    cartCount.textContent = totalQuantity;
}

// =================================
// ADD TO CART
// =================================

async function addToCart(productId) {

    const product = products.find(function(product) {

        return product.id === productId;

    });

    if (!product) {

        console.log("Product not found:", productId);

        return;
    }


    // =================================
    // SAVE TO LOCAL CART
    // =================================

    const existingProduct = cart.find(function(item) {

        return item.id === productId;

    });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            cost: Number(product.cost),
            image: "🛍️",
            quantity: 1

        });

    }


    // Save localStorage

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );


    // =================================
    // SAVE TO BACKEND
    // =================================

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/cart",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    product_id: product.id,
                    quantity: 1

                })
            }
        );


        const data = await response.json();

        console.log("Backend Cart Add:", data);


        if (data.status !== "success") {

            console.log(
                "Backend cart error:",
                data.message
            );

            return;
        }


        // Update count

        updateCartCount();


        // Alert

        const currentProduct =
            cart.find(function(item) {

                return item.id === productId;

            });


        alert(
            product.name +
            " added to cart! Quantity: " +
            currentProduct.quantity
        );


    } catch (error) {

        console.error(
            "Backend Cart Error:",
            error
        );

    }

}

// =================================
// DISPLAY CART
// =================================

function displayCart() {

    const cartItems = document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }

    // Load saved cart
    cart = JSON.parse(
        localStorage.getItem("shopEaseCart")
    ) || [];

    console.log("Cart loaded:", cart);

    // Update count
    updateCartCount();

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        return;
    }

    cart.forEach(function(item) {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">
               ${item.image || "🛍️"}
            </div>

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>${item.category}</p>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                </p>

            </div>

            <div class="quantity-control">

                <button onclick="decreaseQuantity('${item.id}')">
                    -
                </button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity('${item.id}')">
                    +
                </button>

            </div>

            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})">
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);

    });
    updateCartTotal();
}


// Run on Cart page
displayCart();
// =================================
// INCREASE QUANTITY
// =================================

function increaseQuantity(productId) {

    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity = item.quantity + 1;

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

    displayCart();
}


// =================================
// DECREASE QUANTITY
// =================================

function decreaseQuantity(productId) {

    const item = cart.find(function(product) {
        return product.id === productId;
    });

    if (!item) {
        return;
    }

    if (item.quantity > 1) {

        item.quantity = item.quantity - 1;

    }

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

    displayCart();
}

// =================================
// REMOVE FROM CART
// =================================

function removeFromCart(productId) {

    cart = cart.filter(function(item) {

        return item.id !== productId;

    });

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

    displayCart();

    updateCartCount();

}

// =================================
// UPDATE CART TOTAL
// =================================

function updateCartTotal() {

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal = subtotal + (item.price * item.quantity);

    });

    const shipping = 0;

    const total = subtotal + shipping;


    // Subtotal
    const subtotalElement = document.getElementById("subtotal");

    if (subtotalElement) {
        subtotalElement.textContent =
            "₹" + subtotal.toLocaleString("en-IN");
    }


    // Shipping
    const shippingElement = document.getElementById("shipping");

    if (shippingElement) {
        shippingElement.textContent =
            "₹" + shipping.toLocaleString("en-IN");
    }


    // Total
    const totalElement = document.getElementById("total");

    if (totalElement) {
        totalElement.textContent =
            "₹" + total.toLocaleString("en-IN");
    }

}

// =================================
// CHECKOUT BUTTON
// =================================

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function() {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }

        window.location.href = "checkout.html";

    });

}

// =================================
// DISPLAY CHECKOUT FROM BACKEND
// =================================

async function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    if (!checkoutItems) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/cart"
        );

        const data = await response.json();

        console.log("Checkout Cart:", data);

        if (
            data.status !== "success" ||
            data.cart.length === 0
        ) {

            checkoutItems.innerHTML = `
                <p>Your cart is empty.</p>
            `;

            return;
        }

        checkoutItems.innerHTML = "";

        let subtotal = 0;

        data.cart.forEach(function(item) {

            const itemTotal =
                Number(item.Price) * Number(item.Quantity);

            subtotal += itemTotal;

            const itemElement =
                document.createElement("div");

            itemElement.className =
                "checkout-item";

            itemElement.innerHTML = `
                <p>
                    ${item.Product_Name}
                    × ${item.Quantity}
                </p>

                <p>
                    ₹${itemTotal.toLocaleString("en-IN")}
                </p>
            `;

            checkoutItems.appendChild(itemElement);

        });

        const checkoutSubtotal =
            document.getElementById("checkoutSubtotal");

        const checkoutTotal =
            document.getElementById("checkoutTotal");

        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                "₹" + subtotal.toLocaleString("en-IN");

        }

        if (checkoutTotal) {

            checkoutTotal.textContent =
                "₹" + subtotal.toLocaleString("en-IN");

        }

    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );

        checkoutItems.innerHTML = `
            <p>Unable to load cart.</p>
        `;
    }
}

displayCheckout();

// =================================
// PLACE ORDER - BACKEND
// =================================

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

if (placeOrderBtn) {

    placeOrderBtn.addEventListener("click", async function() {

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const address =
            document.getElementById("address").value.trim();

        const customerId =
            document.getElementById("customerId").value.trim();


        // Check fields

        if (
            name === "" ||
            email === "" ||
            phone === "" ||
            address === "" ||
            customerId === ""
        ) {

            alert("Please fill all the details.");

            return;
        }


        try {

            // Get latest cart from backend

            const cartResponse = await fetch(
                "http://127.0.0.1:5000/api/cart"
            );

            const cartData =
                await cartResponse.json();


            if (
                cartData.status !== "success" ||
                cartData.cart.length === 0
            ) {

                alert("Your cart is empty.");

                return;
            }


            // Calculate total

            let totalAmount = 0;

            cartData.cart.forEach(function(item) {

                totalAmount +=
                    Number(item.Price) *
                    Number(item.Quantity);

            });


            // Place order

            const orderResponse = await fetch(
                "http://127.0.0.1:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        Customer_ID: customerId
                    })
                }
            );


            const orderData =
                await orderResponse.json();


            console.log(
                "Order Response:",
                orderData
            );


            if (orderData.status !== "success") {

                alert(
                    orderData.message ||
                    "Unable to place order."
                );

                return;
            }
           sessionStorage.setItem(
    "lastOrderId",
    orderData.Order_ID
);


// Clear frontend cart

cart = [];

localStorage.removeItem("shopEaseCart");

updateCartCount();


alert(
    "Order placed successfully!\n" +
    "Order ID: " +
    orderData.Order_ID
);


// Go to success page

window.location.href =
    "order-success.html";

            // Clear backend cart

            for (const item of cartData.cart) {

                await fetch(
                    "http://127.0.0.1:5000/api/cart/remove/" +
                    item.Cart_ID,
                    {
                        method: "DELETE"
                    }
                );

            }


            alert(
                "Order placed successfully!\n" +
                "Order ID: " +
                orderData.Order_ID
            );


            // Go to success page

            window.location.href =
                "order-success.html";

        }

        catch (error) {

            console.error(
                "Place order error:",
                error
            );

            alert(
                "Unable to connect to backend."
            );

        }

    });

}

// =================================
// LOGIN
// =================================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", async function() {

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();


        // Empty fields
        if (email === "" || password === "") {

            alert("Please enter email and password.");

            return;
        }


        // Basic email validation
        if (!email.includes("@")) {

            alert("Please enter a valid email.");

            return;
        }


        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("Login Response:", data);


            if (data.status === "success") {

                sessionStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "userEmail",
                    data.Email
                );

                sessionStorage.setItem(
                    "customerId",
                    data.Customer_ID
                );

                alert("Login successful!");

                window.location.href = "index.html";

            } else {

                alert(
                    data.message ||
                    "Invalid email or password."
                );

            }

        } catch (error) {

            console.error("Login Error:", error);

            alert("Unable to connect to server.");

        }

    });

}

updateCartCount();

// =================================
// LOAD CART FROM BACKEND
// =================================

async function loadCartFromBackend() {

    const cartItems = document.getElementById("cartItems");

    if (!cartItems) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/cart"
        );

        const data = await response.json();
        // Sync backend cart with frontend cart

cart = data.cart.map(function(item) {

    return {
        id: item.Product_ID,
        name: item.Product_Name,
        category: item.Category,
        price: Number(item.Price),
        quantity: Number(item.Quantity),
        cart_id: item.Cart_ID,
        image: "🛍️"
    };

});

localStorage.setItem(
    "shopEaseCart",
    JSON.stringify(cart)
);
        console.log("Backend Cart:", data);

        if (data.status !== "success") {
            return;
        }

        cartItems.innerHTML = "";

        if (data.cart.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Your cart is empty.
                </p>
            `;

            updateCartCount();
            updateCartTotal();
            return;
        }

        // Display cart items

        data.cart.forEach(function(item) {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <div class="cart-item-image">
                    🛍️
                </div>

                <div class="cart-item-info">

                    <h3>${item.Product_Name}</h3>

                    <p>${item.Category}</p>

                    <p>
                        ₹${Number(item.Price).toLocaleString("en-IN")}
                    </p>

                </div>

                <div class="quantity-control">

                    <button onclick="updateBackendQuantity(${item.Cart_ID}, ${item.Quantity - 1})">
                        -
                    </button>

                    <span>${item.Quantity}</span>

                    <button onclick="updateBackendQuantity(${item.Cart_ID}, ${item.Quantity + 1})">
                        +
                    </button>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeBackendCartItem(${item.Cart_ID})">
                    Remove
                </button>

            `;

            cartItems.appendChild(cartItem);

        });

        // Total quantity

        let totalQuantity = 0;

        data.cart.forEach(function(item) {
            totalQuantity += Number(item.Quantity);
        });

        const cartCount = document.getElementById("cartCount");

        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }
        updateCartTotal();

    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );

    }
}


// =================================
// UPDATE QUANTITY IN BACKEND
// =================================

async function updateBackendQuantity(cartId, newQuantity) {

    if (newQuantity < 1) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/cart/update",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    Cart_ID: cartId,
                    Quantity: newQuantity
                })
            }
        );

        const data = await response.json();

        console.log("Quantity Update:", data);

        if (data.status === "success") {

            await loadCartFromBackend();

            updateCartTotal();


        } else {

            alert("Unable to update quantity.");

        }

    } catch (error) {

        console.error(
            "Quantity update error:",
            error
        );

    }
}


// =================================
// REMOVE CART ITEM FROM BACKEND
// =================================

async function removeBackendCartItem(cartId) {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/cart/remove/" + cartId,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log("Remove Item:", data);

        if (data.status === "success") {

            await loadCartFromBackend();

            updateCartTotal();

        } else {

            alert("Unable to remove item.");

        }

    } catch (error) {

        console.error(
            "Remove error:",
            error
        );

    }
}

// =================================
// RUN CART
// =================================

loadCartFromBackend();

const orderIdElement =
    document.getElementById("orderId");

if (orderIdElement) {

    const lastOrderId =
        sessionStorage.getItem("lastOrderId");

    if (lastOrderId) {

        orderIdElement.textContent =
            lastOrderId;

    }

}

// =================================
// LOAD MY ORDERS
// =================================

let allOrders = [];
async function loadMyOrders() {

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    const customerId = "C0001";

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/orders/" + customerId
        );

        const data = await response.json();

        console.log("My Orders:", data);

        if (data.status !== "success") {

            ordersContainer.innerHTML =
                "<p>Unable to load orders.</p>";

            return;
        }
        allOrders = data.orders;
        if (data.orders.length === 0) {

            ordersContainer.innerHTML =
                "<p>No orders found.</p>";

            return;
        }

        ordersContainer.innerHTML = "";

        for (const order of data.orders) {

            const orderCard =
                document.createElement("div");

            orderCard.className = "order-card";

            // Get order details

            const detailResponse = await fetch(
                "http://127.0.0.1:5000/api/orders/" +
                order.Order_ID +
                "/details"
            );

            const detailData =
                await detailResponse.json();

            let orderTotal = 0;

            let productHTML = "";

            if (
                detailData.status === "success" &&
                detailData.details.length > 0
            ) {

                detailData.details.forEach(function(item) {

                    const itemTotal =
                        Number(item.Price) *
                        Number(item.Quantity);
                    orderTotal += itemTotal;

                    productHTML += `

                        <div class="order-product">

                            <p>
                                <strong>
                                    ${item.Product_Name}
                                </strong>
                            </p>

                            <p>
                                Product ID: ${item.Product_ID}
                            </p>

                            <p>
                                Quantity: ${item.Quantity}
                            </p>

                            <p>
                                Price: ₹${Number(
                                    item.Price
                                ).toLocaleString("en-IN")}
                            </p>

                            <p>
                                Total: ₹${itemTotal.toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                        </div>

                    `;

                });

            }

            orderCard.innerHTML = `

                <h3>
                    Order ID: ${order.Order_ID}
                </h3>

                <p>
                    Customer ID: ${order.Customer_ID}
                </p>

                <p>
                    Date: ${order.Order_Date}
                </p>

                <p>
                    Status: <span class="order-status status-${order.Order_Status.toLowerCase()}">
                                 ${order.Order_Status}
                            </span>
                </p>

                <hr>
<button
    class="view-details-btn"
    onclick="toggleOrderDetails('${order.Order_ID}')">
    View Details
</button>

${order.Order_Status === "Pending" ? `
    <button
        class="cancel-order-btn"
        onclick="cancelOrder('${order.Order_ID}')">
        Cancel Order
    </button>
` : ""}

<div
    id="details-${order.Order_ID}"
    class="order-details-content"
    style="display: none;">

    <h4>Order Items</h4>

    ${productHTML}

    <div class="order-total">
        Order Total:
        ₹${orderTotal.toLocaleString("en-IN")}
    </div>

</div>
            `;

            ordersContainer.appendChild(orderCard);

        }

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );

        ordersContainer.innerHTML =
            "<p>Unable to connect to backend.</p>";
    }
}


// =================================
// RUN MY ORDERS
// =================================

loadMyOrders();

// =================================
// DISPLAY MY ORDERS
// =================================

async function displayOrders(orders) {

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>No matching orders found.</p>";

        return;
    }

    for (const order of orders) {

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";

        let productHTML = "";
        let orderTotal = 0;

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/orders/" +
                order.Order_ID +
                "/details"
            );

            const data = await response.json();

            if (
                data.status === "success" &&
                data.details.length > 0
            ) {

                data.details.forEach(function(item) {

                    const itemTotal =
                        Number(item.Price) *
                        Number(item.Quantity);

                    orderTotal += itemTotal;

                    productHTML += `

                        <div class="order-product">

                            <p>
                                <strong>
                                    ${item.Product_Name}
                                </strong>
                            </p>

                            <p>
                                Product ID: ${item.Product_ID}
                            </p>

                            <p>
                                Quantity: ${item.Quantity}
                            </p>

                            <p>
                                Price:
                                ₹${Number(item.Price)
                                    .toLocaleString("en-IN")}
                            </p>

                            <p>
                                Total:
                                ₹${itemTotal
                                    .toLocaleString("en-IN")}
                            </p>

                        </div>

                    `;
                });
            }

        } catch (error) {

            console.error(
                "Order details error:",
                error
            );
        }

        orderCard.innerHTML = `

            <h3>
                Order ID: ${order.Order_ID}
            </h3>

            <p>
                Customer ID: ${order.Customer_ID}
            </p>

            <p>
                Date: ${order.Order_Date}
            </p>

            <p>
                Status:
                <span class="order-status status-${order.Order_Status.toLowerCase()}">
                    ${order.Order_Status}
                </span>
            </p>

            <button
                class="view-details-btn"
                onclick="toggleOrderDetails('${order.Order_ID}')">
                View Details
            </button>

            ${order.Order_Status === "Pending" ? `
                <button
                    class="cancel-order-btn"
                    onclick="cancelOrder('${order.Order_ID}')">
                    Cancel Order
                </button>
            ` : ""}

            <div
                id="details-${order.Order_ID}"
                class="order-details-content"
                style="display: none;">

                <h4>Order Items</h4>

                ${productHTML}

                <div class="order-total">
                    Order Total:
                    ₹${orderTotal.toLocaleString("en-IN")}
                </div>

            </div>

        `;

        ordersContainer.appendChild(orderCard);
    }
}

// =================================
// TOGGLE ORDER DETAILS
// =================================

function toggleOrderDetails(orderId) {

    const details =
        document.getElementById(
            "details-" + orderId
        );

    const button =
        event.target;

    if (details.style.display === "none") {

        details.style.display = "block";

        button.textContent =
            "Hide Details";

    } else {

        details.style.display = "none";

        button.textContent =
            "View Details";
    }
}

// =================================
// CANCEL ORDER
// =================================

async function cancelOrder(orderId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this order?"
        );

    if (!confirmCancel) {
        return;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/orders/" +
            orderId +
            "/cancel",
            {
                method: "PUT"
            }
        );

        const data =
            await response.json();

        console.log(
            "Cancel Order:",
            data
        );

        if (data.status === "success") {

            alert(
                "Order cancelled successfully!"
            );

            // Reload orders

            loadMyOrders();

        } else {

            alert(
                data.message ||
                "Unable to cancel order."
            );

        }

    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );

        alert(
            "Unable to connect to backend."
        );
    }
}

// =================================
// FILTER MY ORDERS
// =================================

function filterMyOrders() {

    const searchValue =
        document.getElementById("orderSearch")
        .value
        .toLowerCase();

    const statusValue =
        document.getElementById("orderStatusFilter")
        .value;

    const filteredOrders =
        allOrders.filter(function(order) {

            const matchesSearch =
                order.Order_ID
                    .toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusValue === "All" ||
                order.Order_Status === statusValue;

            return matchesSearch && matchesStatus;

        });

    displayOrders(filteredOrders);
}

// =================================
// DISPLAY FILTERED ORDERS
// =================================

function displayFilteredOrders(orders) {

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>No matching orders found.</p>";

        return;
    }

    orders.forEach(function(order) {

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";

        orderCard.innerHTML = `

            <h3>
                Order ID: ${order.Order_ID}
            </h3>

            <p>
                Customer ID: ${order.Customer_ID}
            </p>

            <p>
                Date: ${order.Order_Date}
            </p>

            <p>
                Status:
                <span class="order-status status-${order.Order_Status.toLowerCase()}">
                    ${order.Order_Status}
                </span>
            </p>

        `;

        ordersContainer.appendChild(orderCard);

    });
}

// =================================
// FILTER ORDERS
// =================================

function filterMyOrders() {

    const searchInput =
        document.getElementById("orderSearch");

    const statusFilter =
        document.getElementById("orderStatusFilter");

    if (!searchInput || !statusFilter) {
        return;
    }

    const searchValue =
        searchInput.value.toLowerCase();

    const statusValue =
        statusFilter.value;

    const filteredOrders =
        allOrders.filter(function(order) {

            const searchMatch =
                order.Order_ID
                    .toLowerCase()
                    .includes(searchValue);

            const statusMatch =
                statusValue === "All" ||
                order.Order_Status === statusValue;

            return searchMatch && statusMatch;
        });

displayOrders(filteredOrders);}

document
    .getElementById("orderSearch")
    ?.addEventListener(
        "input",
        filterMyOrders
    );

document
    .getElementById("orderStatusFilter")
    ?.addEventListener(
        "change",
        filterMyOrders
    );

// =================================
// AUTO LOAD CUSTOMER ID
// =================================

const customerIdInput = document.getElementById("customerId");

if (customerIdInput) {

    const customerId = sessionStorage.getItem("customerId");

    if (customerId) {

        customerIdInput.value = customerId;

        customerIdInput.readOnly = true;

    }

}

// =================================
// LOGIN PROTECTION
// =================================

const protectedPages = [
    "checkout.html",
    "my-orders.html"
];

const currentPage = window.location.pathname
    .split("/")
    .pop();

if (protectedPages.includes(currentPage)) {

    const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        alert("Please login first.");

        window.location.href = "login.html";

    }

}

// =================================
// NAVBAR LOGIN STATE
// =================================

const navActions = document.querySelector(".nav-actions");

if (navActions) {

    const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

        navActions.innerHTML = `
           <span class="welcome-user">
    Welcome, ${sessionStorage.getItem("userEmail")} 👋
</span>
            <a href="#" id="logoutBtn">
                Logout
            </a>

            <a href="cart.html">
                Cart 🛒 <span id="cartCount">0</span>
            </a>
        `;

        const logoutBtn =
            document.getElementById("logoutBtn");

        logoutBtn.addEventListener("click", function(event) {

            event.preventDefault();

            // Clear login data
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("userEmail");
            sessionStorage.removeItem("customerId");

            // Go to home page
            window.location.href = "index.html";

        });

    } else {

        navActions.innerHTML = `
            <a href="login.html">
                Login
            </a>

            <a href="cart.html">
                Cart 🛒 <span id="cartCount">0</span>
            </a>
        `;
    }
}

// =================================
// SIGNUP / REGISTER
// =================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const customerId =
            document.getElementById("customerId").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value.trim();


        // Empty field validation
        if (customerId === "" || email === "" || password === "") {

            alert("Please fill all the details.");

            return;
        }


        // Basic email validation
        if (!email.includes("@")) {

            alert("Please enter a valid email.");

            return;
        }


        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        Customer_ID: customerId,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("Register Response:", data);


            if (data.status === "success") {

                alert("Account created successfully!");

                window.location.href = "login.html";

            } else {

                alert(
                    data.message ||
                    "Unable to create account."
                );

            }

        } catch (error) {

            console.error("Register Error:", error);

            alert("Unable to connect to server.");

        }

    });

}