import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxLength: [50, "Name cannot be more than 50 characters."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email.",
      ],
    },
    password: {
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    watchList: {
      movieId: {
        type: Number,
        required: true,
      },
      title: String,
      poster: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
    preference: {
      language: {
        type: String,
        default: "en",
      },
      autoplayNext: {
        type: Boolean,
        default: true,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

//indexes
userSchema.index({ email: 1 });
userSchema.index({ "watchList.movieId": 1 });

//password hashing before saving
userSchema.pre("save", async function (next) {
  //hash only if password modified
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//to compare password
userSchema.methods.comparePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

//get public profile, remove sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
