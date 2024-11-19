import { Link, useNavigate } from "react-router-dom";
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartMutation } from "../slices/cartSlice";
import { MdDelete } from "react-icons/md";

const CartScreen = () => {
  const { data: cart, isLoading, error } = useGetCartQuery();
  console.log(cart);

  const [updateCart] = useUpdateCartMutation();
  const updateCartHandler = async (productId, qty) => {
    try {
      await updateCart({ productId, qty }).unwrap();
      console.log("Item updated in cart successfully");
    } catch (err) {
      console.error("Failed to update item in cart:", err);
    }
  };

  const [removeFromCart] = useRemoveFromCartMutation();
  const removeFromCartHandler = async (productId) => {
    try {
      await removeFromCart({ productId }).unwrap();
      console.log("Item removed from cart successfully");
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const navigate = useNavigate();
  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  if (isLoading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error?.data?.message || "Failed to load cart"}</p>;

  const cartItems = cart?.cartItems || [];

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-5xl font-bold mb-10 text-center text-primary">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="alert alert-warning shadow-lg text-center">
          <span className="text-lg font-semibold">Your cart is empty. Start adding items!</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10 mt-10">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div className="flex gap-5 items-center bg-white shadow-md rounded-md p-4" key={item._id}>
                {/* Product Image */}
                <div className="w-1/4">
                  <Link to={`/product/${item.product}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-md shadow-lg object-cover w-full h-full"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="w-3/4">
                  <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Price: <span className="font-semibold">${item.price}</span></p>
                  <p className="text-gray-600">Total: <span className="font-semibold">${item.totalPrice}</span></p>

                  {item.countInStock > 0 && (
                    <div className="flex items-center mt-3">
                      <label htmlFor="quantity" className="mr-2">Qty:</label>
                      <select
                        value={item.qty}
                        onChange={(e) => updateCartHandler(item.product, Number(e.target.value))}
                        className="select select-bordered w-20"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    className="btn btn-error btn-circle mt-3"
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <MdDelete size="20px" color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="bg-white shadow-lg rounded-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <p className="text-gray-600 mb-3">
              Subtotal: <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.qty, 0)} items</span>
            </p>
            <p className="text-gray-600 mb-5">
              Total Price: <span className="font-bold text-lg">${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </p>
            <button
              className="btn btn-success w-full text-lg font-semibold"
              onClick={checkOutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
