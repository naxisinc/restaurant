const express = require("express");
const router = express.Router();
const _ = require("lodash");
const url = require("url");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const { sendEmail } = require("../utils/sendEmail");
const { authenticate } = require("../middleware/authenticate");
const { gfs, upload } = require("../middleware/filestorage");

// POST /users
router.post("/", upload().single("file"), async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password", "name"]);
    body.avatar = req.file.filename;
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
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
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// POST /users/provider
// @ Check if provider already exist, if no lo creo
router.post("/login-provider", async (req, res) => {
  try {
    const body = _.pick(req.body, [
      "email",
      "password",
      "name",
      "provider",
      "avatar"
    ]);

    const user = await User.findOne({
      email: body.email,
      provider: body.provider
    });
    if (user) {
      // actualizo lo q pudo haber cambiado
      await User.findByIdAndUpdate({ _id: user._id }, body, {
        new: true
      });
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } else {
      // Creo el nuevo user
      body.active = true;
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
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
    const updateObj = _.pick(req.body, ["password", "name", "avatar"]);
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

// @desc: Aqui lo q hago es Verificar que el Email isNotTaken (vent)
// si NotTaken return true, si isTaken false
router.post("/vent", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) res.status(200).send(false);
    res.status(200).send(true);
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
      if (!user) res.status(401).send();
      token = await user.generateAuthToken();
      text = "reset your password";
    }
    // Nuevo user buscando validar su email
    else {
      token = req.body.token;
      user = await User.findByToken(token);
      if (!user) return res.status(401).send();
      text = "activate your account";
    }
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

// POST /users/token-validation
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
    if (user.active)
      res.status(200).send({ canRecover: true, _id: user._id, token });

    // El user quiere hacer login con el email ya validado
    await User.findByIdAndUpdate({ _id: user._id }, { active: true }); // Activar user
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});

async function createEmail(mailOptions) {
  try {
    let sent = await sendEmail(mailOptions);
    return sent ? 1 : 0;
  } catch (e) {
    return 0;
  }
}

module.exports = router;
