const welcomeText = document.getElementById("welcome-text");
const userMeta = document.getElementById("user-meta");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const actionList = document.getElementById("action-list");
const logoutButton = document.getElementById("logout-button");
const refreshButton = document.getElementById("refresh-button");

if (!getToken()) {
  window.location.href = "./login.html";
}

function renderUser(user) {
  userMeta.innerHTML = `<strong>${user.nickname}</strong><br />${user.roleName}`;
  userName.textContent = user.nickname;
  userRole.textContent = user.roleName;
}

function renderActions(actions) {
  actionList.innerHTML = "";
  actions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    actionList.appendChild(li);
  });
}

async function loadHome() {
  try {
    const [meResponse, overviewResponse] = await Promise.all([
      request("/api/auth/me"),
      request("/api/home/overview"),
    ]);

    const user = meResponse.data;
    saveAuth(getToken(), user);
    renderUser(user);
    welcomeText.textContent = overviewResponse.data.welcomeText;
    renderActions(overviewResponse.data.quickActions);
  } catch (error) {
    clearAuth();
    alert(error.message);
    window.location.href = "./login.html";
  }
}

refreshButton.addEventListener("click", loadHome);

logoutButton.addEventListener("click", async () => {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error(error);
  } finally {
    clearAuth();
    window.location.href = "./login.html";
  }
});

renderUser(getUser() || { nickname: "加载中", roleName: "--" });
loadHome();
