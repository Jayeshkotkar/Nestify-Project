import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyListings.css";

const MyListings = () => {
  const { backend_url, token } = useContext(StoreContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (!token) {
        toast.error("Please sign in to view your listings");
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(`${backend_url}/api/listing/mine`);
        if (res.data?.success) {
          setItems(res.data.data || []);
        } else {
          toast.error(res.data?.message || "Failed to load your listings");
        }
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load your listings";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [backend_url, token, navigate]);

  if (loading) return <section className="my-listings"><div className="my-header"><h1>My Listings</h1><p>Loading your listings...</p></div></section>;

  return (
    <section className="my-listings">
      <header className="my-header">
        <h1>My Listings</h1>
        <p>All listings you have created.</p>
      </header>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-badge" aria-hidden>🏠</div>
          <h2>No listings yet</h2>
          <p>Start by creating your first stay — it takes just a minute.</p>
          <div className="empty-actions">
            <button className="btn-cta" type="button" onClick={() => navigate("/add-listing")}>Add New Listing</button>
            <button className="btn-secondary" type="button" onClick={() => navigate("/")}>Explore inspiration</button>
          </div>
          <ul className="empty-tips">
            <li>• Great photos attract more bookings</li>
            <li>• Keep descriptions concise</li>
            <li>• Update availability regularly</li>
          </ul>
        </div>
      ) : (
        <div className="my-cards">
          {items.map((listing) => (
            <article key={listing._id} className="my-card" onClick={() => navigate(`/view/${listing._id}`)}>
              <div className="my-card-image">
                {listing?.image?.url ? (
                  <img src={`${backend_url}${listing.image.url}`} alt={listing.title} />
                ) : null}
              </div>
              <div className="my-card-body">
                <h2 className="my-card-title">{listing.title}</h2>
                <p className="my-card-loc">📍 {listing.location}, {listing.country}</p>
                <div className="my-card-price">₹ {new Intl.NumberFormat('en-IN').format(Number(listing.price))} <small>/ Day</small></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyListings;
