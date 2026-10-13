// Horário de funcionamento, em minutos desde a meia-noite. 0 = domingo.
const HORARIOS = {
  0: [],
  1: [[360, 1320]],
  2: [[360, 1320]],
  3: [[360, 1320]],
  4: [[360, 1320]],
  5: [[360, 1260]],
  6: [[540, 720], [840, 1020]],
};

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

function agoraEmVicosa() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
  return { dia, minutos: Number(valor('hour')) * 60 + Number(valor('minute')) };
}

function hora(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function estadoAtual() {
  const { dia, minutos } = agoraEmVicosa();
  const turno = HORARIOS[dia].find(([abre, fecha]) => minutos >= abre && minutos < fecha);
  if (turno) return { dia, aberta: true, texto: `Aberta agora, fecha às ${hora(turno[1])}` };

  const proximoHoje = HORARIOS[dia].find(([abre]) => abre > minutos);
  if (proximoHoje) return { dia, aberta: false, texto: `Fechada agora, abre hoje às ${hora(proximoHoje[0])}` };

  for (let i = 1; i <= 7; i++) {
    const outro = (dia + i) % 7;
    if (HORARIOS[outro].length) {
      const quando = i === 1 ? 'amanhã' : DIAS[outro];
      return { dia, aberta: false, texto: `Fechada agora, abre ${quando} às ${hora(HORARIOS[outro][0][0])}` };
    }
  }
  return { dia, aberta: false, texto: 'Fechada agora' };
}

function atualizarEstado() {
  const estado = estadoAtual();
  document.querySelectorAll('[data-estado]').forEach((el) => {
    el.classList.toggle('aberta', estado.aberta);
    el.classList.toggle('fechada', !estado.aberta);
    el.querySelector('[data-estado-texto]').textContent = estado.texto;
  });
  document.querySelectorAll('[data-dia]').forEach((linha) => {
    const hoje = Number(linha.dataset.dia) === estado.dia;
    linha.classList.toggle('hoje', hoje);
    if (hoje) linha.setAttribute('aria-current', 'date');
    else linha.removeAttribute('aria-current');
  });
}

try {
  atualizarEstado();
  setInterval(atualizarEstado, 60000);
} catch (erro) {
  // Sem Intl com fuso horário, a página mantém o texto fixo dos horários.
}

// No celular, a barra de WhatsApp aparece quando o botão principal sai da tela.
const barra = document.querySelector('[data-barra]');
const principal = document.getElementById('cta-principal');
if (barra && principal && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entrada]) => {
    barra.classList.toggle('visivel', !entrada.isIntersecting);
  }).observe(principal);
}

// O mapa do Google só é carregado quando a pessoa pede, para o navegador
// não se conectar ao Google sem ela saber.
const mapa = document.querySelector('[data-mapa]');
const botaoMapa = document.querySelector('[data-mapa-botao]');
if (mapa && botaoMapa) {
  botaoMapa.addEventListener('click', () => {
    const quadro = document.createElement('iframe');
    quadro.title = 'Mapa: Academia Vila Fit, Rua dos Estudantes, 204, Viçosa';
    quadro.src = 'https://www.google.com/maps?q=-20.7549598,-42.8766271&z=17&hl=pt-BR&output=embed';
    quadro.referrerPolicy = 'no-referrer';
    mapa.replaceChildren(quadro);
    quadro.focus();
  });
}

// Rolos de fotos: as setas só aparecem com JavaScript e avançam uma foto por vez.
document.querySelectorAll('[data-rolo]').forEach((rolo) => {
  const trilho = rolo.querySelector('[data-rolo-trilho]');
  rolo.querySelectorAll('[data-rolo-seta]').forEach((seta) => {
    seta.hidden = false;
    seta.addEventListener('click', () => {
      trilho.scrollBy({ left: Number(seta.dataset.roloSeta) * trilho.clientWidth, behavior: 'smooth' });
    });
  });
});
