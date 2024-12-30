// Selecionar elementos do DOM
const fearGreedValue = document.getElementById("fear-greed-value")
const fearGreedChart = document
  .getElementById("fear-greed-chart")
  .getContext("2d")
const mayerValue = document.getElementById("mayer-value")
const dominanceValue = document.getElementById("dominance-value")

// Função para buscar dados das APIs
async function fetchData() {
  try {
    // Fetch Fear and Greed Index
    const fearGreedResponse = await fetch("https://api.alternative.me/fng/")
    if (!fearGreedResponse.ok) {
      throw new Error("Falha ao buscar dados do Fear and Greed Index.")
    }

    const fearGreedData = await fearGreedResponse.json()
    const fearGreedScore = fearGreedData.data[0].value
    const fearGreedClassification = fearGreedData.data[0].value_classification

    // Atualizar valor no HTML
    fearGreedValue.textContent = `${fearGreedScore} - ${fearGreedClassification}`

    // Gráfico do Fear and Greed Index
    new Chart(fearGreedChart, {
      type: "doughnut",
      data: {
        labels: ["Greed", "Fear"],
        datasets: [
          {
            data: [fearGreedScore, 100 - fearGreedScore],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    })

    // Fetch Mayer Multiple (API corrigida)
    const mayerResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=200&interval=daily"
    )
    const mayerData = await mayerResponse.json()

    // Verificar a estrutura dos dados para debug
    console.log("Dados do Mayer Multiple:", mayerData)

    // Extrair os preços de fechamento dos últimos 200 dias
    const closePrices = mayerData.prices.map((price) => price[1])

    // Calcular a média dos preços de fechamento
    const sum = closePrices.reduce((acc, curr) => acc + curr, 0)
    const averagePrice = sum / closePrices.length

    // Obter o preço atual do Bitcoin
    const currentPrice = mayerData.prices[closePrices.length - 1][1]

    // Calcular Mayer Multiple
    const mayerMultiple = currentPrice / averagePrice

    // Atualizar o valor do Mayer Multiple na página
    mayerValue.textContent = `Múltiplo Atual: ${mayerMultiple.toFixed(2)}`

    // Fetch Dominância do Bitcoin
    const dominanceResponse = await fetch(
      "https://api.coingecko.com/api/v3/global"
    )
    const dominanceData = await dominanceResponse.json()
    const btcDominance = dominanceData.data.market_cap_percentage.btc
    dominanceValue.textContent = `Dominância: ${btcDominance.toFixed(2)}%`
  } catch (error) {
    console.error("Erro ao buscar dados:", error.message)
    fearGreedValue.textContent = "Erro ao carregar dados."
    mayerValue.textContent = "Erro ao carregar dados."
    dominanceValue.textContent = "Erro ao carregar dados."
  }
}

// Executar fetchData ao carregar a página
document.addEventListener("DOMContentLoaded", fetchData)

// Selecionar o botão
const backToTopButton = document.getElementById("back-to-top")

// Mostrar o botão quando o usuário rolar para baixo
window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopButton.style.display = "block" // Exibir o botão
  } else {
    backToTopButton.style.display = "none" // Esconder o botão
  }
}

// Função para voltar ao topo
backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" }) // Rolagem suave para o topo
})

// Selecionar os elementos
const menuToggle = document.getElementById("menu-toggle")
const navLinks = document.getElementById("nav-links")

// Alternar a visibilidade do menu e atualizar o atributo 'aria-expanded'
menuToggle.addEventListener("click", () => {
  const isMenuOpen = navLinks.classList.toggle("show")

  // Atualiza o atributo 'aria-expanded' para melhorar a acessibilidade
  menuToggle.setAttribute("aria-expanded", isMenuOpen)
})

// Adicionar eventos de mouse para esconder o menu quando o mouse sair da área
navLinks.addEventListener("mouseleave", () => {
  navLinks.classList.remove("show")
  menuToggle.setAttribute("aria-expanded", "false")
})

// Submit HTML forms with AJAX
const handleSubmit = (event) => {
  event.preventDefault()

  const myForm = event.target
  const formData = new FormData(myForm)
  const errors = []
  const fields = ["name", "email", "message"] // Campos obrigatórios

  // Limpar erros anteriores
  document.getElementById("form-errors").style.display = "none"
  document.getElementById("form-errors").querySelector("ul").innerHTML = ""

  // Validação visual e coleta de erros
  fields.forEach((field) => {
    const input = document.getElementById(field)
    if (!input.value.trim()) {
      errors.push(`${field} is required`)
      input.style.borderColor = "red" // Adiciona a borda vermelha para campos obrigatórios não preenchidos
    } else {
      input.style.borderColor = "" // Limpa a borda vermelha se o campo estiver preenchido
    }
  })

  if (errors.length > 0) {
    // Exibe as mensagens de erro
    const errorList = document.getElementById("form-errors").querySelector("ul")
    errors.forEach((error) => {
      const li = document.createElement("li")
      li.textContent = error
      errorList.appendChild(li)
    })
    document.getElementById("form-errors").style.display = "block"
    return // Não envia o formulário se houver erros
  }

  // Se não houver erros, faz o envio do formulário via fetch
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      // Exibe o pop-up de sucesso
      document.getElementById("success-message").style.display = "block"
      // Opcional: esconde o formulário após envio
      myForm.style.display = "none"
    })
    .catch((error) => {
      alert("An error occurred: " + error)
    })
}

document.querySelector("form").addEventListener("submit", handleSubmit)