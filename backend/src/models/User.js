const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // 🔐 CAMPOS NOVOS (recuperação de senha)
    resetToken: {
      type: String,
    },
    resetTokenExp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// comparar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// criptografar senha antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;