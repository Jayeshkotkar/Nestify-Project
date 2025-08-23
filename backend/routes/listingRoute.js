import express from "express";
import { getAllListings, addListing, viewListing, removeListing, updateListing, myListings } from "../controllers/listingController.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const listingRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

listingRouter.post("/add",auth, upload.single("image"), addListing);

listingRouter.get("/", getAllListings);

listingRouter.get("/view/:id", viewListing);

listingRouter.post("/remove/:id", auth, removeListing);

listingRouter.post("/update/:id", auth, upload.single("image"), updateListing);

// Get listings created by the signed-in user
listingRouter.get("/mine", auth, myListings);

export default listingRouter;