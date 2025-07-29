document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validasi password cocok
    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    // Ambil data user sebelumnya
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah email sudah terdaftar
    const isExist = users.some(user => user.email === email);
    if (isExist) {
      alert("Email sudah digunakan!");
      return;
    }

    // Simpan user baru
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Tampilkan modal sukses
    const modal = document.getElementById("modalSuccess");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      setTimeout(() => {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        window.location.href = "guest.html"; // Redirect ke login
      }, 2500);
    }
  });
});
