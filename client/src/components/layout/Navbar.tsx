import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

type User = {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  phone: string | null;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  isActive: boolean;
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  let user: User | null = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser) as User;
    } catch {
      user = null;
    }
  }

  const isAuthenticated = Boolean(token && user);

  const isCustomer = user?.role === "CUSTOMER";
  const isVendor = user?.role === "VENDOR";
  const isAdmin = user?.role === "ADMIN";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeMenu();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Eventra{" "}
          <span className="text-purple-600">
            WB
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            Home
          </Link>

          <Link
            to="/packages"
            className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
          >
            Packages
          </Link>

          {isCustomer && (
            <>
              <Link
                to="/vendors"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                Find Services
              </Link>

              <Link
                to="/ai-planner"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                AI Planner
              </Link>

              <Link
                to="/events"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                My Events
              </Link>
            </>
          )}

          {isVendor && (
            <>
              <Link
                to="/vendor/dashboard"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                Dashboard
              </Link>

              <Link
                to="/vendor/services"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                Services
              </Link>

              <Link
                to="/vendor/packages"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                My Packages
              </Link>

              <Link
                to="/vendor/bookings"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                Bookings
              </Link>

              <Link
                to="/vendor/reviews"
                className="text-sm font-medium text-slate-700 transition hover:text-purple-600"
              >
                Reviews
              </Link>
            </>
          )}

          {isAdmin && (
            <span className="text-sm font-medium text-slate-700">
              Admin
            </span>
          )}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-slate-600">
                {user?.name ||
                  user?.username ||
                  user?.email}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>

            <Link
              to="/packages"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Packages
            </Link>

            {isCustomer && (
              <>
                <Link
                  to="/vendors"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Find Services
                </Link>

                <Link
                  to="/ai-planner"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  AI Planner
                </Link>

                <Link
                  to="/events"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Events
                </Link>
              </>
            )}

            {isVendor && (
              <>
                <Link
                  to="/vendor/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Vendor Dashboard
                </Link>

                <Link
                  to="/vendor/services"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Services
                </Link>

                <Link
                  to="/vendor/packages"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Packages
                </Link>

                <Link
                  to="/vendor/bookings"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Vendor Bookings
                </Link>

                <Link
                  to="/vendor/reviews"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Customer Reviews
                </Link>
              </>
            )}

            {isAdmin && (
              <div className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700">
                Admin
              </div>
            )}

            <div className="mt-3 border-t border-slate-200 pt-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 block rounded-lg bg-purple-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-3 text-sm text-slate-600">
                    {user?.name ||
                      user?.username ||
                      user?.email}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;