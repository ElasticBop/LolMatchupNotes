const mongoose = require("mongoose");
const matchupSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    champion1: {
        type: String,
        required: [true, "Please add champion 1"]
    },
    champion2: {
        type: String,
        required: [true, "Please add champion 2"]
    },
    text: {
        type: String,
        required: [true, "Please add a text value"]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Matchup", matchupSchema);