import Business from "../models/Business.js";
import slugify from "slugify";

export const getBusinesses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        const businesses = await (await Business.find()).toSorted({
            isPremium: -1,
        })
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getBusinessBySlug = async (req, res) => {
    try {
        const business = await Business.findOne({ slug: req.params.slug });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        res.json(business);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createBusiness = async (req, res) => {
  try {
    const { name, description, category, location, coordinates, phone } = req.body;

    // validation
    if (!name || !category || !location || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // duplicate check
    const existingBusiness = await Business.findOne({ name, location });
    if (existingBusiness) {
      return res.status(400).json({
        message: "Business with same name and location already exists"
      });
    }

    // slug
    const slug =
      slugify(name, { lower: true, strict: true }) + "-" + Date.now();

    // coordinates validation
    if (
      !coordinates ||
      coordinates.lat === undefined ||
      coordinates.lng === undefined ||
      !Number.isFinite(Number(coordinates.lat)) ||
      !Number.isFinite(Number(coordinates.lng))
    ) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // ✅ correct GeoJSON format
    const geoCoordinates = {
      type: "Point",
      coordinates: [Number(coordinates.lng), Number(coordinates.lat)]
    };

    const business = new Business({
      name,
      slug,
      description,
      category: category.toLowerCase(),
      location,
      geoLocation: geoCoordinates,
      phone,
      owner: req.user.userID,
      isPremium: req.user.subscription?.plan === "premium"
    });

    const savedBusiness = await business.save();

    res.status(201).json(savedBusiness);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!business) {
            return res.status(404).json({ message: "Business not found" });

        }
        res.json(business);
    } catch (err) {
        res.status(400).json({ message: err.message });

    }
};
export const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndDelete(req.params.id);
        if (!business) {
            return res.status(404).json({ message: "business not found" });
        }
        res.json({ message: "Business deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const searchBusiness = async (req, res) => {
    try {
        const searchText = req.query.search;
        if (!searchText) {
            return res.status(400).json({ message: "Search query required" });
        }
        const businesses = await Business.find({
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { category: { $regex: searchText, $options: "i" } },
                { location: { $regex: searchText, $options: "i" } }
            ]
        });
        res.json(businesses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const uploadImage = async (req, res) => {
  try {
    console.log("uploadImage called", { id: req.params.id, files: req.files?.length });

    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedUrls = files
      .map((file) => file.path || file.secure_url || file.location)
      .filter(Boolean);

    if (!uploadedUrls.length) {
      return res.status(500).json({ message: "Could not resolve uploaded image URLs" });
    }

    business.images = [...(business.images || []), ...uploadedUrls];
    await business.save();

    res.json({
      message: "Images uploaded",
      imageUrls: uploadedUrls
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getNearbyBusiness = async(req,res)=>{
    try{
        const {lat, lng, distance = 5000} = req.body;

        const businesses = await Business.find({
            geoLocation:{
                $near:{
                    $geometry:{
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance : parseFloat(distance)
                }
            }
        })
        res.json(businesses);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
