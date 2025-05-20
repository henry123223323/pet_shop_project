// src/context/CartContext.jsx
import React, { Component, createContext } from 'react';

export const CartContext = createContext();

export class CartProvider extends Component {
    state = {
        cartList: [],
        sellers: [],
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cartList: this.state.cartList,
                    addToCart: this.addToCart,
                    updateQuantity: this.updateQuantity,
                    removeFromCart: this.removeFromCart,
                    clearCart: this.clearCart,
                    setSellers: this.setSellers,
                    getSellerName: this.getSellerName,
                    normalizeCartItem: this.normalizeCartItem
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }

    // 設定 seller 名單
    setSellers = (userList) => {

        if (Array.isArray(userList)) {
            const merged = [...this.state.sellers, ...userList.map(user => ({
                ...user,
                uid: String(user.uid) // ✅ 強制轉成 string
            }))];
            const uniqueSellers = Array.from(
                new Map(merged.map(user => [String(user.uid), user])).values()
            );
            this.setState({ sellers: uniqueSellers });
        } else {
            console.warn("❌ 傳入 setSellers 的不是陣列：", userList);
        }
    };

    // 透過 uid 找 seller username
    getSellerName = (uid) => {
        if (!uid) return '未知賣家';

        const seller = this.state.sellers.find(user => String(user.uid) === String(uid));

        // 避免 seller 為 undefined 時就嘗試存取 .username
        if (seller) {
            //   console.log("🔍 找到 seller =", seller.username);
            return seller.username;
        } else {
            //   console.log("⚠️ 沒有找到 seller：uid =", uid);
            return `UID: ${uid}（未找到賣家）`;
        }
    };

    componentDidMount() {
        const savedCart = localStorage.getItem('cartList');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                const formatted = parsed.map(item => {
                    const cartId = String(item.cart_id || item.pid);
                    return {
                        ...item,
                        cart_id: cartId,
                    };
                });
                this.setState({ cartList: formatted });
            } catch (err) {
                console.error("❌ 載入 cartList 時 JSON 解析失敗：", err);
            }
        }

        const savedSellers = localStorage.getItem('sellers');
        if (savedSellers) {
            try {
                this.setState({ sellers: JSON.parse(savedSellers) });
            } catch (err) {
                console.error("❌ 載入 sellers 時 JSON 解析失敗：", err);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cartList !== this.state.cartList) {
            localStorage.setItem('cartList', JSON.stringify(this.state.cartList));
        }
        if (prevState.sellers !== this.state.sellers) {
            localStorage.setItem('sellers', JSON.stringify(this.state.sellers));
        }
    }

    addToCart = (newItem) => {
        const normalized = this.normalizeCartItem(newItem);
        console.log("✅ addToCart 正規化後的 uid：", normalized.uid, "condition:", normalized.condition);

        let result = 'new';

        this.setState((prevState) => {
            const existingIndex = prevState.cartList.findIndex(item =>
                item.pid === normalized.pid &&
                String(item.uid) === String(normalized.uid) &&
                (item.spec || null) === (normalized.spec || null)
            );

            if (existingIndex !== -1) {
                const updatedCartList = [...prevState.cartList];
                const currentQty = updatedCartList[existingIndex].quantity || 0;
                updatedCartList[existingIndex].quantity = currentQty + (normalized.quantity || 1);
                result = 'updated';
                return { cartList: updatedCartList };
            } else {
                return {
                    cartList: [
                        ...prevState.cartList,
                        { ...normalized, quantity: normalized.quantity || 1 }
                    ]
                };
            }
        });

        return result;
    };


    updateQuantity = (cart_id, quantity) => {
        this.setState((prev) => ({
            cartList: prev.cartList.map((item) =>
                item.cart_id === cart_id ? { ...item, quantity } : item
            ),
        }));
    };

    removeFromCart = (cart_id) => {
        this.setState((prev) => ({
            cartList: prev.cartList.filter((item) => item.cart_id !== cart_id),
        }));
    };

    clearCart = () => this.setState({ cartList: [] });

    //統一不同地方的命名
    normalizeCartItem = (item) => {
        if (item._normalized) return item;


        //  抓圖片路徑
        const rawPath =
            (Array.isArray(item.images) && item.images[0]?.img_path) || // 圖片陣列（前端用）
            item.img_path || // ✅ 後端撈出來的資料庫欄位
            item.image || // 備援欄位
            null;


        //  不加 IMAGE_HOST，直接用相對路徑
        const fullImagePath = rawPath || "/media/default/no-image.png";

        // console.log("🧪 圖片處理", {
        //     img_path: rawPath,
        //     final: fullImagePath,
        // });
        const cartId = String(item.cart_id || item.pid);
        const priceSource = item.price !== undefined ? item.price : item.unit_price;
        const parsedPrice = parseInt(priceSource, 10);
        return {
            _normalized: true,
            cart_id: cartId,
            pid: item.pid,
            // 🧑‍🛒 購物車擁有者（登入者 uid）→ 影響寫入資料庫
            uid: item.uid ? String(item.uid) : null,

            // 🏪 商品賣家（影響顯示 SellerTitle 區分）
            seller_uid: item.seller_uid ? String(item.seller_uid) : null,
            condition: item.condition || "new",
            quantity: item.quantity || 1,
            productName: item.pd_name || item.productName || item.name,
            unit_price: isNaN(parsedPrice) ? 0 : parsedPrice,
            image: fullImagePath,
            //   color: item.attribute?.color || item.color || "無",
        };
    };


}