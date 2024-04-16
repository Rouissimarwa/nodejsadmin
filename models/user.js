const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const re = /^\S+@\S+\.\S+$/;
        return re.test(String(value).toLowerCase());
      },
      message: props => `${props.value} n'est pas un email valide!`
    }
  },
  numéroTelephone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  cart: {
    type: Array,
    default: [],
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String,
  },
});

// Utilisation de bcrypt pour hasher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // Expiration dans 30 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema); 

module.exports = User;
