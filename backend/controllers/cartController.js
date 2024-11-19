import asyncHandler from "../middleware/asyncHandler.js";
import Cart from "../model/cartModel.js"
import Product from "../model/productModel.js";

const addToCart = asyncHandler(async (req, res) => {

  const { productId, qty } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    // Ensure both sides are strings for comparison
    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex !== -1) {
      // Update quantity if the product already exists in the cart
      cart.cartItems[existingItemIndex].qty = qty;
    } else {
      // Add new item if it doesn't exist in the cart
      cart.cartItems.push({
        name: product.name,
        qty,
        price: product.price,
        totalPrice: product.totalPice,
        image: product.image,
        product: productId,
        countInStock: product.countInStock
      });
    }
  } else {
    // Create a new cart if none exists
    cart = new Cart({
      user: userId,
      cartItems: [
        {
          name: product.name,
          qty,
          price: product.price,
          totalPrice: product.totalPice,
          image: product.image,
          product: productId,
          countInStock: product.countInStock
        },
      ],
    });
  }

  // Calculate prices
  cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;
  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);
  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  await cart.save();
  res.status(201).json(cart);
});


const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if the user has a cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // If no cart, return an empty cart
    return res.status(200).json({ cartItems: [] });
  }

  res.status(200).json(cart);
});



const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if the product exists in the cart
  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Remove the item from cartItems array
  cart.cartItems.splice(itemIndex, 1);

  // Recalculate prices after removal
  cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;
  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);
  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  // Save the updated cart
  await cart.save();
  res.status(200).json(cart);
});

const updateCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user._id;

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if the product exists in the cart
  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Remove the item from cartItems array
  cart.cartItems[itemIndex].qty = qty;

  // Recalculate prices after removal
  cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;
  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);
  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  // Save the updated cart
  await cart.save();
  res.status(200).json(cart);
})

export { addToCart, getCart, removeFromCart, updateCart };


