/* auth.js — login & registration (localStorage mock, swap the
   TODO blocks for real fetch() calls once the backend is ready) */

const USERS_KEY = "pp_users";
const SESSION_KEY = "pp_logged_in_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;

    document.getElementById("reg-username-error").textContent = "";
    document.getElementById("reg-email-error").textContent = "";
    document.getElementById("reg-password-error").textContent = "";
    document.getElementById("reg-form-error").textContent = "";

    let valid = true;
    if (username.length < 3) {
      document.getElementById("reg-username-error").textContent = "Username must be at least 3 characters.";
      valid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("reg-email-error").textContent = "Enter a valid email address.";
      valid = false;
    }
    if (password.length < 6) {
      document.getElementById("reg-password-error").textContent = "Password must be at least 6 characters.";
      valid = false;
    }
    if (!valid) return;

    // TODO: BACKEND — POST to /api/register instead of this block
    const users = getUsers();
    if (users.some((u) => u.username === username)) {
      document.getElementById("reg-form-error").textContent = "That username is already taken.";
      return;
    }
    users.push({ username, email, password });
    saveUsers(users);

    window.location.href = "index.html?registered=1";
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    document.getElementById("username-error").textContent = "";
    document.getElementById("password-error").textContent = "";
    document.getElementById("form-error").textContent = "";

    if (!username || !password) {
      document.getElementById("form-error").textContent = "Enter both username and password.";
      return;
    }

    // TODO: BACKEND — POST to /api/login instead of this block
    const users = getUsers();
    const match = users.find((u) => u.username === username && u.password === password);

    if (!match) {
      document.getElementById("form-error").textContent = "Incorrect username or password.";
      return;
    }

    sessionStorage.setItem(SESSION_KEY, username);
    window.location.href = "project-form.html";
  });
}