import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useGetCartQuery } from '../slices/cartSlice';

const Header = () => {
  const { data, isLoading, error } = useGetCartQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  
  // If error occurs, check if it's related to cart data, and display a user-friendly message
  if (error) {
    return <p>Error: {error?.data?.message || "Failed to load cart"}</p>;
  }

  // Safely access cartItems, defaulting to an empty array if no cart found
  const cartItemsCount = data?.cartItems?.length || 0;

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">ECOM</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/cart">
              Cart 
              <span>{cartItemsCount}</span>
            </Link>
          </li>
          <li>
            {userInfo ? (
              <details>
                <summary>{userInfo.name}</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Dark</a></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li onClick={logoutHandler}><a>Logout</a></li>
                </ul>
              </details>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
