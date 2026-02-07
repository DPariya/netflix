import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdByIp: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
    },
    replacedByToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

// Method to check if token is expired
refreshTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expiresAt;
};

// Method to check if token is active
refreshTokenSchema.methods.isActive = function () {
  return !this.isRevoked && !this.isExpired();
};

// Auto-delete expired tokens (cleanup)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
