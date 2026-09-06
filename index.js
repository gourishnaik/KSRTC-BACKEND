require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8000;
//https://ksrtc-backend-rb4w.onrender.com
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Create a .env file (see .env.example) or set it in your host's environment settings.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define a Mongoose schema
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }
}, { strict: false });

const User = mongoose.model("User", UserSchema);

// Master catalog of duty schedules (the reference list used when adding a duty to an employee)
const DutyScheduleSchema = new mongoose.Schema({
    dutyId: { type: String, required: true, unique: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    dutyHours: { type: String, default: "" },
    OThours: { type: String, default: "" },
    NightHalt: { type: String, default: "" },
    kms: { type: String, default: "" },
});

const DutySchedule = mongoose.model("DutySchedule", DutyScheduleSchema);

// Get all master duty schedules
app.get("/api/dutySchedule", async (req, res) => {
    try {
        const schedules = await DutySchedule.find().sort({ dutyId: 1 });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching duty schedules" });
    }
});

// Add a new master duty schedule
app.post("/api/dutySchedule", async (req, res) => {
    const { dutyId, startTime, endTime, dutyHours, OThours, NightHalt, kms } = req.body;

    if (!dutyId || !dutyId.toString().trim()) {
        return res.status(400).json({ message: "Schedule No. (dutyId) is required" });
    }

    try {
        const existing = await DutySchedule.findOne({ dutyId });
        if (existing) return res.status(400).json({ message: "A schedule with this Schedule No. already exists" });

        const schedule = new DutySchedule({ dutyId, startTime, endTime, dutyHours, OThours, NightHalt, kms });
        await schedule.save();

        res.status(201).json({ message: "Duty schedule added successfully", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error adding duty schedule" });
    }
});

// Update an existing master duty schedule
app.put("/api/dutySchedule/:dutyId", async (req, res) => {
    const { startTime, endTime, dutyHours, OThours, NightHalt, kms } = req.body;

    try {
        const schedule = await DutySchedule.findOneAndUpdate(
            { dutyId: req.params.dutyId },
            { startTime, endTime, dutyHours, OThours, NightHalt, kms },
            { new: true }
        );
        if (!schedule) return res.status(404).json({ message: "Duty schedule not found" });

        res.status(200).json({ message: "Duty schedule updated successfully", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error updating duty schedule" });
    }
});

// Delete a master duty schedule
app.delete("/api/dutySchedule/:dutyId", async (req, res) => {
    try {
        const schedule = await DutySchedule.findOneAndDelete({ dutyId: req.params.dutyId });
        if (!schedule) return res.status(404).json({ message: "Duty schedule not found" });

        res.status(200).json({ message: "Duty schedule deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting duty schedule" });
    }
});

// Get all users
app.get("/api/KsrtcOtdata", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Get user by ID
app.get("/api/KsrtcOtdata/:id", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user) res.json(user);
        else res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

app.delete("/api/KsrtcOtdata/deleteDuty", async (req, res) => {
    const { id, key } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user[key]) return res.status(404).json({ message: "Duty not found" });

        user.set(key, undefined);
        await user.save();

        res.status(200).json({ message: "Duty deleted successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error deleting duty" });
    }
});

// Add new duty
app.post("/api/KsrtcOtdata/Newduty", async (req, res) => {
    const { id, duty } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Use the highest existing numeric key + 1 (not a count) so that a deleted
        // duty in the middle doesn't cause the next added duty to overwrite another one.
        const numericKeys = Object.keys(user.toObject())
            .filter(key => key !== "_id" && key !== "id" && key !== "__v")
            .map(Number)
            .filter(n => !isNaN(n));
        const nextKey = (numericKeys.length ? Math.max(...numericKeys) : 0) + 1;
        user.set(nextKey.toString(), duty);

        await user.save();
        res.status(200).json({ message: "Duty added successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error adding duty" });
    }
});

// Create new employee
 app.post("/api/createEmployee", async (req, res) => {
    const { id, ...duties } = req.body;

    try {
        const existingEmployee = await User.findOne({ id });// Check if employee with the same ID already exists
        if (existingEmployee) return res.status(400).json({ message: "Employee ID already exists" });

        const newUser = new User({ id, ...duties });// Create new user with provided ID and duties
        await newUser.save();// Save the new user to the database

        res.status(201).json({ message: "Employee created successfully", newId: id });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee" });
    }
});

// Update user data
app.put("/api/KsrtcOtdata/updateData", async (req, res) => {
    const { id, ...updatedData } = req.body;

    try {
        const user = await User.findOneAndUpdate({ id }, updatedData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Data updated successfully", updatedData: user });
    } catch (error) {
        res.status(500).json({ message: "Error updating data" });
    }
});

// Reset data (retain only IDs)
app.post("/api/KsrtcOtdata/resetData", async (req, res) => {
    try {
        const users = await User.find();

        await Promise.all(users.map(user => {
            const keysToUnset = {};
            Object.keys(user.toObject())
                .filter(key => key !== "_id" && key !== "id" && key !== "__v")
                .forEach(key => { keysToUnset[key] = ""; });

            if (Object.keys(keysToUnset).length === 0) return null;
            return User.updateOne({ _id: user._id }, { $unset: keysToUnset });
        }));

        res.status(200).json({ message: "Data reset successfully, retaining only IDs" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting data" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
