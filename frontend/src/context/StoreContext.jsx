import { createContext, useState, useEffect } from "react";
// import { listings } from "../assets/listings.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext(null);
const StoreContextProvider = ({ children }) => {

    const backend_url = "https://nestify-backend-uowt.onrender.com";

    const [listing, setListing] = useState([]);
    // Initialize from localStorage so UI has values immediately on refresh
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const navigate = useNavigate();

    // On mount: set axios header based on current token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, []);

    // Keep axios Authorization header in sync when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    // Persist auth state to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem("userId", userId);
        } else {
            localStorage.removeItem("userId");
        }
    }, [userId]);

    const getAllListings = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/listing/`);
            console.log("Final Data",response.data.data);
            if(response.data.success){
                setListing(response.data.data);
            }
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || "Failed to load listings";
            toast.error(msg);
        }
    };

    const removeListing = async (id) => {
        try {
            // Body is empty object to avoid axios treating second param as config
            const response = await axios.post(`${backend_url}/api/listing/remove/${id}`, {});
            console.log("Final Data",response.data.data);
            if(response.data.success){
                // Backend doesn't return updated list; refresh explicitly
                await getAllListings();
                toast.success(response.data.message);
            }
            if(!response.data.success){
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || "Failed to remove listing";
            toast.error(msg);
        }
    };

    const updateListing = async (id) => {
        try {
            const response = await axios.post(`${backend_url}/api/listing/update/${id}`, {});
            // console.log("Final Data",response.data.data);
            if(response.data.success){
                // Backend doesn't return updated list; refresh explicitly
                await getAllListings();
                toast.success(response.data.message);
            }
            if(!response.data.success){
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || "Failed to update listing";
            toast.error(msg);
        }
    };

    useEffect(() => {
        getAllListings();
    }, []);

    const contextValue = {
        listing,
        setListing,
        backend_url,
        removeListing,
        updateListing,
        getAllListings,
        token,
        setToken,
        userId,
        setUserId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;
