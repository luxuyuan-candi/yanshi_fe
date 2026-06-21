const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit-button");
const formMessage = document.getElementById("form-message");

if (getToken()) {
  window.location.href = "./index.html";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    formMessage.textContent = "请输入账号和密码";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "登录中...";
  formMessage.textContent = "";

  try {
    const response = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    saveAuth(response.data.token, response.data.user);
    window.location.href = "./index.html";
  } catch (error) {
    formMessage.textContent = error.message;
    passwordInput.value = "";
    passwordInput.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "登录";
  }
});

