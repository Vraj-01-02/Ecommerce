import addressModel from "../models/addressModel.js";

// ================= GET ALL ADDRESSES =================
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let addressDoc = await addressModel.findOne({ userId });
        
        if (!addressDoc) {
            return res.json({ success: true, addresses: [] });
        }
        
        res.json({ success: true, addresses: addressDoc.addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= SAVE NEW ADDRESS =================
const saveAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { label, firstName, lastName, email, street, city, state, zipcode, country, phone, isDefault } = req.body;
        
        let addressDoc = await addressModel.findOne({ userId });
        
        // If this is default address, unset others
        if (isDefault && addressDoc) {
            addressDoc.addresses.forEach(addr => addr.isDefault = false);
        }
        
        const newAddress = {
            label: label || "Home",
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone,
            isDefault: isDefault || false
        };
        
        if (!addressDoc) {
            // First address - make it default
            newAddress.isDefault = true;
            addressDoc = new addressModel({
                userId,
                addresses: [newAddress]
            });
        } else {
            addressDoc.addresses.push(newAddress);
        }
        
        await addressDoc.save();
        
        res.json({ success: true, message: "Address saved", addresses: addressDoc.addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= UPDATE ADDRESS =================
const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        const updateData = req.body;
        
        const addressDoc = await addressModel.findOne({ userId });
        
        if (!addressDoc) {
            return res.json({ success: false, message: "No addresses found" });
        }
        
        const address = addressDoc.addresses.id(addressId);
        
        if (!address) {
            return res.json({ success: false, message: "Address not found" });
        }
        
        // If setting as default, unset others
        if (updateData.isDefault) {
            addressDoc.addresses.forEach(addr => {
                if (addr._id.toString() !== addressId) {
                    addr.isDefault = false;
                }
            });
        }
        
        Object.assign(address, updateData);
        await addressDoc.save();
        
        res.json({ success: true, message: "Address updated", addresses: addressDoc.addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= DELETE ADDRESS =================
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        
        const addressDoc = await addressModel.findOne({ userId });
        
        if (!addressDoc) {
            return res.json({ success: false, message: "No addresses found" });
        }
        
        addressDoc.addresses.id(addressId).deleteOne();
        await addressDoc.save();
        
        res.json({ success: true, message: "Address deleted", addresses: addressDoc.addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ================= SET DEFAULT ADDRESS =================
const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        
        const addressDoc = await addressModel.findOne({ userId });
        
        if (!addressDoc) {
            return res.json({ success: false, message: "No addresses found" });
        }
        
        // Unset all defaults
        addressDoc.addresses.forEach(addr => addr.isDefault = false);
        
        // Set new default
        const address = addressDoc.addresses.id(addressId);
        if (address) {
            address.isDefault = true;
            await addressDoc.save();
            res.json({ success: true, message: "Default address updated", addresses: addressDoc.addresses });
        } else {
            res.json({ success: false, message: "Address not found" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getUserAddresses, saveAddress, updateAddress, deleteAddress, setDefaultAddress };
