// import { listings } from "../../assets/listings.js";
import "./DisplayListing.css";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const DisplayListing = () => {
  const { listing, backend_url, searchQuery, selectedCategory } = useContext(StoreContext);
  const allListing = listing;
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const toggleFavorite = (idx) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const filteredListing = allListing.filter((item) => {
    if (!searchQuery) return true;
    const q = String(searchQuery).toLowerCase();
    return (
      String(item?.title || "").toLowerCase().includes(q) ||
      String(item?.location || "").toLowerCase().includes(q) ||
      String(item?.country || "").toLowerCase().includes(q)
    );
  });

  // Apply category filter if selected
  const getDerivedCategory = (it) => {
    const c = String(it?.category || "").toLowerCase();
    if (c) return c;
    const hay = `${it?.title || ""} ${it?.description || ""} ${it?.location || ""} ${it?.country || ""}`.toLowerCase();
    if (/beach|sea|ocean|coast/.test(hay)) return "beach";
    if (/mountain|hill|peak/.test(hay)) return "mountains";
    if (/city|downtown|metro|urban/.test(hay)) return "city";
    if (/forest|nature|park|green|lake|river/.test(hay)) return "nature";
    return "trending";
  };

  const finalListing = selectedCategory
    ? filteredListing.filter((it) => getDerivedCategory(it) === selectedCategory)
    : filteredListing;
  return (
    <section className="food-display">
      <header className="fd-header">
        <h1>Explore Stays You'll Love</h1>
      </header>

      <div className="cards">
        {finalListing.map((listing, index) => (
          <article className="card" key={index} onClick={() => navigate(`/view/${listing._id}`)}>
            <div className="card-image">
              {listing?.image?.url ? (
                <img src={`${backend_url}${listing.image.url}`} alt={listing.title} loading="lazy" />
              ) : (
                <div className="no-image" aria-label="No image available" />
              )}
              <button
                className={`favorite-btn${favorites.has(index) ? " active" : ""}`}
                aria-label={favorites.has(index) ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorites.has(index)}
                type="button"
                onClick={(e) => { e.preventDefault(); toggleFavorite(index); }}
              >
                {/* Heart icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 21s-6.716-4.345-9.39-7.02C.943 12.313.5 10.77.5 9.36.5 6.51 2.79 4.5 5.33 4.5c1.52 0 3.03.73 3.92 1.88.89-1.15 2.4-1.88 3.92-1.88 2.54 0 4.83 2.01 4.83 4.86 0 1.41-.44 2.95-2.11 4.62C18.716 16.655 12 21 12 21z"/>
                </svg>
              </button>
            </div>
            <div className="card-body">
              <h2 className="card-title">{listing.title}</h2>
              <p className="card-location">📍 {listing.location}, {listing.country}</p>
              <div className="card-price">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  ₹ {new Intl.NumberFormat('en-IN').format(Number(listing.price))}
                </a>
                <small> / Day</small>
              </div>
              <p className="card-desc">{listing.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DisplayListing;
