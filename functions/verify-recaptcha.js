const fetch = require("node-fetch")

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    }
  }

  const { recaptchaResponse, formData } = JSON.parse(event.body)

  // Sua chave secreta do reCAPTCHA (obtida no Google)
  const secretKey = "6Ld0AqoqAAAAAJ8B56BJXK71-yrb96w52F1vfo_I"

  // URL da API do Google para validar o reCAPTCHA
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`

  // Verifica a resposta do reCAPTCHA
  const recaptchaVerifyResponse = await fetch(verificationUrl, {
    method: "POST",
  })
  const recaptchaVerifyResult = await recaptchaVerifyResponse.json()

  // Se o reCAPTCHA for válido, retorna os dados do formulário, senão retorna erro
  if (recaptchaVerifyResult.success) {
    console.log("Form data:", formData)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Form successfully submitted!" }),
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "reCAPTCHA validation failed" }),
    }
  }
}
