// .netlify/functions/send-email.js

const nodemailer = require("nodemailer")

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método não permitido",
    }
  }

  // Parse the JSON data from the request body
  const { name, email, message } = JSON.parse(event.body)

  // Criação do transportador do Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // ou outro serviço de e-mail que você usar
    auth: {
      user: process.env.EMAIL_USER, // seu e-mail de envio
      pass: process.env.EMAIL_PASS, // sua senha de e-mail ou senha de aplicativo
    },
  })

  // Configuração do e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "seu-email@dominio.com", // para onde será enviado
    subject: `Mensagem de ${name}`,
    text: `De: ${name} <${email}>\nMensagem: ${message}`,
  }

  try {
    // Envia o e-mail
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-mail enviado com sucesso" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao enviar e-mail" }),
    }
  }
}