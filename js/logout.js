function checkLoginStatus() {
    fetch("user.php?nocache=" + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            let goTonext = document.querySelector(".goTonext");
            let loginBtn = document.querySelector(".login-button");
            let registerBtn = document.querySelector(".register-button");
            let logoutBtn = document.querySelector(".logout-button");

            if (data.loggedIn) {
                goTonext.textContent = `歡迎回來, ${data.name || '訪客'}!`;
                logoutBtn.classList.remove("d-none");
                loginBtn.classList.add("d-none");
                registerBtn.classList.add("d-none");
            } else {
                goTonext.textContent = "請登入";
                logoutBtn.classList.add("d-none");
                loginBtn.classList.remove("d-none");
                registerBtn.classList.remove("d-none");
            }
        })
        .catch(error => console.error("登入狀態請求錯誤:", error));
}

// 頁面載入時執行
document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();

    let logoutBtn = document.querySelector(".logout-button");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("logout.php", {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("成功登出");
                    sessionStorage.clear(); // 清除 sessionStorage
                    localStorage.clear(); // 清除 localStorage
                    checkLoginStatus(); // 🔄 重新檢查登入狀態，確保 UI 更新
                    setTimeout(() => {
                        window.location.href = "login.html"; // 轉跳到登入頁面
                    }, 500); // 稍微延遲確保 UI 更新
                } else {
                    alert("登出失敗：" + data.message);
                }
            })
            .catch(error => console.error("登出錯誤:", error));
        });
    }
});
