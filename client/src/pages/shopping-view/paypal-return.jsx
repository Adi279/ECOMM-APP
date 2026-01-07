import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchCartItems } from "@/store/shop/cart-slice";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          // Clear the cart after successful payment
          if (user?.id) {
            dispatch(fetchCartItems(user.id)).then(() => {
              window.location.href = "/shop/payment-success";
            });
          } else {
            window.location.href = "/shop/payment-success";
          }
        } else {
          // Handle payment capture failure
          console.error("Payment capture failed:", data?.payload?.message);
          window.location.href = "/shop/paypal-cancel";
        }
      });
    }
  }, [paymentId, payerId, dispatch, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;