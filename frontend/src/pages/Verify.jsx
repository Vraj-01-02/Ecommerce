import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../utils/userApi";
import { ShopContext } from "../context/ShopContext";

const Verify = () => {
  const { setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // 🔐 BASIC GUARD
        if (!success || !orderId) {
          toast.error("Invalid payment session");
          navigate("/");
          return;
        }

        // ✅ ONLY userApi (NO backendUrl, NO headers)
        const res = await userApi.post("/api/order/verifyStripe", {
          success,
          orderId,
        });

        if (res.data.success) {
          setCartItems({}); // clear cart
          toast.success("Payment verified successfully");
          navigate("/orders");
        } else {
          toast.error("Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Verify error:", error);
        toast.error("Payment verification failed");
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [success, orderId, navigate, setCartItems]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-lg font-semibold">Verifying payment...</h2>
    </div>
  );
};

export default Verify;
