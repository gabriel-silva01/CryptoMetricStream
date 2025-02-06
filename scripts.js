const apiUrl = "https://api.coingecko.com/api/v3/"

// Função para buscar os dados de criptomoedas
async function fetchCryptoData() {
  const cryptos = [
    "bitcoin",
    "ethereum",
    "solana",
    "official-trump",
    "melania-trump",
  ]

  try {
    const response = await axios.get(
      `${apiUrl}simple/price?ids=${cryptos.join(",")}&vs_currencies=usd`
    )
    console.log("Dados de preços obtidos:", response.data) // Log dos dados
    updatePrices(response.data)
    fetchHistoricalData()
  } catch (error) {
    console.error("Erro ao buscar dados das criptomoedas", error)
  }
}

// Função para atualizar os preços no DOM
function updatePrices(data) {
  console.log("Atualizando preços:", data)

  const bitcoinPrice = data.bitcoin
    ? `$${data.bitcoin.usd}`
    : "Erro ao carregar"
  const ethereumPrice = data.ethereum
    ? `$${data.ethereum.usd}`
    : "Erro ao carregar"
  const solanaPrice = data.solana ? `$${data.solana.usd}` : "Erro ao carregar"
  const officialTrumpPrice = data["official-trump"]
    ? `$${data["official-trump"].usd}`
    : "Erro ao carregar"
  const melaniaTrumpPrice = data["melania-trump"]
    ? `$${data["melania-trump"].usd}`
    : "Valor não disponível"

  // Atualizando os valores no DOM
  document.getElementById("bitcoin-price").textContent = bitcoinPrice
  document.getElementById("ethereum-price").textContent = ethereumPrice
  document.getElementById("solana-price").textContent = solanaPrice
  document.getElementById("official-trump-price").textContent =
    officialTrumpPrice
  document.getElementById("melania-trump-price").textContent = melaniaTrumpPrice

  // Escondendo o gráfico de Melania Trump se não houver dados
  if (!data["melania-trump"]) {
    document.getElementById("melania-trump-chart").style.display = "none"
  } else {
    document.getElementById("melania-trump-chart").style.display = "block"
  }
}

// Função para buscar os dados históricos das criptomoedas
async function fetchHistoricalData() {
  const cryptoIds = [
    "bitcoin",
    "ethereum",
    "solana",
    "official-trump",
    "melania-trump",
  ]
  const startDate = "2023-01-01" // Exemplo de data de início
  const endDate = "2023-12-31" // Exemplo de data de fim

  for (let i = 0; i < cryptoIds.length; i++) {
    const id = cryptoIds[i]
    const chartId = `${id}-chart`

    try {
      const response = await axios.get(
        `${apiUrl}coins/${id}/market_chart/range?vs_currency=usd&from=${
          new Date(startDate).getTime() / 1000
        }&to=${new Date(endDate).getTime() / 1000}`
      )
      const data = response.data

      const prices = data.prices.map((price) => price[1])
      const labels = data.prices.map((price) =>
        new Date(price[0]).toLocaleDateString()
      )

      // Verifica se a resposta contém dados válidos antes de criar o gráfico
      if (prices.length > 0) {
        createChart(chartId, labels, prices)
      } else {
        // Caso não tenha dados, esconder o gráfico
        document.getElementById(chartId).style.display = "none"
      }
    } catch (error) {
      console.error(`Erro ao buscar dados históricos para ${id}: `, error)
      // Escondendo o gráfico caso haja erro ao carregar
      document.getElementById(`${id}-chart`).style.display = "none"
    }
  }
}

// Função para criar o gráfico com Chart.js
function createChart(chartId, labels, data) {
  const ctx = document.getElementById(chartId).getContext("2d")

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Preço em USD",
          data: data,
          borderColor: "var(--primary-color)",
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
    },
  })
}

// Carregar as informações ao carregar a página
window.onload = fetchCryptoData

const menuToggle = document.getElementById("menu-toggle")
const navLinks = document.getElementById("nav-links")

menuToggle.addEventListener("click", () => {
  const isMenuOpen = navLinks.classList.toggle("show")
  menuToggle.setAttribute("aria-expanded", isMenuOpen)

  // Impede o scroll do fundo quando o menu está aberto em dispositivos móveis
  if (isMenuOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }
})

// Oculta o menu ao redimensionar a tela (útil para desktop)
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    // Define o breakpoint para desktop
    navLinks.classList.remove("show")
    menuToggle.setAttribute("aria-expanded", "false")
    document.body.style.overflow = "auto" // Restaura o scroll
  }
})

// Adiciona um ouvinte de evento para links internos
navLinks.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      // Verifica se está em dispositivos móveis
      navLinks.classList.remove("show")
      menuToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = "auto" // Restaura o scroll
    }
  })
})

const dropdown = document.querySelector(".dropdown > a")
const dropdownContent = document.querySelector(".dropdown-content")

dropdown.addEventListener("mouseover", () => {
  dropdownContent.style.display = "block"
  dropdown.setAttribute("aria-expanded", "true") // Atualiza o aria-expanded
})

dropdown.addEventListener("mouseout", () => {
  dropdownContent.style.display = "none"
  dropdown.setAttribute("aria-expanded", "false") // Atualiza o aria-expanded
})

dropdownContent.addEventListener("mouseover", () => {
  dropdownContent.style.display = "block"
  dropdown.setAttribute("aria-expanded", "true") // Mantem o aria-expanded
})

dropdownContent.addEventListener("mouseout", () => {
  dropdownContent.style.display = "none"
  dropdown.setAttribute("aria-expanded", "false") // Atualiza o aria-expanded
})

// Adiciona tratamento de foco para acessibilidade via teclado
dropdown.addEventListener("focus", () => {
  dropdownContent.style.display = "block"
  dropdown.setAttribute("aria-expanded", "true") // Atualiza o aria-expanded
})

dropdown.addEventListener("blur", () => {
  dropdownContent.style.display = "none"
  dropdown.setAttribute("aria-expanded", "false") // Atualiza o aria-expanded
})

// Função para definir cookies
function setCookie(name, value, days) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = "expires=" + date.toUTCString()
  document.cookie = `${name}=${value}; ${expires}; path=/`
}

// Função para obter cookies
function getCookie(name) {
  const nameEQ = name + "="
  const cookiesArray = document.cookie.split(";")

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length)
    }
  }
  return null
}

// Função para capturar as preferências do consentimento
function captureCookiePreferences() {
  const consent = getCookie("cookieconsent_status")

  if (consent === "allow") {
    // Ativar funcionalidades dependentes de cookies
    console.log("Cookies permitidos. Ativando funcionalidades...")
  } else {
    // Desativar funcionalidades dependentes de cookies
    console.log("Cookies não permitidos. Desativando funcionalidades...")
  }
}

// Capturar preferências de cookies ao carregar a página
document.addEventListener("DOMContentLoaded", captureCookiePreferences);