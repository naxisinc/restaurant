const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const config = require("../config/database");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email."
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    role: {
      type: String,
      default: "user"
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    avatar: {
      type: String,
      default: "anonymousavatar.jpg"
    },
    provider: {
      type: String,
      default: "LOCAL"
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  // toHexString se usa para convertir el objectID de mongo en string
  let token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        // exp: Math.floor(Date.now() / 1000) + 60 * 60 //1hr
        exp: Math.floor(Date.now() / 1000) + 60 * 10080 // 1 week
      },
      config.secret
    )
    .toString();

  //Update the user tokens array
  user.tokens = user.tokens.concat([{ token }]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  let user = this;

  return user.updateOne({
    $pull: {
      tokens: { token }
    }
  });
};

UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, config.secret);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  let User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre("save", function(next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.pre("findOneAndUpdate", function(next) {
  const pass = this._update.password;
  // console.log(this._update);
  if (pass) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, (err, hash) => {
        this._update.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = (module.exports = mongoose.model("User", UserSchema));
