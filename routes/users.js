const express = require("express");
const router = express.Router();
const _ = require("lodash");
const url = require("url");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const { sendEmail } = require("../utils/sendEmail");
const { authenticate } = require("../middleware/authenticate");

// POST /users
router.post("/", async (req, res) => {
  try {
    const body = _.pick(req.body, [
      "email",
      "password",
      "name",
      "avatar",
      "provider"
    ]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).json({
      token,
      _id: user._id,
      role: user.role,
      email: user.email,
      provider: user.provider
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET /users/me
router.get("/me", authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.status(200).json({
      token,
      _id: user._id,
      role: user.role,
      email: user.email
    });
  } catch (e) {
    res.status(400).send();
  }
});

// POST /users/provider
// @ Check if provider already exist
router.post("/provider", async (req, res) => {
  try {
    const criteria = _.pick(req.body, ["email", "provider"]);
    const user = await User.findOne(criteria);
    if (user) {
      const token = await user.generateAuthToken();
      res.status(200).json({
        token,
        _id: user._id,
        role: user.role,
        email: user.email,
        provider: user.provider
      });
    } else {
      res.status(200).send();
    }
  } catch (e) {
    res.status(400).send();
  }
});

// PATH /user
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    // password solo aplica para LOCAL users.
    const updateObj = _.pick(req.body, ["email", "password", "name", "avatar"]);
    const result = await User.findByIdAndUpdate(id, updateObj, {
      new: true
    });
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send();
  }
});

// DELETE /users/logout
router.delete("/logout", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

// POST /users/email-verification
// @desc: Para verificar si el email q entro el user
// es valido envio un email a la direccion dada. En el
// cuerpo envio un token q sera agregado al array de
// token del user y este tendra q seguir el link antes
// de q este expire. De lo contrario uno nuevo sera enviado.
// A esta ruta voy a venir por dos razones:
// 1. Cuando se cree un nuevo user
// 2. Cuando el user olvide el password
router.post("/email-verification", async (req, res) => {
  try {
    let user = "";
    let token = "";
    let text = "";
    // El user olvido el password
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
      token = await user.generateAuthToken();
      text = "reset your password";
    }
    // Nuevo user buscando validar su email
    else {
      token = req.body.token;
      user = await User.findByToken(token);
      text = "activate your account";
    }
    if (!user) return res.status(401).send();
    // Doing the email
    const mailOptions = {
      from: "Naxis INC. <pcastillo@naxis.us>",
      to: user.email,
      subject: "Email Verification",
      text:
        "Hello.\nPlease, to " +
        text +
        " follow the next link:" +
        "\n\nhttp://localhost:4200/validation/" +
        token +
        ".\n\n" +
        "Please note that this confirmation link expires soon and may require your immediate attention if you wish to access your online account in the future.\n\n" +
        "PLEASE DO NOT REPLY TO THIS MESSAGE."
    };
    if (await createEmail(mailOptions)) res.status(200).send();
    res.status(400).send();
  } catch (err) {
    res.status(400).send();
  }
});
// GET /users/token-validation
// @desc: Aqui voy a comprobar si el token enviado
// desde el link es valido.
// A esta ruta voy a venir por dos razones:
// 1. Cuando se cree un nuevo user
// 2. Cuando el user olvide el password
router.post("/token-validation", async (req, res) => {
  try {
    const token = req.body.token;
    const user = await User.findByToken(token);
    if (!user) res.status(401).send();
    // El user busca recuperar su password
    if (user.active) res.status(200).json({ canRecover: true, token });

    // El user quiere hacer login con el email ya validado
    await User.findByIdAndUpdate({ _id: user._id }, { active: true }); // Activar user
    res.status(200).json({
      token,
      _id: user._id,
      role: user.role,
      email: user.email
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

// // POST /users/verify-email
// router.post("/verify-email", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(401).send();
//     }
//     const token = await user.generateAuthToken();

//     // Setting email
//     const mailOptions = {
//       from: "Air Technik INC. <airtnik@gmail.com>",
//       to: user.email,
//       subject: "Password reset instructions",
//       text:
//         "Hello.\nPlease, to reset your password follow the next link:" +
//         "\n\nhttps://fast-shore-26090.herokuapp.com/users/recovery-password/" +
//         token +
//         ".\n\n" +
//         "Please note that this confirmation link expires soon and may require your immediate attention if you wish to access your online account in the future.\n\n" +
//         "PLEASE DO NOT REPLY TO THIS MESSAGE."
//     };
//     if (await createEmail(mailOptions)) {
//       res.status(200).send();
//     } else {
//       res.status(400).send();
//     }
//   } catch (err) {
//     res.status(400).send();
//   }
// });

async function createEmail(mailOptions) {
  try {
    let sent = await sendEmail(mailOptions);
    return sent ? 1 : 0;
  } catch (e) {
    return 0;
  }
}

// // GET /users/recovery-password
// router.get("/recovery-password/:token", async (req, res) => {
//   try {
//     const token = req.params.token;
//     const user = await User.findByToken(token);
//     await user.removeToken(token);
//     res.redirect(
//       decodeURIComponent(
//         url.format({
//           protocol: "http:",
//           host: "localhost:4200",
//           pathname: "/",
//           query: { user }
//         })
//       )
//     );
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// PATH /change-password
router.patch("/change-password", authenticate, async (req, res) => {
  try {
    req.user.password = req.body.password;
    await req.user.save();
    await req.user.removeToken(req.body.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/send-email", async (req, res) => {
  try {
    let mailOptions = {
      from: "Air Technik INC. <airtnik@gmail.com>",
      to: "airtnik@gmail.com",
      subject: "Email sent from airtechnik.com",
      text:
        "From: " +
        req.body.email +
        "\nMy name is: " +
        req.body.name +
        "\n\n" +
        req.body.message
    };
    if (await createEmail(mailOptions)) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = router;
