document.addEventListener("DOMContentLoaded", () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const historyKey = `orderHistory_${auth.email}`;
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];



  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  const editName = document.getElementById("editName");
  const editEmail = document.getElementById("editEmail");

  const historyContainer = document.getElementById("historyContainer");
  const noHistory = document.getElementById("noHistory");

  // Cek login
  if (!auth) {
    window.location.href = "guest.html";
    return;
  }

  // Tampilkan data user
  profileName.textContent = auth.name;
  profileEmail.textContent = auth.email;

  // Placeholder
  editName.placeholder = auth.name;
  editEmail.placeholder = auth.email;

  // Tampilkan riwayat

  if (history.length > 0) {
    noHistory.classList.add("hidden");
    history.forEach(order => {
    order.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-xl shadow flex justify-between items-center";
    div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain">
        <div>
          <p class="text-sm font-semibold max-w-[180px] truncate">${item.title}</p>
          <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[#E63946] font-bold">Rp ${(item.price * 15000 * item.quantity).toLocaleString("id-ID")}</p>
        <p class="text-xs text-gray-400 mt-1">${order.date}</p>
      </div>
    `;
    historyContainer.appendChild(div);
  });
});

  } else {
    noHistory.classList.remove("hidden");
  }
});

// Logout
function logoutUser() {
  localStorage.removeItem("auth");
  window.location.href = "guest.html";
}

// Edit Profile Handler
document.getElementById("editProfileForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();

  const oldPass = document.getElementById("editPassword")?.value;
  const newPass = document.getElementById("editPassword")?.nextElementSibling?.value;
  const confirmPass = document.getElementById("editPassword")?.nextElementSibling?.nextElementSibling?.value;

  let auth = JSON.parse(localStorage.getItem("auth"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (!auth) return;

  const currentUser = users.find(user => user.email === auth.email);
  if (!currentUser) return;

  // Validasi email baru
  if (newEmail && newEmail !== currentUser.email) {
    const alreadyUsed = users.some(u => u.email === newEmail && u.email !== currentUser.email);
    if (alreadyUsed) {
      alert("Email sudah digunakan oleh pengguna lain.");
      return;
    }
  }

  // Validasi password
  if (oldPass || newPass || confirmPass) {
    if (oldPass !== currentUser.password) {
      alert("Password lama salah.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }
    if (newPass) {
      currentUser.password = newPass;
    }
  }

  // Update name/email
  if (newName) currentUser.name = newName;
  if (newEmail) currentUser.email = newEmail;

  // Update storage
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("auth", JSON.stringify({
    name: currentUser.name,
    email: currentUser.email
  }));

  alert("Profil berhasil diperbarui!");
  location.reload();
});
