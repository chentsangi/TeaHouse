// 簡化版的用戶顯示代碼 - 專門為統一的HTML結構設計
document.addEventListener("DOMContentLoaded", function() {
    console.log("user-display.js loaded");
    
    // 檢查登入狀態並更新顯示
    function checkLoginStatus() {
        fetch("user.php?nocache=" + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                console.log("從伺服器獲取的用戶資料:", data);
                
                const userWelcome = document.querySelector("#user-welcome");
                const loginBtn = document.querySelector(".login-button");
                const registerBtn = document.querySelector(".register-button");
                const logoutBtn = document.querySelector(".logout-button");
                
                // 確保所有元素都存在
                if (userWelcome && loginBtn && registerBtn && logoutBtn) {
                    if (data.loggedIn) {
                        // 用戶已登入，顯示用戶名
                        userWelcome.textContent = `歡迎回來,${data.name || '訪客'}!`;
                        loginBtn.classList.add("d-none");
                        registerBtn.classList.add("d-none");
                        logoutBtn.classList.remove("d-none");
                    } else {
                        // 用戶未登入，清空顯示
                        userWelcome.textContent = "";
                        loginBtn.classList.remove("d-none");
                        registerBtn.classList.remove("d-none");
                        logoutBtn.classList.add("d-none");
                    }
                } else {
                    console.warn("找不到所需的DOM元素");
                }
            })
            .catch(error => {
                console.error("獲取用戶資訊時發生錯誤:", error);
            });
    }
    
    // 設置登出按鈕
    function setupLogoutButton() {
        const logoutBtn = document.querySelector(".logout-button");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function() {
                fetch("logout.php", {
                    method: "POST",
                    credentials: "include"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("成功登出 !");
                        window.location.href = "login.html";
                    } else {
                        alert("登出失敗：" + data.message);
                    }
                })
                .catch(error => console.error("登出錯誤:", error));
            });
        }
    }
    
    // 初始化
    checkLoginStatus();
    setupLogoutButton();
});