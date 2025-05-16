import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { local_food } from "../assets/assets.js";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  //
  const url = import.meta.env.VITE_PUBLIC_URL;
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token: token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token: token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemID in cartItems) {
      if (cartItems[itemID] > 0) {
        let itemInfo = food_list.find((product) => product._id === itemID);
        totalAmount += itemInfo.price * cartItems[itemID];
      }
    }
    return totalAmount;
  };
  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token: token } }
    );
    setCartItems(response.data.cartData);
  };
  //
  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    setFoodList(response.data.data);
  };
  //
  useEffect(() => {
    async function loadData() {
      setFoodList(local_food);
      // console.log("local food is", local_food);
      // await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token")); //so that user remain logged in
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
