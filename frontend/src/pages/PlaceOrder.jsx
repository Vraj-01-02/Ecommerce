import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import userApi from "../utils/userApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const {
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    token,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((productId) => {
        Object.keys(cartItems[productId]).forEach((size) => {
          const quantity = cartItems[productId][size];

          if (quantity > 0) {
            const product = products.find((p) => p._id === productId);

            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                size,
                quantity,
              });
            }
          }
        });
      });

      if (orderItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      /* ================= COD ORDER ================= */
      if (method === "cod") {
        const res = await userApi.post(
          "/api/order/place",
          orderData
        );

        if (res.data.success) {
          setCartItems({});                // clear cart state
          localStorage.removeItem("cartItems"); // clear storage
          toast.success("Order placed successfully");
          navigate("/orders");
        } else {
          toast.error(res.data.message);
        }
      }

      /* ================= STRIPE ORDER ================= */
      if (method === "stripe") {
        const res = await userApi.post(
          "/api/order/stripe",
          orderData
        );

        if (res.data.success) {
          window.location.href = res.data.session_url;
        } else {
          toast.error(res.data.message);
        }
      }

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-full sm:max-w-120">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="First name" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="Last name" />
        </div>

        <input required name="email" value={formData.email} onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full" placeholder="Email address" />

        <input required name="street" value={formData.street} onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full" placeholder="Street" />

        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="City" />
          <input required name="state" value={formData.state} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="Zip code" />
          <input required name="country" value={formData.country} onChange={onChangeHandler}
            className="border rounded py-1.5 px-3.5 w-full" placeholder="Country" />
        </div>

        <input required name="phone" value={formData.phone} onChange={onChangeHandler}
          className="border rounded py-1.5 px-3.5 w-full" placeholder="Phone" />
      </div>

      {/* RIGHT */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`bg-black text-white px-16 py-3 text-sm ${
                loading ? "opacity-60" : ""
              }`}
            >
              {loading ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
