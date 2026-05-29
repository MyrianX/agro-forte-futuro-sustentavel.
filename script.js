// 1. SELEÇÃO DOS ELEMENTOS DA ESTUFA (Sliders e Textos)
const tempInput = document.getElementById('temp');
const umidArInput = document.getElementById('umidAr');
const umidSoloInput = document.getElementById('umidSolo');

const valTemp = document.getElementById('valTemp');
const valUmidAr = document.getElementById('valUmidAr');
const valUmidSolo = document.getElementById('valUmidSolo');

const statusBox = document.getElementById('statusBox');
const statusTexto = document.getElementById('statusTexto');

const previousStats = {
    temp: '',
    umidAr: '',
    umidSolo: '',
    totalMorangos: '',
    perdasMorangos: '',
    porcentagemPerda: '',
    statusTexto: '',
    statusClass: ''
};

// 2. SELEÇÃO DOS ELEMENTOS DE PRODUÇÃO (Sementes e Métricas)
const qtdSementesInput = document.getElementById('qtdSementes');
const totalMorangosTxt = document.getElementById('totalMorangos');
const perdasMorangosTxt = document.getElementById('perdasMorangos');
const porcentagemPerdaTxt = document.getElementById('porcentagemPerda');

// 3. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
function atualizarSimulador() {
    // Captura os valores atuais
    const t = parseInt(tempInput.value);
    const ua = parseInt(umidArInput.value);
    const us = parseInt(umidSoloInput.value);
    const sementes = parseInt(qtdSementesInput.value) || 0;

    // Atualiza os textos dos sliders na tela
    valTemp.innerText = t;
    valUmidAr.innerText = ua;
    valUmidSolo.innerText = us;

    // --- CÁLCULO DINÂMICO DE PERFORMANCE (0 a 100%) ---
    let pontuacaoTemp = 0;
    let pontuacaoUmidAr = 0;
    let pontuacaoUmidSolo = 0;

    // Avaliação da Temperatura (Ideal: 18 a 25)
    if (t >= 18 && t <= 25) pontuacaoTemp = 100;
    else if (t >= 15 && t < 18) pontuacaoTemp = 70;
    else if (t > 25 && t <= 30) pontuacaoTemp = 70;
    else if (t >= 10 && t < 15) pontuacaoTemp = 40;
    else if (t > 30 && t <= 35) pontuacaoTemp = 40;
    else pontuacaoTemp = 10; // Extremos (muito frio ou muito quente)

    // Avaliação da Umidade do Ar (Ideal: 60 a 80)
    if (ua >= 60 && ua <= 80) pontuacaoUmidAr = 100;
    else if (ua >= 50 && ua < 60) pontuacaoUmidAr = 70;
    else if (ua > 80 && ua <= 90) pontuacaoUmidAr = 60; // Umidade alta traz fungos
    else pontuacaoUmidAr = 30;

    // Avaliação da Umidade do Solo (Ideal: 70 a 80)
    if (us >= 70 && us <= 80) pontuacaoUmidSolo = 100;
    else if (us >= 55 && us < 70) pontuacaoUmidSolo = 70;
    else if (us > 80 && us <= 90) pontuacaoUmidSolo = 70;
    else pontuacaoUmidSolo = 20; // Solo seco ou encharcado mata a planta

    // A taxa de sucesso global é a média do desempenho das 3 variáveis
    const taxaSucessoGlobal = (pontuacaoTemp + pontuacaoUmidAr + pontuacaoUmidSolo) / 300;

    // --- ATUALIZAÇÃO DO STATUS VISUAL ---
    if (taxaSucessoGlobal >= 0.90) {
        statusBox.className = "status-bom";
        statusTexto.innerText = "Condições Ideais! O equilíbrio perfeito gera alta produtividade e preserva os recursos ambientais. 🍓✨";
    } else if (taxaSucessoGlobal >= 0.60) {
        statusBox.className = "status-alerta";
        statusTexto.innerText = "Atenção: Parâmetros fora do ideal. O desequilíbrio está forçando o sistema e reduzindo a colheita. ⚠️";
    } else {
        statusBox.className = "status-critico";
        statusTexto.innerText = "Alerta Crítico! Desequilíbrio severo detectado. Alto índice de perdas por estresse hídrico ou térmico. 🚨";
    }

    const statusTextoNovo = statusTexto.innerText;
    const statusClasseNova = statusBox.className;

    if (plantacaoStatusResumo) {
        plantacaoStatusResumo.innerText = statusTextoNovo;
    }

    // --- MATEMÁTICA DA SAFRA (Baseado nas sementes reais) ---
    const morangosPorPlanta = 5; // Potencial máximo de frutos por semente/muda
    const totalPotencialFrutos = sementes * morangosPorPlanta;

    // Quantidade colhida perfeitamente (proporcional ao sucesso da estufa)
    const totalMorangosColhidos = Math.round(totalPotencialFrutos * taxaSucessoGlobal);

    // As perdas são tudo aquilo que deixou de ser colhido perfeitamente
    const totalMorangosPerdidos = totalPotencialFrutos - totalMorangosColhidos;
    const porcentagemPerda = totalPotencialFrutos > 0
        ? Math.round((totalMorangosPerdidos / totalPotencialFrutos) * 100)
        : 0;

    const novoTotalMorangos = totalMorangosColhidos.toString();
    const novasPerdas = totalMorangosPerdidos.toString();
    const novaPorcentagem = `${porcentagemPerda}% de perda`;

    const changedElements = [];
    if (valTemp.innerText !== String(t)) changedElements.push(valTemp);
    if (valUmidAr.innerText !== String(ua)) changedElements.push(valUmidAr);
    if (valUmidSolo.innerText !== String(us)) changedElements.push(valUmidSolo);
    if (totalMorangosTxt.innerText !== novoTotalMorangos) changedElements.push(totalMorangosTxt);
    if (perdasMorangosTxt.innerText !== novasPerdas) changedElements.push(perdasMorangosTxt);
    if (porcentagemPerdaTxt.innerText !== novaPorcentagem) changedElements.push(porcentagemPerdaTxt);
    if (previousStats.statusTexto !== statusTextoNovo || previousStats.statusClass !== statusClasseNova) {
        changedElements.push(statusBox, statusTexto);
    }

    valTemp.innerText = t;
    valUmidAr.innerText = ua;
    valUmidSolo.innerText = us;
    totalMorangosTxt.innerText = novoTotalMorangos;
    perdasMorangosTxt.innerText = novasPerdas;
    porcentagemPerdaTxt.innerText = novaPorcentagem;

    previousStats.temp = String(t);
    previousStats.umidAr = String(ua);
    previousStats.umidSolo = String(us);
    previousStats.totalMorangos = novoTotalMorangos;
    previousStats.perdasMorangos = novasPerdas;
    previousStats.porcentagemPerda = novaPorcentagem;
    previousStats.statusTexto = statusTextoNovo;
    previousStats.statusClass = statusClasseNova;

    if (changedElements.length > 0) {
        activarAnimacao(changedElements);
    }
}

function activarAnimacao(elements) {
    elements.forEach(element => {
        if (!element) return;
        element.classList.remove('atualizacao-dados');
        void element.offsetWidth;
        element.classList.add('atualizacao-dados');
    });
}

const plantacaoStatusResumo = document.getElementById('plantacaoStatusResumo');

// Ativa atualização automática quando qualquer controle muda
[tempInput, umidArInput, umidSoloInput, qtdSementesInput].forEach(element => {
    element.addEventListener('input', atualizarSimulador);
});

const darkModeToggle = document.getElementById('darkModeToggle');
const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const fontSizeLevels = [0.95, 1, 1.1, 1.2];
const defaultFontSizeIndex = 1;
let currentFontSizeIndex = defaultFontSizeIndex;

function aplicarTemaEscuro(ativo) {
    document.body.classList.toggle('dark-mode', ativo);
    darkModeToggle.setAttribute('aria-pressed', ativo.toString());
    darkModeToggle.innerText = ativo ? 'Desativar modo escuro' : 'Ativar modo escuro';
}

function atualizarBotoesFonte() {
    if (!fontDecreaseBtn || !fontIncreaseBtn) return;
    fontDecreaseBtn.disabled = currentFontSizeIndex === 0;
    fontIncreaseBtn.disabled = currentFontSizeIndex === fontSizeLevels.length - 1;
    fontDecreaseBtn.setAttribute('aria-disabled', fontDecreaseBtn.disabled.toString());
    fontIncreaseBtn.setAttribute('aria-disabled', fontIncreaseBtn.disabled.toString());
}

function aplicarTamanhoFonte(index) {
    currentFontSizeIndex = Math.min(Math.max(index, 0), fontSizeLevels.length - 1);
    document.body.style.fontSize = `${fontSizeLevels[currentFontSizeIndex]}rem`;
    localStorage.setItem('tamanhoFonte', currentFontSizeIndex.toString());
    atualizarBotoesFonte();
}

function carregarPreferenciaTema() {
    const temaArmazenado = localStorage.getItem('modoEscuro');
    if (temaArmazenado !== null) {
        aplicarTemaEscuro(temaArmazenado === 'true');
    } else {
        aplicarTemaEscuro(prefersDarkScheme.matches);
    }
}

function carregarPreferenciaFonte() {
    const tamanhoFonteArmazenado = parseInt(localStorage.getItem('tamanhoFonte'), 10);
    if (!Number.isNaN(tamanhoFonteArmazenado) && tamanhoFonteArmazenado >= 0 && tamanhoFonteArmazenado < fontSizeLevels.length) {
        aplicarTamanhoFonte(tamanhoFonteArmazenado);
    } else {
        aplicarTamanhoFonte(defaultFontSizeIndex);
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        const estaEscuro = document.body.classList.toggle('dark-mode');
        darkModeToggle.setAttribute('aria-pressed', estaEscuro.toString());
        darkModeToggle.innerText = estaEscuro ? 'Desativar modo escuro' : 'Ativar modo escuro';
        localStorage.setItem('modoEscuro', estaEscuro.toString());
    });
}

if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => {
        aplicarTamanhoFonte(currentFontSizeIndex - 1);
    });
}

if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => {
        aplicarTamanhoFonte(currentFontSizeIndex + 1);
    });
}

// Inicializa o painel ao carregar e aplica preferências salvas
carregarPreferenciaTema();
carregarPreferenciaFonte();

// Inicializa o painel ao carregar
atualizarSimulador();