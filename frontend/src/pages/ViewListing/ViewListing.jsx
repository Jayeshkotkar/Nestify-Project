import axios from "axios";
import "./ViewListing.css";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import ViewListingRating from "../../components/ViewListingRating/ViewListingRating";

const ViewListing = ({ setShowLogin }) => {
  const { id } = useParams();
  const { backend_url, removeListing, updateListing, userId, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function removeList(id){
   removeListing(id);
   navigate("/");
  }
  
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await axios.get(`${backend_url}/api/listing/view/${id}`);
        if (!active) return;
        setItem(res.data?.data || null);
      } catch (e) {
        if (!active) return;
        setError(e?.response?.data?.message || e.message || "Failed to load listing");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [backend_url, id]);

  if (loading) {
    return <div className="view-container"><p>Loading...</p></div>;
  }

  if (error || !item) {
    return <div className="view-container"><p>{error || "Listing not found"}</p></div>;
  }

  return (
    <div className="view-container">

      {/* Title */}
      <h1 className="page-title">{item.title}</h1>

      {/* Split Hero Gallery: big left image, two stacked on right */}
      <div className="hero-split">
        <div className="hero-left">
          {item?.image?.url ? (
            <img className="hero-image" src={`${backend_url}${item.image.url}`} alt={item.title} loading="eager" />
          ) : (
            <div className="hero-image placeholder" aria-label="No image available" />
          )}
        </div>
        <div className="hero-right">
          {item?.image?.url ? (
            <>
              <img className="hero-thumb" src={`${backend_url}${item.image.url}`} alt={`${item.title} thumbnail 1`} loading="lazy" />
              <img className="hero-thumb" src={`${backend_url}${item.image.url}`} alt={`${item.title} thumbnail 2`} loading="lazy" />
            </>
          ) : (
            <>
              <div className="hero-thumb placeholder" />
              <div className="hero-thumb placeholder" />
            </>
          )}
        </div>
      </div>

      <div className="view-content two-col">
        {/* LEFT column: hosted details (header, features, about) */}
        <div className="col left">
          {/* Meta row below the image */}
          <div className="meta-row">
            <div className="meta-items">
              <span className="meta-item">👥 4 Guests</span>
              <span className="meta-item">📍 {item.location}, {item.country}</span>
              <span className="meta-item">🛌 2 Bedrooms</span>
              <span className="meta-item">🛏️ 2 Beds</span>
            </div>
            <div className="meta-price price-chip">
              <span className="currency">₹</span>
              <span className="amount">{new Intl.NumberFormat('en-IN').format(Number(item.price))}</span>
              <span className="unit">/ Day</span>
            </div>
          </div>

          <section className="hosted card">
            <div className="hosted-header">
              <div className="hosted-icon" aria-hidden="true">👤</div>
              <div className="hosted-texts">
                <h3 className="hosted-title">Hosted by {item?.ownerName || "host"}</h3>
                <div className="hosted-sub">Superhost · 2 years hosting · 📍 {item.location}, {item.country}</div>
              </div>
            </div>
            <hr className="sep" />
            <ul className="feature-list">
              <li className="feature-item">
                <span className="feature-icon" aria-hidden="true">🧊</span>
                <div className="feature-texts">
                  <div className="feature-title">Designed for staying cool</div>
                  <div className="feature-sub">Beat the heat with the A/C and ceiling fan.</div>
                </div>
              </li>
              <li className="feature-item">
                <span className="feature-icon" aria-hidden="true">🔐</span>
                <div className="feature-texts">
                  <div className="feature-title">Self check-in</div>
                  <div className="feature-sub">Check yourself in with the lockbox.</div>
                </div>
              </li>
              <li className="feature-item">
                <span className="feature-icon" aria-hidden="true">⛺</span>
                <div className="feature-texts">
                  <div className="feature-title">Free cancellation till after 5 Days Booking</div>
                  <div className="feature-sub">Get a full refund if you change your mind.</div>
                </div>
              </li>
            </ul>
            <hr className="sep" />
            <p className="about-text">
              {item.description || "Escape to a tranquil oasis overlooking beautiful views. Perfect for families or friends to relax and create memories."}
            </p>
          </section>

          <div className="actions">
            {Boolean(token && userId && item?.owner) && String(userId) === String(item.owner) ? (
              <>
                <button className="btn primary" type="button" onClick={() => removeList(item._id)}>Remove Listing</button>
                <button className="btn secondary" type="button" onClick={() => navigate(`/update/${item._id}`)}>Update Listing</button>
              </>
            ) : null}
          </div>
        </div>

        {/* RIGHT column: details, amenities, CTA */}
        <aside className="col right">
          <section className="details card">
            <h3>Details</h3>
            <ul>
              <li>Free cancellation</li>
              <li>Check-in after 2:00 PM</li>
              <li>Suitable for business trips</li>
            </ul>
          </section>

          <section className="amenities card">
            <h3>Amenities</h3>
            <ul className="amenities-list">
              <li>WiFi</li>
              <li>Parking</li>
              <li>Kitchen</li>
              <li>Heating</li>
              <li>Washer</li>
            </ul>
          </section>

          <button
            className="btn cta"
            onClick={() =>
              navigate(`/payment`, {
                state: {
                  amount: item.price,
                  listing: {
                    id: item._id,
                    title: item.title,
                    location: item.location,
                    country: item.country,
                    price: item.price,
                    imageUrl: item?.image?.url || "",
                  },
                },
              })
            }
          >
            Book Now
          </button>
        </aside>
      </div>
      <hr />

      <ViewListingRating listing={item} setShowLogin={setShowLogin} />

    </div>
  );
};

export default ViewListing;