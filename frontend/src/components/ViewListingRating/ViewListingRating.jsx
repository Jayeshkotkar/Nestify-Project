import React, { useState, useEffect } from 'react';
import "./ViewListingRating.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const ViewListingRating = ({ listing, setShowLogin }) => {

    console.log("Final Review Listing",listing);

    const{backend_url, token} = useContext(StoreContext);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [data, setData] = useState({
    rating: 1,
    comment: ""
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  // decode JWT (base64url) to get current user id
  const getCurrentUserId = () => {
    try {
      if (!token) return null;
      const payload = token.split('.')[1];
      if (!payload) return null;
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return json?.id || json?._id || null;
    } catch (e) {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  const fetchReviews = async () => {
    if (!listing?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${backend_url}/api/review/list/${listing._id}`);
      if (res.data?.success) {
        setReviews(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load reviews");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const res = await axios.delete(`${backend_url}/api/review/remove/${reviewId}` , {
        headers: { token }
      });
      if (res.data?.success) {
        toast.success(res.data?.message || 'Review removed');
        setMenuOpenFor(null);
        fetchReviews();
      } else {
        toast.error(res.data?.message || 'Failed to remove review');
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Please sign in to manage your review');
        if (typeof setShowLogin === 'function') {
          setShowLogin(true);
        }
        return;
      }
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove review');
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?._id]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // keep local states in sync for UI/validation
    if (name === 'rating') setRating(Number(value));
    if (name === 'comment') setComment(value);
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short comment.");
      return;
    }
    // If user is not signed in, show toast and open login popup
    if (!token) {
      toast.error("Please sign in to add a review");
      if (typeof setShowLogin === 'function') {
        setShowLogin(true);
      }
      return;
    }
    try {
        
        const response = await axios.post(`${backend_url}/api/review/add`, {
            rating,
            comment,
            listingId: listing?._id,
        }, {
            headers: { token }
        });
        console.log(response.data);
        if(response.data.success){
            toast.success(response.data.message || "Review added successfully");
            // refresh list
            fetchReviews();
        }
        else{
            toast.error(response.data.message);
        }
      

    //   toast.success("Thanks! Your review was submitted.");
      setComment("");
      setRating(1);
      setData({ rating: 1, comment: "" });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Please sign in to add a review");
        if (typeof setShowLogin === 'function') {
          setShowLogin(true);
        }
        return;
      }
      toast.error(err?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <>
    <div className="review-section">
      <div className="review-header">
        <h4 className="review-title"> Leave a Review</h4>
        <div className="rating-count">Rating: {data.rating}/5</div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="rating" className="form-label">Your rating</label>
          <fieldset className={`starability-slot ${rating === 0 ? 'no-rating' : ''}`}>
            <legend className="sr-only">Choose a rating</legend>


            <input
              type="radio"
              id="rate-1"
              name="rating"
              value="1"
              defaultChecked
              onChange={onChangeHandler}
              aria-label="1 star"
            />
            <label htmlFor="rate-1" title="Terrible">1 star</label>

            <input
              type="radio"
              id="rate-2"
              name="rating"
              value="2"
              onChange={onChangeHandler}
              aria-label="2 stars"
            />
            <label htmlFor="rate-2" title="Not good">2 stars</label>

            <input
              type="radio"
              id="rate-3"
              name="rating"
              value="3"
              onChange={onChangeHandler}
              aria-label="3 stars"
            />
            <label htmlFor="rate-3" title="Average">3 stars</label>

            <input
              type="radio"
              id="rate-4"
              name="rating"
              value="4"
              onChange={onChangeHandler}
              aria-label="4 stars"
            />
            <label htmlFor="rate-4" title="Very good">4 stars</label>

            <input
              type="radio"
              id="rate-5"
              name="rating"
              value="5"
              onChange={onChangeHandler}
              aria-label="5 stars"
            />
            <label htmlFor="rate-5" title="Amazing">5 stars</label>
          </fieldset>
        </div>

        <div className="form-group">
          <label htmlFor="comment" className="form-label">Your review</label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            // maxLength={maxChars}
            onChange={onChangeHandler}
            placeholder="Share details about your stay..."
            required
            className="review-textarea"
          />
          
        </div>

        <button
          type="submit"
          className="submit-btn"
        >
          Submit Review
        </button>
      </form>
    </div>
      <hr/>

      <h3>All Reviews</h3>
      {loading && <p>Loading reviews...</p>}
      {!loading && reviews.length === 0 && (
        <p>No reviews yet. Be the first to review this place.</p>
      )}
      {!loading && reviews.length > 0 && (
        <ul className="reviews-list">
          {reviews.map((rv) => {
            const isOwner = String(rv.author?._id || rv.author) === String(currentUserId || '');
            return (
              <li key={rv._id} className="review-item">
                <div className="review-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{rv.author?.name || rv.author?.email || 'Anonymous'}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span className="review-rating">{`⭐`.repeat(rv.rating)}<span className="muted"> ({rv.rating}/5)</span></span>
                    {isOwner && (
                      <div className="kebab-menu" style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="kebab-button"
                          aria-label="More actions"
                          onClick={() => setMenuOpenFor(menuOpenFor === rv._id ? null : rv._id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18 }}
                        >
                          ⋮
                        </button>
                        {menuOpenFor === rv._id && (
                          <div className="kebab-dropdown" style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', border: '1px solid #ddd', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 }}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => deleteReview(rv._id)}
                              style={{ display: 'block', padding: '8px 12px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#c00' }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="review-comment">{rv.comment}</div>
                <div className="review-meta">
                  <span>{new Date(rv.createdAt).toLocaleString()}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      </>
  );
};

export default ViewListingRating;
