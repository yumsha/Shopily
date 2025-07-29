// ========== FETCH PRODUK ==========
function renderProducts(products, container) {
  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "flex-shrink-0 w-32 h-44 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden";
    card.innerHTML = `
      <a href="#" class="produk-card" data-guest-card>
        <div class="w-full h-24 flex items-center justify-center p-2 overflow-hidden">
          <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain" />
        </div>
        <div class="p-2 h-20 flex flex-col justify-between">
          <p class="text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap">${product.title}</p>
          <p class="text-sm font-bold text-[#E63946]">Rp ${(product.price * 15000).toLocaleString("id-ID")}</p>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
}

fetch('https://fakestoreapi.in/api/products')
  .then(res => res.json())
  .then(data => {
    const products = data.products || data;
    const productContainer = document.getElementById("productContainer");
    const gridProducts = document.getElementById("gridProducts");

    if (productContainer) renderProducts(products.slice(0, 6), productContainer);
    if (gridProducts) renderProducts(products.slice(0, 12), gridProducts);
  });


// ========== MODAL HANDLING ==========
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");

function openModal() {
  if (modalOverlay && modalBox) {
    modalOverlay.classList.remove("hidden");
    modalOverlay.classList.add("flex");
    modalBox.classList.remove("opacity-100", "scale-100");
    modalBox.classList.add("opacity-0", "scale-90");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalBox.classList.remove("opacity-0", "scale-90");
        modalBox.classList.add("opacity-100", "scale-100");
      });
    });
  }
}

function closeModalFunc() {
  if (modalOverlay && modalBox) {
    modalBox.classList.remove("opacity-100", "scale-100");
    modalBox.classList.add("opacity-0", "scale-90");
    setTimeout(() => {
      modalOverlay.classList.add("hidden");
      modalOverlay.classList.remove("flex");
    }, 300);
  }
}

openModalBtn?.addEventListener("click", openModal);
closeModal?.addEventListener("click", closeModalFunc);

// Klik produk -> buka modal
document.addEventListener("click", function (e) {
  if (e.target.closest("[data-guest-card]")) {
    e.preventDefault();
    openModal();
  }
});

// ========== LOGIN AUTH ==========
document.getElementById("authForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  const modalNotif = document.getElementById("modalNotif");

  if (user) {
    localStorage.setItem("auth", JSON.stringify({ email: user.email, name: user.name }));
    closeModalFunc();
    window.location.href = "main.html";
  } else {
    closeModalFunc();
    setTimeout(() => {
      modalNotif?.classList.remove("hidden");
      modalNotif?.classList.add("flex");
      setTimeout(() => {
        modalNotif?.classList.add("hidden");
        modalNotif?.classList.remove("flex");
      }, 2500);
    }, 300);
  }
});
