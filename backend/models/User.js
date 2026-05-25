const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["customer", "contractor", "admin"],
            default: "customer",
        },
        avatar: { type: String },
        phone: { type: String },
        addresses: [
            {
                label: String,
                street: String,
                city: String,
                state: String,
                postalCode: String,
                country: String,
            },
        ],
        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
