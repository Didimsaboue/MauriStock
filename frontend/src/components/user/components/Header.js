import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../styles/Header.css";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlinePercentBadge } from "react-icons/hi2";
import { HiMenu } from "react-icons/hi";
import logo from 'logo.png';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setShowMobileMenu(false); // Menüyü kapat
    }
  };

  const toggleMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="bg-white shadow-sm py-2">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Icône Accueil"
              className="me-2"
              style={{ width: "100px" }}
            />
          </Link>
        </div>

        <div className="search-bar w-50">
          <div className="input-group">
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Rechercher un produit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              aria-label="Rechercher un produit"
            />
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search text-warning"></i>
            </span>
          </div>
        </div>

        <nav className="desktop-menu d-none d-md-flex align-items-center">
          <Link to="/promotions" className="text-secondary me-3 text-decoration-none d-flex align-items-center">
            <HiOutlinePercentBadge className="fs-4 me-1 text-warning" /> Promotions
          </Link>
          <Link to="/card" className="text-secondary me-3 text-decoration-none d-flex align-items-center">
            <IoBagHandleOutline className="fs-5 me-1 text-warning" /> Carte Mauristock
          </Link>
        </nav>

        <button className="mobile-menu-btn d-md-none border-0 bg-transparent" onClick={toggleMenu}>
          <HiMenu className="fs-4 text-warning" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${showMobileMenu ? 'show' : ''}`}
        onClick={() => setShowMobileMenu(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${showMobileMenu ? 'show' : ''}`}>
        <button 
          className="mobile-menu-close"
          onClick={() => setShowMobileMenu(false)}
        >
          ×
        </button>
        <Link 
          to="/promotions" 
          className="mobile-menu-item" 
          onClick={() => setShowMobileMenu(false)}
        >
          <HiOutlinePercentBadge size={20} />
          <span>Promotions</span>
        </Link>
        <Link 
          to="/card" 
          className="mobile-menu-item" 
          onClick={() => setShowMobileMenu(false)}
        >
          <IoBagHandleOutline size={20} />
          <span>Carte Mauristock</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
