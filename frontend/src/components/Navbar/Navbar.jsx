import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();

  const {token, setToken, searchQuery, setSearchQuery, setUserId} = useContext(StoreContext);

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const AddNewListing = () => {
    if(!token){
      toast.error("Please sign in to add a listing");
      setShowLogin(true);
      return;
    }
    navigate('/add-listing');
  }

  const goMyListings = () => {
    if(!token){
      toast.error("Please sign in to view your listings");
      setShowLogin(true);
      return;
    }
    navigate('/my-listings');
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/");
    toast.success("Logged out successfully");
  }


  return (
    <header className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          {/* Hamburger (mobile only) moved to left */}
          <button
            type="button"
            className="hamburger"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(v => !v)}
          >
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
          <div className="logo" aria-label="logo">
            <i className="fa-regular fa-compass" aria-hidden="true"></i>
          </div>
          <button className="link-btn home-link" type="button" onClick={() => navigate('/')}>Home</button>
        </div>

        {/* Center: Search */}
        <form className="nav-search" role="search" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search Listings"
              aria-label="Search Listings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right: CTA + Auth */}
        <div className="nav-right">
          <button className="link-btn add-listing" type="button"
          onClick={() => AddNewListing() }
          >Add New Listing</button>
          <button className="link-btn" type="button" onClick={goMyListings}>My Listings</button>
          <div className="auth-actions">
            {
              token ? 
              <button onClick={() => logout()} className="pill-btn" type="button">Logout</button>
              :
              <button onClick={() => setShowLogin(true)} className="pill-btn" type="button">Sign in</button>
            }
          </div>
        </div>
      </div>

      {/* Mobile Drawer and Overlay */}
      <div className={`drawer-overlay ${drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-header">
          <div className="logo" aria-label="logo">
            <i className="fa-regular fa-compass" aria-hidden="true"></i>
          </div>
          <span className="brand">Menu</span>
          <button type="button" className="drawer-close" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        {/* Drawer links only (search removed as requested) */}
        <nav className="drawer-links">
          <button type="button" className="link" onClick={() => { setDrawerOpen(false); navigate('/'); }}>
            <i className="fa-solid fa-house" aria-hidden="true"></i>
            <span>Home</span>
          </button>
          <button type="button" className="link" onClick={() => { setDrawerOpen(false); AddNewListing(); }}>
            <i className="fa-solid fa-plus" aria-hidden="true"></i>
            <span>Add New Listing</span>
          </button>
          <button type="button" className="link" onClick={() => { setDrawerOpen(false); goMyListings(); }}>
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>My Listings</span>
          </button>
          { token ? (
            <button type="button" className="link" onClick={() => { setDrawerOpen(false); logout(); }}>
              <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
              <span>Logout</span>
            </button>
          ) : (
            <button type="button" className="link" onClick={() => { setDrawerOpen(false); setShowLogin(true); }}>
              <i className="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
              <span>Sign in</span>
            </button>
          )}
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;

