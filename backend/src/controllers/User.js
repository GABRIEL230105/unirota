const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// formatar usuário (não expor senha)
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

// ================== REGISTER ==================
const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha todos os campos" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      user: formatUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao cadastrar usuário" });
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Informe email e senha" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        user: formatUser(user),
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Email ou senha inválidos" });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao fazer login" });
  }
};

// ================== PROFILE ==================
const profile = async (req, res) => {
  return res.status(200).json({
    user: formatUser(req.user),
  });
};

// ================== UPDATE ==================
const update = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      user: formatUser(updatedUser),
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    return res.status(400).json({ message: "Erro ao atualizar usuário" });
  }
};

// ================== FORGOT PASSWORD ==================
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // segurança: não revela se existe
    if (!user) {
      return res.json({
        message: "Se o email estiver cadastrado, você receberá um link.",
      });
    }

    // gerar token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1h

    await user.save();

    // configurar email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const link = `http://localhost:5173/resetar-senha/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Recuperação de senha - UniRota",
      text: `Clique no link para redefinir sua senha: ${link}`,
    });

    return res.json({
      message: "Se o email estiver cadastrado, você receberá um link.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao processar solicitação.",
    });
  }
};

// ================== RESET PASSWORD ==================
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado",
      });
    }

    user.password = password;

    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return res.json({
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao redefinir senha",
    });
  }
};

// ================== EXPORT ==================
module.exports = {
  create,
  login,
  profile,
  update,
  forgotPassword,
  resetPassword,
};