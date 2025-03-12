document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("loginContainer");
  const mobileContainer = document.querySelector(".mobile-container");

  // Check if user is already authenticated
  if (localStorage.getItem("isAuthenticated") === "true") {
    loginContainer.style.display = "none";
    mobileContainer.style.display = "flex";
  } else {
    loginContainer.style.display = "flex";
    mobileContainer.style.display = "none";
  }

  const loginButton = document.getElementById("loginButton");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginErrorMessage = document.getElementById("loginErrorMessage");

  // Simple authentication logic with hardcoded credentials
  loginButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Change these values as needed
    if (username === "user" && password === "password") {
      localStorage.setItem("isAuthenticated", "true");
      loginContainer.style.display = "none";
      mobileContainer.style.display = "flex";
    } else {
      loginErrorMessage.textContent = "Invalid username or password.";
    }
  });
}); 