// GLOBAL
let currentProduct = null;

// fetch
async function fetchAllProducts() {
  const res = await fetch('https://fakestoreapi.in/api/products');
  const data = await res.json();
  return data.products;
}

// shuffle
function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Render
function renderProducts(products, container) {
  if (!container) return;
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = "flex-shrink-0 w-32 h-44 sm:w-24 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden";

    card.innerHTML = `
      <a href="barang.html?id=${product.id}" class="flex flex-col h-full">
        <div class="w-full h-44 bg-white flex items-center justify-center overflow-hidden p-2">
          <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain">
        </div>
        <div class="p-2 h-20 flex flex-col justify-between">
          <div class="text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap">${product.title}</div>
          <div class="text-sm font-bold text-green-600">Rp${(product.price * 15000).toLocaleString()}</div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

// Tampilkan detail produk
function renderProductDetail(product) {
  currentProduct = product;

  const container = document.getElementById('productDetails');
  if (!container) return;

  container.innerHTML = `
    <div class="flex-1">
      <img src="${product.image}" alt="${product.title}" class="w-full rounded-xl shadow-lg">
    </div>

    <div class="flex-1 mt-8 lg:mt-0">
      <h1 class="text-2xl font-bold">${product.title}</h1>
      <p class="text-lg text-[#E63946] font-semibold mt-2">Rp${(product.price * 15000).toLocaleString()}</p>
      <p class="mt-4 text-sm text-gray-700">${product.description}</p>

      <div class="mt-10 flex gap-4">
        <button id="addCartBtn" class="bg-[#E63946] text-white px-6 py-2 rounded-full hover:bg-[#d62828] transition">Add to Cart</button>
        <button id="buyNowBtn" class="border border-[#E63946] text-[#E63946] px-6 py-2 rounded-full hover:bg-[#ffe2e2] transition">Buy Now</button>
      </div>
    </div>
  `;

  // event listnr
  setTimeout(() => {
    const addToCartBtn = document.getElementById("addCartBtn");
    const buyNowBtn = document.getElementById("buyNowBtn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addToCart(currentProduct);
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        addToCart(currentProduct);
        window.location.href = "cart.html";
      });
    }
  }, 0);

  fetchReviews(product.id).then(reviews => {
    const reviewContainer = document.getElementById('reviewContainer');
    if (!reviewContainer) return;

    if (reviews.length === 0) {
      reviewContainer.innerHTML = '<p class="text-sm text-gray-500">No reviews yet.</p>';
      return;
    }

    reviewContainer.innerHTML = reviews.map(r => `
      <div class="bg-white p-4 border rounded mb-2 shadow-sm">
        <p class="font-semibold">${r.name}</p>
        <p class="text-sm text-gray-600">${r.body}</p>
      </div>
    `).join('');
  });
}

// push produk ke cart
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart)); 
}

// delete item dari cart  
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity < 1) item.quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cartList");
  const emptyMessage = document.getElementById("emptyMessage");
  const cartSummary = document.getElementById("cartSummary");
  const totalPrice = document.getElementById("totalPrice");

  if (!cartList || !emptyMessage || !cartSummary || !totalPrice) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.classList.remove("hidden");
    const checkoutBtn = document.getElementById("goCheckout");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;
    localStorage.setItem("checkout", JSON.stringify(cart));
    window.location.href = "checkout.html";
  };
}

    cartSummary.classList.add("hidden");
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemPrice = item.price * 15000;
    total += itemPrice * item.quantity;

    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-xl shadow flex justify-between items-center";

    div.innerHTML = `
      <div class="flex gap-4 items-center">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain">
        <div>
          <p class="font-semibold text-sm line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">${item.title}</p>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-1 text-sm bg-gray-200 rounded">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-1 text-sm bg-gray-200 rounded">+</button>
          </div>
        </div>
      </div>
      <div class="text-right space-y-2">
        <p class="text-[#E63946] font-bold max-w-10">Rp ${(itemPrice * item.quantity).toLocaleString()}</p>
        <button onclick="removeFromCart(${item.id})" class="text- text-red-500 hover:text-red-700 flex items-center gap-1">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
    `;

    cartList.appendChild(div);
  });

  totalPrice.textContent = "Rp " + total.toLocaleString();
  cartSummary.classList.remove("hidden");
  emptyMessage.classList.add("hidden");
}

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function handleSearch(products) {
  const input = document.getElementById("searchInput");
  const preview = document.getElementById("searchPreview");

  if (!input || !preview) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();

    if (keyword === "") {
      preview.classList.add("hidden", "opacity-0", "scale-95");
      preview.innerHTML = "";
      return;
    }

    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(keyword)
    );

    renderSearchPreview(filtered);
    preview.classList.remove("hidden");
    setTimeout(() => {
      preview.classList.add("opacity-100", "scale-100");
      preview.classList.remove("opacity-0", "scale-95");
    }, 10);
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !preview.contains(e.target)) {
      preview.classList.remove("opacity-100", "scale-100");
      preview.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        preview.classList.add("hidden");
      }, 200);
    }
  });

  function renderSearchPreview(filtered) {
    preview.innerHTML = "";

    if (filtered.length === 0) {
      preview.innerHTML = `<p class="text-sm text-gray-500 px-4 py-2">Produk tidak ditemukan!</p>`;
      return;
    }

    filtered.slice(0, 6).forEach(product => {
      const item = document.createElement("a");
      item.href = `barang.html?id=${product.id}`;
      item.className = `
        flex items-center px-4 py-2 gap-3 hover:bg-gray-100 border-b 
        last:border-none text-sm text-gray-700 transition
      `;

      item.innerHTML = `
        <div class="w-10 h-10 flex-shrink-0 overflow-hidden rounded bg-white border">
          <img src="${product.image}" alt="${product.title}" class="w-full h-full object-contain" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm line-clamp-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
            ${product.title}
          </p>
        </div>
      `;

      preview.appendChild(item);
    });
  }
}

async function init() {
  const products = await fetchAllProducts();
  const isMain = document.getElementById('featured');
  const isAll = document.getElementById('allProducts');
  const productId = getQueryParam('id');

  if (isMain) {
    const shuffled = shuffleArray(products);
    renderProducts(shuffled.slice(0, 6), document.getElementById('featured'));
    renderProducts(shuffled.slice(6, 12), document.getElementById('flashSale'));
    renderProducts(shuffled.slice(12, 18), document.getElementById('recent'));
  }

  if (isAll) {
    renderProducts(products, isAll);
  }

  if (productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
      renderProductDetail(product);
    } else {
      alert('Product not found!');
    }
  }

  handleSearch(products);
  renderCart();
  renderCheckoutPage();

}

async function fetchReviews(productId) {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments');
  const data = await res.json();
  return data.filter(r => r.postId == productId);
}

init();

function renderCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const confirmBtn = document.getElementById("confirmCheckout");

  if (!checkoutItems || !checkoutTotal || !confirmBtn) return;

  let data = JSON.parse(localStorage.getItem("checkout"));
  if (!Array.isArray(data)) data = [];

  let total = 0;

  if (data.length === 0) {
    checkoutItems.innerHTML = '<p class="text-center text-gray-500">No items in checkout.</p>';
    confirmBtn.disabled = true;
  } else {
    data.forEach(item => {
      const subtotal = item.price * 15000 * item.quantity;
      total += subtotal;

      const div = document.createElement("div");
      div.className = "flex justify-between items-center bg-white p-4 rounded shadow";

      div.innerHTML = `
        <div class="flex items-center gap-4">
          <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain" />
          <div>
            <p class="font-semibold text-sm line-clamp-1 max-w-[160px] text-ellipsis overflow-hidden whitespace-nowrap">${item.title}</p>
            <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
          </div>
        </div>
        <p class="text-[#E63946] font-bold">Rp ${subtotal.toLocaleString("id-ID")}</p>
      `;
      checkoutItems.appendChild(div);
    });

    checkoutTotal.textContent = "Rp " + total.toLocaleString("id-ID");

    confirmBtn.addEventListener("click", () => {
      alert("Terima kasih! Pembayaran berhasil.");
      localStorage.removeItem("checkout");
      window.location.href = "main.html";
    });
  }
}


// modal
