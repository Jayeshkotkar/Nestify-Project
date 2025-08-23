import listingModel from "../models/listingModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve controller directory to find uploads folder reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");



// Get All Listings

const getAllListings = async (req, res) => {
   try {
    const listings = await listingModel.find({});
    if(!listings){
        return res.status(404).json({success:false, message:"Listings not found"});
    }
    res.status(200).json({success:true, data:listings});
   } catch (error) {
    res.status(500).json({success:false, message: error.message });
   }
};



const addListing = async (req, res) => {
   try {
    let image_fileName = `${req.file.filename}`;

    const {title, description, price, location, country} = req.body;

    console.log("Data",req.body);
    console.log("Image",image_fileName);

    if(!title || !description || !price || !location || !country || !image_fileName){
        return res.status(400).json({success:false, message:"All fields are required"});
    }

    const listing = new listingModel({
        title,
        description,
        image:{
            filename:image_fileName,
            url:`/images/${image_fileName}`
        },
        price,
        location,
        country,
        owner: req.userId || req.body.userId,
    });

    await listing.save();

    console.log("Owner Listing",listing);

    if(!listing){
        return res.status(400).json({success:false, message:"Listing not created"});
    }

    res.status(201).json({success:true, data:listing});
   } catch (error) {
    res.status(500).json({success:false, message: error.message });
   }
};

const viewListing = async (req, res) => {
   try {
    const listing = await listingModel.findById(req.params.id);
    if(!listing){
        return res.status(404).json({success:false, message:"Listing not found"});
    }
    console.log("View Listing",listing);
    res.status(200).json({success:true, data:listing});
   } catch (error) {
    res.status(500).json({success:false, message: error.message });
   }
};

const removeListing = async (req, res) => {
    try{
        const { id } = req.params;
        const userId = req.userId || req.body.userId;
        // Enforce ownership
        const listing = await listingModel.findOneAndDelete({ _id: id, owner: userId });
        if(!listing){
            return res.status(404).json({success:false, message:"Listing not found or not authorized"});
        }
        // Attempt to remove associated image from disk (best-effort)
        try {
            const filename = listing?.image?.filename;
            if (filename) {
                const filePath = path.join(uploadsDir, filename);
                await fs.promises.unlink(filePath);
            }
        } catch (e) {
            // If file missing or unlink fails, log and continue
            console.warn("Image cleanup warning:", e.message);
        }
        res.status(200).json({success:true, message:"Listing removed successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message: error.message });
    }
}

const updateListing = async (req, res) => {
   try {
    const {id} = req.params;
    const userId = req.userId || req.body.userId;
    const {title, description, price, location, country} = req.body;

    // Fetch the existing listing to validate ownership and capture old image
    const prevListing = await listingModel.findOne({ _id: id, owner: userId });
    if (!prevListing) {
        return res.status(404).json({ success: false, message: "Listing not found or not authorized" });
    }

    // Build update payload dynamically
    const updateData = { title, description, price, location, country };
    let newImageFileName = null;

    // Only update image if a new file is uploaded
    if (req.file && req.file.filename) {
        newImageFileName = `${req.file.filename}`;
        updateData.image = {
            filename: newImageFileName,
            url: `/images/${newImageFileName}`
        };
    }

    // Update document
    const listing = await listingModel.findOneAndUpdate(
        { _id: id, owner: userId },
        updateData,
        { new: true, runValidators: true }
    );
    if(!listing){
        return res.status(404).json({success:false, message:"Listing not found or not authorized"});
    }

    // If we uploaded a new image, attempt to remove the old file (best-effort)
    if (newImageFileName) {
        try {
            const oldFilename = prevListing?.image?.filename;
            if (oldFilename && oldFilename !== newImageFileName) {
                const oldPath = path.join(uploadsDir, oldFilename);
                await fs.promises.unlink(oldPath);
            }
        } catch (e) {
            // Log and continue; do not fail the request on cleanup issue
            console.warn("Old image cleanup warning:", e.message);
        }
    }

    res.status(200).json({success:true, message:"Listing updated successfully", data:listing});
   } catch (error) {
    res.status(500).json({success:false, message: error.message });
   }
}

// Get Listings owned by the authenticated user
const myListings = async (req, res) => {
   try {
    const userId = req.userId;
    const listings = await listingModel.find({ owner: userId });
    res.status(200).json({ success: true, data: listings });
   } catch (error) {
    res.status(500).json({ success: false, message: error.message });
   }
}

export { getAllListings, addListing, viewListing, removeListing, updateListing, myListings };
