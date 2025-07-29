// Render card
function renderProducts(products, container) {
  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = `
      produk-card bg-white rounded-xl shadow-md hover:shadow-lg 
      transition-shadow duration-300 overflow-hidden w-32 h-44
    `;
    card.setAttribute("data-guest-card", "");

    card.innerHTML = `
      <a href="#" class="flex flex-col h-full">
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

// Fetch produk
fetch('https://fakestoreapi.in/api/products')
  .then(res => res.json())
  .then(data => {
    const products = data.products || data;
    const gridContainer = document.getElementById('gridProducts');
    const carouselContainer = document.getElementById('productContainer');

    if (gridContainer) renderProducts(products.slice(0, 12), gridContainer);
    if (carouselContainer) renderProducts(products.slice(0, 6), carouselContainer);
  })
  .catch(err => console.error("Fetch error:", err));

// Fungsi untuk buka modal login
function openLoginModal() {
  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');

  if (overlay && box) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    box.classList.remove('opacity-100', 'scale-100');
    box.classList.add('opacity-0', 'scale-90');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        box.classList.remove('opacity-0', 'scale-90');
        box.classList.add('opacity-100', 'scale-100');
      });
    });
  }
}

// Buka modal saat produk guest diklik
document.addEventListener("click", function (e) {
  const target = e.target.closest('[data-guest-card]');
  if (target) {
    e.preventDefault();
    openLoginModal();
  }
});

// Buka modal dari tombol Sign In navbar
document.getElementById('openModalBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openLoginModal();
});

// Tutup modal login
document.getElementById('closeModal')?.addEventListener('click', () => {
  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');

  if (box) {
    box.classList.remove('opacity-100', 'scale-100');
    box.classList.add('opacity-0', 'scale-90');
  }

  setTimeout(() => {
    overlay?.classList.remove('flex');
    overlay?.classList.add('hidden');
  }, 300);
});

// Login auth
document.getElementById('authForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');
  const notif = document.getElementById('modalNotif');

  if (user) {
    localStorage.setItem('auth', JSON.stringify({ email: user.email, name: user.name }));

    box?.classList.remove('opacity-100', 'scale-100');
    box?.classList.add('opacity-0', 'scale-90');

    setTimeout(() => {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');
      window.location.href = 'main.html';
    }, 300);

    alert('Login berhasil!');
  } else {
    box?.classList.remove('opacity-100', 'scale-100');
    box?.classList.add('opacity-0', 'scale-90');

    setTimeout(() => {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');

      if (notif) {
        notif.classList.remove('hidden');
        notif.classList.add('flex');

        setTimeout(() => {
          notif.classList.add('hidden');
          notif.classList.remove('flex');
        }, 2500);
      }
    }, 300);
  }
});
