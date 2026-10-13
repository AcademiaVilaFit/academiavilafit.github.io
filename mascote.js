// Mascote do site. Tudo o que muda de um site para outro fica em CONFIG.
(() => {
  const CONFIG = {
    nome: 'Halterinho',
    academia: 'Vila Fit',
    chave: 'vilafit-mascote',
    // Por quantas horas o mascote lembra as seções que já comentou e fica quieto nelas.
    // Com 0, ele comenta cada seção uma vez a cada visita (toda vez que a página abre).
    lembrarPorHoras: 0,
    // Com true, ele volta a comentar uma seção quando o visitante retorna a ela depois de ver outra.
    repetirAoVoltar: true,
    tempoDoBalao: 5200,
    cores: {
      anilha: 'var(--amarelo)',
      corpo: 'var(--papel)',
      contorno: 'var(--tinta)',
      bochecha: 'oklch(0.78 0.12 15)',
      balaoFundo: 'var(--papel)',
      balaoTexto: 'var(--tinta)',
    },
    boasVindas: 'Oi! Seja bem-vindo(a) à Vila Fit! Fica à vontade pra conhecer a gente 😊',
    secoes: [
      { seletor: '#estrutura', fala: 'Olha que lugar bacana pra treinar!' },
      { seletor: '#horarios', fala: 'Tem horário cedinho e à noite 💪' },
      { seletor: '#avaliacoes', fala: 'Olha o que a galera fala da gente!' },
      { seletor: '#planos', fala: 'Quer saber dos planos? A equipe te passa tudo no WhatsApp!' },
      { seletor: '#duvidas', fala: 'Dúvida rápida? Toca na pergunta que eu respondo!' },
      { seletor: '#local', fala: 'A gente fica no Centro! Toca no mapa pra ver 📍' },
      { seletor: '.rodape', fala: 'Ficou com alguma dúvida? Chama a gente no WhatsApp!' },
    ],
    frases: [
      'Que bom te ver por aqui!',
      'Aqui todo mundo é bem-vindo, do jeitinho que é.',
      'Primeiro dia ou milésimo, o importante é aparecer 😄',
      'Já bebeu água hoje? Eu lembrei por você!',
      'Quer conhecer a academia? É só chamar no WhatsApp.',
      'Bora treinar? Eu te espero aqui! 💪',
    ],
    reacoes: ['rindo', 'muque', 'pulando'],
    seletorWhatsApp: 'a[href*="wa.me"], a[href*="api.whatsapp.com"]',
  };

  const SVG = 'http://www.w3.org/2000/svg';

  function svg(tag, atributos, filhos = []) {
    const el = document.createElementNS(SVG, tag);
    Object.entries(atributos).forEach(([nome, valor]) => el.setAttribute(nome, valor));
    filhos.forEach((filho) => el.appendChild(filho));
    return el;
  }

  function desenhar() {
    const olho = (cx) => svg('g', { class: 'm-olho' }, [
      svg('circle', { class: 'm-olho-fundo', cx, cy: 52, r: 6.5 }),
      svg('g', { class: 'm-pupila' }, [
        svg('circle', { class: 'm-pupila-cor', cx, cy: 52.5, r: 4 }),
        svg('circle', { class: 'm-brilho', cx: cx + 1.4, cy: 50.8, r: 1.4 }),
      ]),
    ]);

    return svg('svg', { viewBox: '0 0 120 100', 'aria-hidden': 'true', focusable: 'false' }, [
      svg('g', { class: 'm-figura' }, [
        svg('rect', { class: 'm-anilha', x: 5, y: 22, width: 30, height: 58, rx: 13 }),
        svg('rect', { class: 'm-anilha', x: 85, y: 22, width: 30, height: 58, rx: 13 }),
        svg('rect', { class: 'm-corpo', x: 28, y: 32, width: 64, height: 40, rx: 20 }),
        svg('path', { class: 'm-faixa', d: 'M33 41 Q60 35 87 41' }),
        svg('path', { class: 'm-faixa-ponta', d: 'M86 41 l9 -5 M86 41 l10 2' }),
        svg('ellipse', { class: 'm-bochecha', cx: 41, cy: 61, rx: 5, ry: 3.2 }),
        svg('ellipse', { class: 'm-bochecha', cx: 79, cy: 61, rx: 5, ry: 3.2 }),
        olho(49),
        olho(71),
        svg('path', { class: 'm-boca', d: 'M54 60 Q60 66 66 60' }),
        svg('g', { class: 'm-braco m-braco-esq' }, [
          svg('path', { class: 'm-braco-linha', d: 'M39 66 Q31 75 30 86' }),
          svg('circle', { class: 'm-mao', cx: 30, cy: 87, r: 4.5 }),
        ]),
        svg('g', { class: 'm-braco m-braco-dir' }, [
          svg('path', { class: 'm-braco-linha', d: 'M81 66 Q89 75 90 86' }),
          svg('circle', { class: 'm-mao', cx: 90, cy: 87, r: 4.5 }),
        ]),
      ]),
    ]);
  }

  function ler() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CONFIG.chave)) || {};
      const validade = CONFIG.lembrarPorHoras * 3600 * 1000;
      const vencido = !validade || !salvo.em || Date.now() - salvo.em > validade;
      return {
        minimizado: Boolean(salvo.minimizado),
        comentadas: vencido || !Array.isArray(salvo.comentadas) ? [] : salvo.comentadas,
        em: vencido ? Date.now() : salvo.em,
      };
    } catch (erro) {
      return { minimizado: false, comentadas: [], em: Date.now() };
    }
  }

  function gravar(estado) {
    try {
      const salvar = CONFIG.lembrarPorHoras ? estado : { minimizado: estado.minimizado };
      localStorage.setItem(CONFIG.chave, JSON.stringify(salvar));
    } catch (erro) {
      // Sem armazenamento (aba anônima, por exemplo), o mascote só não lembra a escolha.
    }
  }

  function iniciar() {
    if (document.querySelector('.mascote')) return;
    const estado = ler();

    const raiz = document.createElement('div');
    raiz.className = 'mascote';
    Object.entries({
      '--m-anilha': CONFIG.cores.anilha,
      '--m-corpo': CONFIG.cores.corpo,
      '--m-contorno': CONFIG.cores.contorno,
      '--m-bochecha': CONFIG.cores.bochecha,
      '--m-balao-fundo': CONFIG.cores.balaoFundo,
      '--m-balao-texto': CONFIG.cores.balaoTexto,
    }).forEach(([nome, valor]) => raiz.style.setProperty(nome, valor));

    const balao = document.createElement('p');
    balao.className = 'mascote-balao';
    balao.setAttribute('role', 'status');
    balao.setAttribute('aria-live', 'polite');

    const corpo = document.createElement('button');
    corpo.type = 'button';
    corpo.className = 'mascote-corpo';
    corpo.appendChild(desenhar());

    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'mascote-fechar';
    fechar.setAttribute('aria-label', `Minimizar o ${CONFIG.nome}`);
    fechar.appendChild(svg('svg', { viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' }, [
      svg('path', { d: 'M4 8h8' }),
    ]));

    raiz.append(balao, corpo, fechar);
    document.body.appendChild(raiz);

    let relogioBalao;
    let relogioReacao;
    let ultimaFrase = -1;
    let ultimaSecao = '';

    function falar(texto) {
      if (estado.minimizado) return;
      clearTimeout(relogioBalao);
      balao.textContent = texto;
      raiz.classList.add('falando');
      relogioBalao = setTimeout(() => raiz.classList.remove('falando'), CONFIG.tempoDoBalao);
    }

    function reagir(reacao, duracao = 1400) {
      clearTimeout(relogioReacao);
      CONFIG.reacoes.concat(['acenando']).forEach((nome) => raiz.classList.remove(nome));
      // Força o navegador a notar a troca, para a mesma reação poder tocar duas vezes seguidas.
      void raiz.offsetWidth;
      raiz.classList.add(reacao);
      relogioReacao = setTimeout(() => raiz.classList.remove(reacao), duracao);
    }

    function aplicarMinimizado() {
      raiz.classList.toggle('minimizado', estado.minimizado);
      corpo.setAttribute('aria-label', estado.minimizado
        ? `Mostrar o ${CONFIG.nome}, mascote da ${CONFIG.academia}`
        : `${CONFIG.nome}, mascote da ${CONFIG.academia}. Clique para ele falar com você`);
      if (estado.minimizado) raiz.classList.remove('falando');
    }

    corpo.addEventListener('click', () => {
      if (estado.minimizado) {
        estado.minimizado = false;
        gravar(estado);
        aplicarMinimizado();
        reagir('acenando', 1800);
        falar('Voltei! 😊');
        return;
      }
      let sorteio = Math.floor(Math.random() * CONFIG.frases.length);
      if (sorteio === ultimaFrase) sorteio = (sorteio + 1) % CONFIG.frases.length;
      ultimaFrase = sorteio;
      reagir(CONFIG.reacoes[Math.floor(Math.random() * CONFIG.reacoes.length)]);
      falar(CONFIG.frases[sorteio]);
    });

    fechar.addEventListener('click', () => {
      estado.minimizado = true;
      gravar(estado);
      aplicarMinimizado();
      corpo.focus();
    });

    // Comentário de cada seção quando ela cruza o meio da tela.
    if ('IntersectionObserver' in window) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const secao = CONFIG.secoes.find((item) => entrada.target.matches(item.seletor));
          if (!secao || secao.seletor === ultimaSecao) return;
          const jaComentada = estado.comentadas.includes(secao.seletor);
          if (jaComentada && !CONFIG.repetirAoVoltar) return;
          ultimaSecao = secao.seletor;
          if (!jaComentada) {
            estado.comentadas.push(secao.seletor);
            gravar(estado);
          }
          falar(secao.fala);
        });
      }, { rootMargin: '-45% 0px -45% 0px' });

      CONFIG.secoes.forEach((secao) => {
        const alvo = document.querySelector(secao.seletor);
        if (alvo && (CONFIG.repetirAoVoltar || !estado.comentadas.includes(secao.seletor))) observador.observe(alvo);
      });
    }

    // Olha para o botão de WhatsApp e se anima quando o visitante chega nele.
    function olharPara(alvo) {
      const origem = corpo.getBoundingClientRect();
      const destino = alvo.getBoundingClientRect();
      const dx = destino.left + destino.width / 2 - (origem.left + origem.width / 2);
      const dy = destino.top + destino.height / 2 - (origem.top + origem.height / 2);
      const distancia = Math.hypot(dx, dy) || 1;
      raiz.style.setProperty('--m-olhar-x', `${((dx / distancia) * 2.4).toFixed(2)}px`);
      raiz.style.setProperty('--m-olhar-y', `${((dy / distancia) * 2).toFixed(2)}px`);
      raiz.classList.add('empolgado');
    }

    function pararDeOlhar() {
      raiz.style.setProperty('--m-olhar-x', '0px');
      raiz.style.setProperty('--m-olhar-y', '0px');
      raiz.classList.remove('empolgado');
    }

    document.querySelectorAll(CONFIG.seletorWhatsApp).forEach((link) => {
      link.addEventListener('pointerenter', () => olharPara(link));
      link.addEventListener('focus', () => olharPara(link));
      link.addEventListener('pointerleave', pararDeOlhar);
      link.addEventListener('blur', pararDeOlhar);
    });

    aplicarMinimizado();
    if (!estado.minimizado) {
      reagir('acenando', 2400);
      falar(CONFIG.boasVindas);
    }
  }

  // Entra depois do conteúdo principal, sem disputar o carregamento da página.
  const agendar = () => setTimeout(iniciar, 500);
  if (document.readyState === 'complete') agendar();
  else window.addEventListener('load', agendar);
})();
