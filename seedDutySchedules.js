// One-time migration: copies the duty schedule catalog that used to be hardcoded
// in the frontend (view-ot.component.ts `dutyListData`) into MongoDB.
// Safe to re-run - existing dutyIds are left untouched (upsert with $setOnInsert).
require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");

// See index.js - some networks fail Node's own SRV DNS lookups for
// mongodb+srv:// URIs even though the OS resolver works fine.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Create a .env file (see .env.example).");
    process.exit(1);
}

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

const dutyListData = [
    { dutyId: "0", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "A", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "CO", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "CRT", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "RMP", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "BD", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "EXT", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "L", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "CC", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "PART", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "1", startTime: "18:30", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "TR", startTime: "", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "NS1", startTime: "18:30", endTime: "07:45", dutyHours: "06:15", OThours: "", NightHalt: "125", kms: "538" },
    { dutyId: "2", startTime: "", endTime: "07:45", dutyHours: "06:15", OThours: "", NightHalt: "125", kms: "538" },
    { dutyId: "3", startTime: "08:45", endTime: "20:30", dutyHours: "10:30", OThours: "2:30", NightHalt: "15", kms: "503" },
    { dutyId: "4", startTime: "06:00", endTime: "18:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "503" },
    { dutyId: "9", startTime: "07:30", endTime: "19:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "302" },
    { dutyId: "10", startTime: "07:00", endTime: "18:50", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "279" },
    { dutyId: "11", startTime: "06:15", endTime: "16:45", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "386" },
    { dutyId: "13", startTime: "15:15", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "NS13", startTime: "21:00", endTime: "07:05", dutyHours: "08:00", OThours: "1:35", NightHalt: "90", kms: "718" },
    { dutyId: "14", startTime: "", endTime: "12:45", dutyHours: "08:00", OThours: "1:30", NightHalt: "15", kms: "718" },
    { dutyId: "15", startTime: "16:00", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "NS15", startTime: "15:15", endTime: "02:30", dutyHours: "06:30", OThours: "1:00", NightHalt: "125", kms: "556" },
    { dutyId: "16", startTime: "", endTime: "04:15", dutyHours: "06:30", OThours: "", NightHalt: "125", kms: "556" },
    { dutyId: "19", startTime: "06:00", endTime: "17:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "481" },
    { dutyId: "20", startTime: "08:00", endTime: "19:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "481" },
    { dutyId: "21", startTime: "07:10", endTime: "18:40", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "481" },
    { dutyId: "22", startTime: "08:00", endTime: "19:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "481" },
    { dutyId: "24", startTime: "06:00", endTime: "17:45", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "386" },
    { dutyId: "26", startTime: "06:45", endTime: "17:25", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "382" },
    { dutyId: "27", startTime: "06:30", endTime: "16:20", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "382" },
    { dutyId: "29", startTime: "07:00", endTime: "20:15", dutyHours: "11:00", OThours: "3:00", NightHalt: "15", kms: "574" },
    { dutyId: "30", startTime: "06:45", endTime: "20:20", dutyHours: "11:00", OThours: "3:00", NightHalt: "", kms: "574" },
    { dutyId: "34", startTime: "07:30", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "439" },
    { dutyId: "35", startTime: "07:30", endTime: "19:15", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "439" },
    { dutyId: "36", startTime: "06:45", endTime: "17:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "420" },
    { dutyId: "37", startTime: "06:45", endTime: "16:30", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "378" },
    { dutyId: "39", startTime: "05:30", endTime: "18:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "480" },
    { dutyId: "40", startTime: "07:45", endTime: "19:15", dutyHours: "09:45", OThours: "1:45", NightHalt: "65", kms: "410" },
    { dutyId: "41", startTime: "07:15", endTime: "19:15", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "410" },
    { dutyId: "42", startTime: "07:00", endTime: "19:00", dutyHours: "08:45", OThours: "0:45", NightHalt: "15", kms: "240" },
    { dutyId: "62", startTime: "06:00", endTime: "19:50", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "278" },
    { dutyId: "43", startTime: "06:50", endTime: "18:45", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "364" },
    { dutyId: "45", startTime: "07:00", endTime: "16:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "426" },
    { dutyId: "46", startTime: "08:15", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "426" },
    { dutyId: "49", startTime: "06:00", endTime: "17:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "360" },
    { dutyId: "51", startTime: "07:30", endTime: "19:05", dutyHours: "09:20", OThours: "1:20", NightHalt: "", kms: "302" },
    { dutyId: "52", startTime: "08:45", endTime: "20:25", dutyHours: "10:15", OThours: "2:15", NightHalt: "15", kms: "463" },
    { dutyId: "53", startTime: "07:45", endTime: "19:15", dutyHours: "10:15", OThours: "2:15", NightHalt: "", kms: "467" },
    { dutyId: "54", startTime: "05:00", endTime: "16:30", dutyHours: "09:00", OThours: "1:00", NightHalt: "15", kms: "420" },
    { dutyId: "55", startTime: "08:15", endTime: "19:05", dutyHours: "09:00", OThours: "1:00", NightHalt: "", kms: "420" },
    { dutyId: "57", startTime: "06:15", endTime: "18:00", dutyHours: "09:45", OThours: "1:45", NightHalt: "15", kms: "399" },
    { dutyId: "58", startTime: "07:00", endTime: "17:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "404" },
    { dutyId: "61B", startTime: "13:00", endTime: "22:15", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "143" },
    { dutyId: "61A", startTime: "05:45", endTime: "12:05", dutyHours: "06:50", OThours: "", NightHalt: "", kms: "99" },
    { dutyId: "65", startTime: "07:30", endTime: "19:30", dutyHours: "09:20", OThours: "1:20", NightHalt: "", kms: "182" },
    { dutyId: "67B", startTime: "14:00", endTime: "22:10", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "99" },
    { dutyId: "67A", startTime: "05:30", endTime: "12:25", dutyHours: "06:55", OThours: "", NightHalt: "", kms: "136" },
    { dutyId: "71B", startTime: "13:30", endTime: "21:15", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "124" },
    { dutyId: "71A", startTime: "06:30", endTime: "12:50", dutyHours: "07:30", OThours: "", NightHalt: "", kms: "136" },
    { dutyId: "72B", startTime: "13:00", endTime: "22:25", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "135" },
    { dutyId: "72A", startTime: "05:45", endTime: "12:25", dutyHours: "06:00", OThours: "", NightHalt: "", kms: "138" },
    { dutyId: "73", startTime: "07:30", endTime: "21:00", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "232" },
    { dutyId: "74", startTime: "06:00", endTime: "14:55", dutyHours: "08:00", OThours: "", NightHalt: "", kms: "200" },
    { dutyId: "75", startTime: "07:30", endTime: "21:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "463" },
    { dutyId: "76", startTime: "09:30", endTime: "21:10", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "463" },
    { dutyId: "77", startTime: "07:45", endTime: "19:35", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "200" },
    { dutyId: "81", startTime: "08:00", endTime: "19:45", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "376" },
    { dutyId: "82", startTime: "06:00", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "350" },
    { dutyId: "83", startTime: "08:00", endTime: "20:00", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "310" },
    { dutyId: "84", startTime: "06:00", endTime: "16:35", dutyHours: "09:10", OThours: "1:10", NightHalt: "", kms: "277" },
    { dutyId: "86", startTime: "10:30", endTime: "21:10", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "310" },
    { dutyId: "87", startTime: "06:00", endTime: "14:55", dutyHours: "08:00", OThours: "", NightHalt: "", kms: "277" },
    { dutyId: "89", startTime: "07:15", endTime: "18:20", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "291" },
    { dutyId: "90", startTime: "07:30", endTime: "19:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "15", kms: "296" },
    { dutyId: "91", startTime: "06:15", endTime: "17:35", dutyHours: "09:15", OThours: "1:15", NightHalt: "", kms: "279" },
    { dutyId: "92", startTime: "06:15", endTime: "17:25", dutyHours: "09:15", OThours: "1:15", NightHalt: "", kms: "240" },
    { dutyId: "93", startTime: "06:00", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "314" },
    { dutyId: "94", startTime: "07:15", endTime: "18:30", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "425" },
    { dutyId: "95", startTime: "07:45", endTime: "16:45", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "378" },
    { dutyId: "96", startTime: "06:15", endTime: "20:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "15", kms: "531" },
    { dutyId: "97", startTime: "05:45", endTime: "17:45", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "531" },
    { dutyId: "98", startTime: "17:45", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" },
    { dutyId: "NS98", startTime: "19:15", endTime: "05:45", dutyHours: "06:00", OThours: "", NightHalt: "15", kms: "564" },
    { dutyId: "99", startTime: "", endTime: "08:45", dutyHours: "06:00", OThours: "", NightHalt: "15", kms: "564" },
    { dutyId: "100", startTime: "08:00", endTime: "21:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "65", kms: "565" },
    { dutyId: "101", startTime: "07:30", endTime: "19:45", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "565" },
    { dutyId: "106", startTime: "06:30", endTime: "18:15", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "470" },
    { dutyId: "108", startTime: "07:15", endTime: "15:15", dutyHours: "08:00", OThours: "", NightHalt: "125", kms: "252" },
    { dutyId: "110", startTime: "07:30", endTime: "18:20", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "269" },
    { dutyId: "111", startTime: "13:00", endTime: "22:10", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "231" },
    { dutyId: "112", startTime: "06:45", endTime: "16:05", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "231" },
    { dutyId: "120", startTime: "06:30", endTime: "18:10", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "300" },
    { dutyId: "12", startTime: "06:00", endTime: "18:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "480" },
    { dutyId: "28", startTime: "06:30", endTime: "18:05", dutyHours: "09:00", OThours: "1:00", NightHalt: "", kms: "135" },
    { dutyId: "25", startTime: "06:30", endTime: "18:05", dutyHours: "09:00", OThours: "1:00", NightHalt: "", kms: "135" },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // The original array had a couple of accidental duplicate dutyIds
    // ("94" and "95" each appeared twice); keep the first occurrence, matching
    // the old Array.find() lookup behaviour in the frontend.
    const seen = new Set();
    const deduped = dutyListData.filter(d => {
        if (seen.has(d.dutyId)) return false;
        seen.add(d.dutyId);
        return true;
    });

    const ops = deduped.map(duty => ({
        updateOne: {
            filter: { dutyId: duty.dutyId },
            update: { $setOnInsert: duty },
            upsert: true,
        },
    }));

    const result = await DutySchedule.bulkWrite(ops);
    console.log(`Seed complete. Inserted: ${result.upsertedCount}, already present: ${deduped.length - result.upsertedCount}`);

    await mongoose.disconnect();
}

seed().catch(err => {
    console.error("Seed failed:", err);
    process.exit(1);
});
