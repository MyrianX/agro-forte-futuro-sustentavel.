// 1. SELEÇÃO DOS ELEMENTOS DA ESTUFA (Sliders e Textos)
const tempInput = document.getElementById('temp');
const umidArInput = document.getElementById('umidAr');
const umidSoloInput = document.getElementById('umidSolo');

const valTemp = document.getElementById('valTemp');
const valUmidAr = document.getElementById('valUmidAr');
const valUmidSolo = document.getElementById('valUmidSolo');

const statusBox = document.getElementById('statusBox');
const statusTexto = document.getElementById('statusTexto');

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

    // --- MATEMÁTICA DA SAFRA (Baseado nas sementes reais) ---
    const morangosPorPlanta = 5; // Potencial máximo de frutos por semente/muda
    const totalPotencialFrutos = sementes * morangosPorPlanta;

    // Quantidade colhida perfeitamente (proporcional ao sucesso da estufa)
    const totalMorangosColhidos = Math.round(totalPotencialFrutos * taxaSucessoGlobal);
    
    // As perdas são tudo aquilo que deixou de ser colhido perfeitamente
    const totalMorangosPerdidos