import "./updateListing.css";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateListing = () => {

    const { id } = useParams();
    const { backend_url, updateListing, getAllListings } = useContext(StoreContext);
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: ""
    });
    const [image, setImage] = useState(false);

    const onSubmitHandler = async(e) => {
        e.preventDefault();

        setData({
            title: data.title,
            description: data.description,
            price: data.price,
            location: data.location,
            country: data.country
        })

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price);
        formData.append("location", data.location);
        formData.append("country", data.country);
        formData.append("description", data.description);    
        formData.append("image", image);    

        try {
            const response = await axios.post(`${backend_url}/api/listing/update/${id}`, formData);
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
            }
            if(!response.data.success){
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({...data, [name]: value});
    };
    

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await axios.get(`${backend_url}/api/listing/view/${id}`);

                if(!res.data.success){
                    toast.error(res.data.message);
                }
                
                if (!active) return;
                const fetched = res.data?.data || null;
                setItem(fetched);
                if (fetched) {
                    setData({
                        title: fetched.title || "",
                        description: fetched.description || "",
                        price: fetched.price || "",
                        location: fetched.location || "",
                        country: fetched.country || "",
                    });
                }
            } catch (e) {
                if (!active) return;
                setError(e?.response?.data?.message || e.message || "Failed to load listing");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [backend_url, id]);

    // Removed unused handleUpdate; form submit handles update

    if (loading) return <div className="update-container"><p>Loading...</p></div>;
    if (error || !item) return <div className="update-container"><p>{error || "Home not found"}</p></div>;

    return (
        <div className="update-container">
           <form className="add-form" onSubmit={onSubmitHandler}>
        <div className="grid">
         
          <label className="field field-title">
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

          <label className="field field-description">
          <span>Description</span>
          <textarea
            name="description"
            rows="5"
            value={data.description}
            onChange={onChangeHandler}
            placeholder="Describe the stay, nearby highlights, amenities, etc."
          />
        </label>

        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            {image
              ? <img src={URL.createObjectURL(image)} alt="Selected preview" />
              : (item?.image?.url
                  ? <img src={`${backend_url}${item.image.url}`} alt={item.title} />
                  : <div className="placeholder-img" aria-label="No image selected" />)}
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" name="image" hidden />
        </div>

          <label className="field">
            <span>Price per Day</span>
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
            Update Listing
          </button>
          <button className="btn" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
        </div>  
    );
};

export default UpdateListing;
