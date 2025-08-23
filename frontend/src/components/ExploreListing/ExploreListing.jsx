import "./ExploreListing.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const ExploreListing = () => {
    const { setSelectedCategory } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleSelect = (key) => {
        setSelectedCategory(key);
        // Navigate to the page that shows listings; adjust path if different
        navigate("/");
    };

    return (
        <div>
             {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-inner">
          <h1>Find Your Next Getaway</h1>
          <p>Unique stays, inspiring views, and memorable experiences — all in one place.</p>
          <div className="hero-quick">
            <button onClick={() => handleSelect("")}>All</button>
            <button onClick={() => handleSelect("trending")}>🔥 Trending</button>
            <button onClick={() => handleSelect("nature")}>🌿 Nature</button>
            <button onClick={() => handleSelect("beach")}>🏝️ Beach</button>
            <button onClick={() => handleSelect("mountains")}>🏔️ Mountains</button>
            <button onClick={() => handleSelect("city")}>🏙️ City</button>
          </div>
        </div>
      </section>
        </div>
    );
}

export default ExploreListing;
