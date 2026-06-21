const welcomeText = document.getElementById("welcome-text");
const userMeta = document.getElementById("user-meta");
const userRoleBadge = document.getElementById("user-role-badge");
const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const actionList = document.getElementById("action-list");
const logoutButton = document.getElementById("logout-button");
const refreshButton = document.getElementById("refresh-button");

if (!getToken()) {
  window.location.href = "./login.html";
}

function renderUser(user) {
  userMeta.innerHTML = `
    <span class="user-name-text">${user.nickname}</span>
    <span class="user-subtext">当前在线用户</span>
  `;
  userRoleBadge.textContent = user.roleName;
  userName.textContent = user.nickname;
  userRole.textContent = user.roleName;
}

function renderActions(actions) {
  actionList.innerHTML = "";
  actions.forEach((item) => {
    const li = document.createElement("li");
    li.className = "action-item";
    li.innerHTML = `
      <div class="action-item-main">
        <span class="action-item-icon">
          <img src="./assets/images/icons/transparent/refresh.png" alt="" />
        </span>
        <div>
          <span class="action-item-title">${item}</span>
          <span class="action-item-subtitle">更新系统最新数据</span>
        </div>
      </div>
      <span class="action-item-arrow">›</span>
    `;
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
