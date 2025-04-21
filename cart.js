document.addEventListener('DOMContentLoaded', function() {
    console.log("開始初始化購物車功能");
    
    class SimpleCart {
        constructor() {
            this.items = [];
            this.loadFromStorage();
            this.updateDisplay();
            console.log("購物車已初始化");
        }
        
        loadFromStorage() {
            try {
                const savedCart = localStorage.getItem('teahouse-cart');
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                    console.log(`從存儲載入了${this.items.length}件商品`);
                }
            } catch (e) {
                console.error("載入購物車資料失敗:", e);
                this.items = [];
            }
        }
        
        saveToStorage() {
            try {
                localStorage.setItem('teahouse-cart', JSON.stringify(this.items));
            } catch (e) {
                console.error("保存購物車失敗:", e);
            }
        }
        
        addProduct(id, name, price) {
            if (!id || !name || isNaN(parseFloat(price))) {
                console.error("商品資訊不完整", {id, name, price});
                return false;
            }
            
            const existingItem = this.items.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
                console.log(`增加商品: ${name}現在有${existingItem.quantity}件`);
            } else {
                this.items.push({
                    id: id,
                    name: name,
                    price: parseFloat(price),
                    quantity: 1
                });
                console.log(`添加新商品: ${name}, 價格: ${price}`);
            }
            
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }
        
        removeProduct(id) {
            const index = this.items.findIndex(item => item.id === id);
            if (index === -1) return false;
            
            if (this.items[index].quantity > 1) {
                this.items[index].quantity--;
                console.log(`減少商品: ${this.items[index].name}現在有${this.items[index].quantity}件`);
            } else {
                console.log(`移除商品: ${this.items[index].name}`);
                this.items.splice(index, 1);
            }
            
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }
        
        clear() {
            this.items = [];
            this.saveToStorage();
            this.updateDisplay();
            console.log("購物車已清空");
        }
        
        getTotalQuantity() {
            return this.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        getTotalPrice() {
            return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        updateDisplay() {
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = this.getTotalQuantity();
            }
            
            const cartContentElement = document.getElementById('cart-content');
            if (cartContentElement) {
                cartContentElement.innerHTML = '';
                
                if (this.items.length === 0) {
                    cartContentElement.innerHTML = '<li style="text-align:center; padding:10px;">目前購物車是空的</li>';
                } else {
                    this.items.forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <div>
                                <strong>${item.name}</strong> - $${item.price} x ${item.quantity} = <strong>$${(item.price * item.quantity).toFixed(0)}</strong>
                            </div>
                            <button class="remove-item" data-id="${item.id}">🗑</button>
                        `;
                        cartContentElement.appendChild(li);
                    });
                }
            }
            
            const totalPriceElement = document.getElementById('cart-total-price');
            if (totalPriceElement) {
                totalPriceElement.textContent = `總金額：$ ${Math.round(this.getTotalPrice())} 元`;
            }
            
            const checkoutButton = document.getElementById('checkout-button');
            if (checkoutButton) {
                checkoutButton.disabled = this.items.length === 0;
            }
        }
    }
    
    window.shopCart = new SimpleCart();
    
    const cartIcon = document.getElementById('cart');
    const cartContainer = document.getElementById('cart-container');
    
    if (cartIcon && cartContainer) {
        cartIcon.onclick = function() {
            console.log('切換購物車顯示狀態');
            cartContainer.classList.toggle('hidden');
            
            if (!cartContainer.classList.contains('hidden')) {
                window.shopCart.updateDisplay();
            }
        };
    }
    
    const closeCartButton = document.getElementById('close-cart');
    if (closeCartButton && cartContainer) {
        closeCartButton.onclick = function() {
            cartContainer.classList.add('hidden');
        };
    }
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.onclick = function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            
            console.log('點擊添加購物車按鈕:', {productId, productName, productPrice});
            
            if (productId && productName && productPrice) {
                window.shopCart.addProduct(productId, productName, parseFloat(productPrice));
            } else {
                console.error("商品按鈕缺少必要屬性", {
                    productId, productName, productPrice,
                    buttonHTML: this.outerHTML
                });
            }
        };
    });
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item')) {
            const itemId = event.target.getAttribute('data-id');
            if (itemId) {
                window.shopCart.removeProduct(itemId);
            }
        }
    });
    
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.onclick = function() {
            if (window.shopCart.items.length === 0) {
                alert("購物車是空的，無法結帳！");
                return;
            }
            
            fetch("user.php?" + new Date().getTime())
                .then(response => response.json())
                .then(userData => {
                    if (!userData.loggedIn) {
                        alert("請先登入後再進行結帳！");
                        window.location.href = "login.html";
                        return Promise.reject('user_not_logged_in'); 
                    }
                    
                    const orderData = {
                        uid: userData.id,
                        total_price: window.shopCart.getTotalPrice(),
                        items: window.shopCart.items
                    };
                    
                    return fetch("checkout.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(orderData)
                    });
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`訂單已送出！訂單編號: ${data.order_id}`);
                        window.shopCart.clear();
                        
                        if (cartContainer) {
                            cartContainer.classList.add('hidden');
                        }
                    } else {
                        alert("訂單提交失敗：" + data.message);
                    }
                })
                .catch(error => {
                    if (error !== 'user_not_logged_in') {
                        console.error("結帳過程中發生錯誤：", error);
                        alert("結帳過程中發生錯誤，請稍後再試！");
                    }
                });
        };
    }
    
    console.log("購物車功能初始化完成");
});