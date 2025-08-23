import "./AddNewListing.css";
import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewListing = () => {

  const navigate = useNavigate();
  const { backend_url, getAllListings, token } = useContext(StoreContext);

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: ""
  });

  const fileInputRef = useRef(null);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({...data, [name]: value});
  };

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("location", data.location);
    formData.append("country", data.country);
    formData.append("description", data.description);    
    formData.append("image", image);    

    try {
          const response = await axios.post(`${backend_url}/api/listing/add`, formData, {headers:{token:token}});

          if(response.data.success){
            setData({
              title: "",
              description: "",
              price: "",
              location: "",
              country: ""
            });
            setImage(false);
            // Ensure home page reflects latest data without manual refresh
            try { await getAllListings(); } catch {}
            navigate("/");
            toast.success(response.data.message);

            if(fileInputRef.current){
              fileInputRef.current.value = "";
            }
          }

          if(!response.data.success){
            toast.error(response.data.message);
          }

    } catch (error) {
      toast.error(error.response.data.message);
    }
    
  };

  return (
    <section className="add-container">
      <header className="add-header">
        <h1>Add New Home</h1>
        <p>Fill in the details below to create a new stay.</p>
      </header>

      <form className="add-form" onSubmit={onSubmitHandler}>
        <div className="grid">
         
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={onChangeHandler}
              placeholder="e.g., Cozy Beachfront Cottage"
              required
            />
          </label>

          <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            rows="5"
            value={data.description}
            onChange={onChangeHandler}
            placeholder="Describe the stay, nearby highlights, amenities, etc."
          />
        </label>

        <div className="add-img-upload">
          <div className="upload-zone">
            <div className="upload-preview">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="preview" />
              ) : (
                <span role="img" aria-label="camera">📷</span>
              )}
            </div>
            <div className="upload-actions">
              <button className="upload-btn" type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                Choose image
              </button>
              {image && <span className="upload-hint">{image.name}</span>}
              <span className="upload-hint">PNG, JPG up to ~5MB</span>
            </div>
            <input
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              hidden
              required
            />
          </div>
        </div>

          <label className="field">
            <span>Price per night</span>
            <div className="input-prefix">
              <span>₹</span>
              <input
                type="number"
                name="price"
                min="0"
                step="1"
                value={data.price}
                onChange={onChangeHandler}
                placeholder="e.g., 1500"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Location (City)</span>
            <input
              type="text"
              name="location"
              value={data.location}
              onChange={onChangeHandler}
              placeholder="e.g., Malibu"
              required
            />
          </label>

          <label className="field">
            <span>Country</span>
            <input
              type="text"
              name="country"
              value={data.country}
              onChange={onChangeHandler}
              placeholder="e.g., United States"
              required
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" type="submit">
            Add Listing
          </button>
          <button className="btn" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddNewListing;