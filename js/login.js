document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();

    // 登入功能
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let email = document.getElementById("loginEmail").value;
            let password = document.getElementById("loginPassword").value;

            fetch("login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    sessionStorage.setItem("username", data.name);
                    window.location.href = data.redirect || "teahouse.html";
                }
            })
            .catch(error => console.error("登入請求錯誤:", error));
        });
    }

    // 登出功能
    document.addEventListener("DOMContentLoaded", function () {
        console.log("login.js 載入成功");
    
        // 確保 `.logout-button` 存在
        setTimeout(() => {
            const logoutBtn = document.querySelector(".logout-button");
            console.log(logoutBtn); // 測試是否找到按鈕
    
            if (logoutBtn) {
                logoutBtn.classList.remove("d-none"); // 先確保登出按鈕可見
                logoutBtn.addEventListener("click", function () {
                    fetch("logout.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(data.message);
                            sessionStorage.clear(); // ✅ 清除 sessionStorage
                            window.location.href = "login.html"; // ✅ 跳轉回登入頁
                        }
                    })
                    .catch(error => console.error("登出請求錯誤:", error));
                });
            } else {
                console.warn("⚠️ 找不到 .logout-button，請檢查 HTML 內是否存在！");
            }
        }, 500); // 等待 0.5 秒，確保 DOM 載入
    });
    
    


    // 檢查用戶登入狀態
    function checkLoginStatus() {
        fetch("user.php")
        .then(response => response.json())
        .then(data => {
            let goTonext = document.querySelector(".goTonext");
            let loginBtn = document.querySelector(".login-button");
            let registerBtn = document.querySelector(".register-button");
            let logoutBtn = document.querySelector(".logout-button");

            if (!goTonext || !loginBtn || !registerBtn || !logoutBtn) return;

            if (data.loggedIn) {
                let username = data.name || sessionStorage.getItem("username") || "會員";
                goTonext.textContent = `親愛的會員, 歡迎回來! ${username}`;
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
});
