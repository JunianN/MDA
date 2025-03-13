document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("loginContainer");
  const mobileContainer = document.querySelector(".mobile-container");

  // Get both forms
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Toggle links
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  // Elements for login form
  const loginButton = document.getElementById("loginButton");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginErrorMessage = document.getElementById("loginErrorMessage");

  // Elements for register form
  const registerButton = document.getElementById("registerButton");
  const registerUsernameInput = document.getElementById("registerUsername");
  const registerPasswordInput = document.getElementById("registerPassword");
  const registerConfirmPasswordInput = document.getElementById("registerConfirmPassword");
  const registerErrorMessage = document.getElementById("registerErrorMessage");

  // Function to show login form and hide registration form
  function showLoginForm() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginErrorMessage.textContent = "";
    registerErrorMessage.textContent = "";
  }

  // Function to show registration form and hide login form
  function showRegisterForm() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    loginErrorMessage.textContent = "";
    registerErrorMessage.textContent = "";
  }

  // Check if user is already authenticated
  if (localStorage.getItem("isAuthenticated") === "true") {
    loginContainer.style.display = "none";
    mobileContainer.style.display = "flex";
  } else {
    loginContainer.style.display = "flex";
    mobileContainer.style.display = "none";
  }

  // Toggle between forms
  showRegister.addEventListener("click", function (e) {
    e.preventDefault();
    showRegisterForm();
  });

  showLogin.addEventListener("click", function (e) {
    e.preventDefault();
    showLoginForm();
  });

  // Login logic
  loginButton.addEventListener("click", function () {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    const registeredUser = localStorage.getItem("registeredUser");
    if (!registeredUser) {
      loginErrorMessage.textContent = "No account found. Please register first.";
      return;
    }

    const { username: regUsername, password: regPassword } = JSON.parse(registeredUser);

    if (username === regUsername && password === regPassword) {
      localStorage.setItem("isAuthenticated", "true");
      loginContainer.style.display = "none";
      mobileContainer.style.display = "flex";
    } else {
      loginErrorMessage.textContent = "Invalid username or password.";
    }
  });

  // Registration logic
  registerButton.addEventListener("click", function () {
    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const confirmPassword = registerConfirmPasswordInput.value.trim();

    if (!username || !password || !confirmPassword) {
      registerErrorMessage.textContent = "All fields are required.";
      return;
    }

    if (password !== confirmPassword) {
      registerErrorMessage.textContent = "Passwords do not match.";
      return;
    }

    // Store the registered user in localStorage
    const newUser = { username, password };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    // Optionally, automatically log the user in after registration:
    localStorage.setItem("isAuthenticated", "true");
    loginContainer.style.display = "none";
    mobileContainer.style.display = "flex";
  });
});