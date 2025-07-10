// Global Variables
let inventory = [];
let products = [];

/* SIDEBAR TOGGLE FUNCTION */
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "-220px" ? "0" : "-220px";
}

/* SHOW SPECIFIC SECTION */
function showSection(sectionId) {
    document.querySelectorAll(".form-section").forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
    document.getElementById("content").style.display = "block";
    
    if (sectionId === "products") {
        displayProducts();
    } else if (sectionId === "add-products") {
        displayInventory(inventory);
    }
}

/* ADD NEW PRODUCT */
function addNewProduct(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById("productName").value,
        fabricType: document.getElementById("productFabricType").value,
        color: document.getElementById("productColor").value,
        size: document.getElementById("productSize").value,
        weight: parseFloat(document.getElementById("productWeight").value),
        pattern: document.getElementById("productPattern").value,
        unitPrice: parseFloat(document.getElementById("productPrice").value),
        quantity: parseInt(document.getElementById("productQuantity").value),
        imageURL: document.getElementById("productImage").value
    };

    if (validateProduct(newProduct)) {
        products.push(newProduct);
        addToInventory(newProduct); // Automatically store in inventory
        displayProducts();
        displayInventory(inventory);
        document.getElementById("addProductForm").reset();
    } else {
        alert("Please fill all fields correctly.");
    }
}


/* ADD TO INVENTORY */
function addToInventory(product) {
    const existingProduct = inventory.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
        existingProduct.totalValue = existingProduct.quantity * existingProduct.unitPrice;
    } else {
        inventory.push({
            name: product.name,
            fabricType: product.fabricType,
            color: product.color,
            size: product.size,
            weight: product.weight,
            pattern: product.pattern,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            totalValue: product.quantity * product.unitPrice
        });
    }
    updateProductList();
    displayInventory(inventory);
}

/* VALIDATE PRODUCT INPUT */
function validateProduct(product) {
    return (
        product.name &&
        product.fabricType &&
        product.color &&
        product.size &&
        product.weight > 0 &&
        product.pattern &&
        product.unitPrice > 0 &&
        product.quantity > 0 &&
        product.imageURL
    );
}

/* DISPLAY PRODUCTS */
function displayProducts() {
    const container = document.getElementById("pro");
    container.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Fabric Type:</strong> ${product.fabricType}</p>
            <p><strong>Color:</strong> ${product.color}</p>
            <p><strong>Size:</strong> ${product.size}</p>
            <p><strong>Weight:</strong> ${product.weight} gm</p>
            <p><strong>Pattern:</strong> ${product.pattern}</p>
            <p><strong>Price:</strong> ₹${product.unitPrice.toFixed(2)}</p>
            <p><strong>Quantity:</strong> <span id="product-qty-${index}">${product.quantity}</span></p>
            <img src="${product.imageURL}" alt="${product.name}" class="product-image">
            <div class="button-group">
                <button class="stock-btn" onclick="increaseStock(${index})">Stock Add</button>
                <button class="remove-btn" onclick="removeProduct(${index})">Remove</button>
            </div>
        `;

        container.appendChild(card);
    });
}

////increse stock added
function increaseStock(index) {
    const additionalStock = parseInt(prompt("Enter quantity to add:"));

    if (!isNaN(additionalStock) && additionalStock > 0) {
        products[index].quantity += additionalStock;

        // Update inventory if product exists
        const inventoryItem = inventory.find(item => item.name === products[index].name);
        if (inventoryItem) {
            inventoryItem.quantity += additionalStock;
            inventoryItem.totalValue = inventoryItem.quantity * inventoryItem.unitPrice;
        }

        document.getElementById(`product-qty-${index}`).innerText = products[index].quantity;
        displayInventory();
    } else {
        alert("Please enter a valid number.");
    }
}


/* DISPLAY INVENTORY */
function displayInventory(items) {
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = "";

    items.forEach((item, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.fabricType}</td>
            <td>${item.color}</td>
            <td>${item.size}</td>
            <td>${item.weight} kg</td>
            <td>${item.pattern}</td>
            <td>${item.quantity}</td>
            <td>₹${item.unitPrice.toFixed(2)}</td>
            <td>₹${item.totalValue.toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
            
        `;
    });
}

/* REMOVE PRODUCT */
function removeProduct(index) {
    const productName = products[index].name;
    products.splice(index, 1);
    inventory = inventory.filter(item => item.name !== productName);
    displayProducts();
    displayInventory(inventory);
}

/* REMOVE ITEM FROM INVENTORY */
function removeItem(index) {
    inventory.splice(index, 1);
    updateProductList();
    displayInventory(inventory);
}

/* SEARCH INVENTORY */
function searchInventory() {
    const searchValue = document.getElementById("inventorySearchInput").value.toLowerCase();
    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchValue)
    );
    displayInventory(filteredInventory);
}

/* UPDATE PRODUCT DROPDOWN FOR CHECKOUT */
function updateProductList() {
    const dropdown = document.getElementById('product-dropdown');
    dropdown.innerHTML = "";
    
    inventory.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        dropdown.appendChild(option);
    });
}

/* CHECKOUT PRODUCT */
function checkoutProduct() {
    const productIndex = document.getElementById('product-dropdown').value;
    const quantity = parseInt(document.getElementById('checkout-quantity').value);

    if (productIndex === '' || isNaN(quantity) || quantity <= 0) {
        alert('Please select a product and enter a valid quantity.');
        return;
    }

    const product = inventory[productIndex];

    if (quantity > product.quantity) {
        alert('Not enough stock available.');
        return;
    }

    product.quantity -= quantity;
    product.totalValue = product.quantity * product.unitPrice;
    document.getElementById('total-price').value = (quantity * product.unitPrice).toFixed(2);
    
    updateProductList();
    displayInventory(inventory);
}

/* INITIALIZE DEFAULT PRODUCTS */
products = [
    {
        name: "Shirt",
        fabricType: "Cotton",
        color: "White",
        size: "M",
        weight: 180,
        pattern: "Plain",
        unitPrice: 550,
        quantity: 100,
        imageURL: "https://trybuy.in/cdn/shop/files/TB_58_7zV6Md38d_6a362100-2f10-4e4b-b071-e87c05c6a217.jpg?v=1715443960"
    },
    {
        name: "Pant",
        fabricType: "Denim",
        color: "Black",
        size: "32",
        weight: 700,
        pattern: "Solid",
        unitPrice: 1200,
        quantity: 50,
        imageURL: "https://img0.junaroad.com/uiproducts/17928020/zoom_0-1629101824.jpg"
    },
    {
        name: "Saree",
        fabricType: "Silk",
        color: "Gold",
        size: "6Meter",
        weight: 400,
        pattern: "Zari work",
        unitPrice: 2200,
        quantity: 80,
        imageURL: "https://www.avishya.com/cdn/shop/files/1_10064981_Profile.jpg?v=1695810194"
    },
    {
        name: "T-shirt",
        fabricType: "Cotton",
        color: "Black",
        size: "M",
        weight: 180,
        pattern: "Plain",
        unitPrice: 300,
        quantity: 40,
        imageURL: "https://m.media-amazon.com/images/I/71SomKZ4f9L._AC_UY1100_.jpg"
    },
    {
        name: " plain-woven fabric",
        fabricType: "Woven fabric",
        color: "Beige",
        size: "Null",
        weight: 1000,
        pattern: "Plain",
        unitPrice: 1200,
        quantity: 100,
        imageURL: "https://images.ctfassets.net/3s5io6mnxfqz/2aloc74Sl1qvKe8tLu4Yi0/5bdbdfb652644204c9b9212c57181015/AdobeStock_109586255.jpeg?w=1920"
    },
];

// Add all products to inventory when the page loads
products.forEach(product => addToInventory(product));

displayProducts();
displayInventory(inventory);

function goToHome() {
    showSection('home'); // Show Home section
    toggleSidebar(); // Hide sidebar after clicking Back
}
// Global Variables
let inventor = [];
let product = [];
let customers = []; // New array to store customer details

/* SIDEBAR TOGGLE FUNCTION */
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "-250px" ? "0" : "-250px";
}

/* SHOW SPECIFIC SECTION */
function showSection(sectionId) {
    document.querySelectorAll(".form-section").forEach(section => section.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
    document.getElementById("content").style.display = "block";
    
    if (sectionId === "products") {
        displayProducts();
    } else if (sectionId === "add-products") {
        displayInventory(inventory);
    } else if (sectionId === "customer-details") {
        displayCustomers(); // Update customer details page
    }
}

/* ADD NEW CUSTOMER & CHECKOUT */
function checkoutProduct() {
    const customerName = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const productIndex = document.getElementById('product-dropdown').value;
    const quantity = parseInt(document.getElementById('checkout-quantity').value);

    if (!customerName || !phone || !email || !address || productIndex === '' || isNaN(quantity) || quantity <= 0) {
        alert('Please fill in all the details and enter a valid quantity.');
        return;
    }

    const product = inventory[productIndex];

    if (quantity > product.quantity) {
        alert('Not enough stock available.');
        return;
    }

    product.quantity -= quantity;
    product.totalValue = product.quantity * product.unitPrice;

    const totalPrice = (quantity * product.unitPrice).toFixed(2);
    document.getElementById('total-price').value = totalPrice;

    // Store customer details
    const newCustomer = {
        name: customerName,
        phone: phone,
        email: email,
        address: address,
        productName: product.name,
        quantity: quantity,
        totalPrice: totalPrice
    };

    customers.push(newCustomer);
    updateProductList();
    displayInventory(inventory);
    displayCustomers(); // Update customer details page

    // Clear the form fields
  
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-phone").value = "";
    document.getElementById("customer-email").value = "";
    document.getElementById("customer-address").value = "";
    document.getElementById("checkout-quantity").value = "";
    document.getElementById("total-price").value = "";
}

/* DISPLAY CUSTOMERS */
function displayCustomers() {
    const customerTableBody = document.querySelector('#customerTable tbody');
    customerTableBody.innerHTML = "";

    customers.forEach((customer, index) => {
        const row = customerTableBody.insertRow();
        row.innerHTML = `
        
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.address}</td>
            <td>${customer.productName}</td>
            <td>${customer.quantity}</td>
            <td>₹${customer.totalPrice}</td>
            <td><button class="remove-btn" onclick="removeCustomer(${index})">Remove</button></td>
        `;
    });
}

/* REMOVE CUSTOMER */
function removeCustomer(index) {
    customers.splice(index, 1);
    displayCustomers();
}

/* UPDATE PRODUCT DROPDOWN FOR CHECKOUT */
function updateProductList() {
    const dropdown = document.getElementById('product-dropdown');
    dropdown.innerHTML = "";
    
    inventory.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        dropdown.appendChild(option);
    });
}

addToInventory(products[0]); // Automatically add the default product to inventory
displayProducts();
displayInventory(inventory);
displayCustomers();

function goToHome() {
    showSection('home'); // Show Home section
    toggleSidebar(); // Hide sidebar after clicking Back
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///=============================================buyer
let buyers = [];
let buyerIdCounter = 1; // Start Buyer_ID from 3001
// ==============================
// ADD NEW BUYER
// ==============================
document.addEventListener("DOMContentLoaded", function () {
    const buyerForm = document.getElementById("buyerForm");
    if (buyerForm) {
        buyerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("buyerName").value.trim();
            const contact = document.getElementById("contactNumber").value.trim();
            const email = document.getElementById("email").value.trim();
            const address = document.getElementById("address").value.trim();

            if (name && contact && email && address) {
                const newBuyer = {
                    id: buyerIdCounter++, // Auto-generate Buyer ID
                    name: name,
                    contact: contact,
                    email: email,
                    address: address
                };

                buyers.push(newBuyer);
                localStorage.setItem("buyers", JSON.stringify(buyers));

                alert("Supplier added successfully!");
                document.getElementById("buyerForm").reset();
                displayBuyers();
            } else {
                alert("Please fill all fields.");
            }
        });
    }

    if (document.getElementById("buyerTable")) {
        loadBuyers();
    }
});

// ==============================
// LOAD BUYERS FROM STORAGE
// ==============================
function loadBuyers() {
    buyers = JSON.parse(localStorage.getItem("buyers")) || [];
    displayBuyers();
}

// ==============================
// DISPLAY BUYERS
// ==============================
function displayBuyers() {
    const tableBody = document.getElementById("buyerTable");
    tableBody.innerHTML = "";

    buyers.forEach((buyer, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${buyer.id}</td>
            <td>${buyer.name}</td>
            <td>${buyer.contact}</td>
            <td>${buyer.email}</td>
            <td>${buyer.address}</td>
            <td><button class="remove-btn" onclick="removeBuyer(${index})">Remove</button></td>
        `;
    });
}

// ==============================
// REMOVE BUYER
// ==============================
function removeBuyer(index) {
    buyers.splice(index, 1);
    localStorage.setItem("buyers", JSON.stringify(buyers));
    displayBuyers();
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("managerForm");
    const tableBody = document.getElementById("managerTable");
    let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

    function renderTable() {
        tableBody.innerHTML = "";
        suppliers.forEach((supplier, index) => {
            console.log("Rendering supplier:", supplier);
            const row = document.createElement("tr");
            // row.innerHTML = `
            //     <td>${index + 1}</td>
            //     <td>${supplier.name}</td>
            //     <td>${supplier.contact}</td>
            //     <td>${supplier.email || 'abisheikvdtp@gmail.com'}</td>
            //     <td>${supplier.address || 'Idappadi'}</td>
            //     <td><button onclick="deleteSupplier(${index})" style="color: red; border: none; background: none; cursor: pointer;">Delete</button></td>
            // `;
            // tableBody.appendChild(row);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("managerName").value.trim();
        const contact = document.getElementById("contactNo").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();

        if (!name || !contact || !email || !address) {
            alert("All fields are required!");
            return;
        }

        const supplier = { name, contact, email, address };
        console.log("Saving supplier:", supplier);
        suppliers.push(supplier);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        console.log("Updated localStorage:", localStorage.getItem("suppliers"));
        renderTable();
        form.reset();
    });

    window.deleteSupplier = function (index) {
        suppliers.splice(index, 1);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        renderTable();
    };

    renderTable();
});


