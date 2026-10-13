# Guaraná Antarctica — redesign local

Preview: http://127.0.0.1:5187/

Quatro momentos: hero e troca Original → Zero; produtos com linguagem oficial; É coisa nossa e campanhas; seleção final e footer. A seção anterior de Maués foi retirada do HTML, CSS, animações, navegação e assets servidos.

## Checkpoint e stack

Checkpoint anterior às alterações: `041cca7`, branch `main`. A pasta não tinha Git; foi iniciado um repositório apenas neste projeto. Os assets e o código anteriores permanecem recuperáveis nesse commit.

HTML, CSS e JavaScript estáticos. GSAP 3.14.2 e ScrollTrigger locais foram preservados. Sem framework, backend, CMS, Three.js, Lenis, vídeo ou áudio. Nenhum site foi publicado nem domínio conectado.

Para iniciar novamente a partir desta pasta: `python3 -m http.server 5187 --bind 127.0.0.1`.

## Autoridade de marca

A pesquisa usou o [site oficial](https://www.guaranaantarctica.com.br/pt-br), suas folhas de estilo e os screenshots anexados. O logo horizontal, os dois packshots de 350 ml, os backgrounds e as fotografias de campanha vêm do site oficial. As latas mantêm pixels, recorte e proporções reais; a embalagem não foi recriada com IA.

A fonte real da headline foi confirmada por computed styles: **Guarana Antarctica Bold**, 700, tracking normal e line-height de 80 px no banner consultado. Os títulos de campanhas usam **Kranafat**. O website também carrega **Guarana Antarctica Regular** e **Roboto**, usado na navegação. Nesta versão esses arquivos substituem Anton e Barlow.

Fontes públicas servidas pelo site oficial e utilizadas localmente:

- [Guarana Antarctica Bold](https://www.guaranaantarctica.com.br/sites/g/files/wnfebl12901/files/cohesion/Guarana-Antarctica-Bold.ttf)
- [Guarana Antarctica Regular](https://www.guaranaantarctica.com.br/sites/g/files/wnfebl12901/files/cohesion/Guarana-Antarctica-Regular.ttf)
- [Kranafat](https://www.guaranaantarctica.com.br/sites/g/files/wnfebl12901/files/cohesion/Krana_Fat_A.ttf)
- [Roboto](https://www.guaranaantarctica.com.br/sites/g/files/wnfebl12901/files/cohesion/Roboto-Regular.ttf)

A identidade usa verde, branco e amarelo, com o vermelho dos logos e embalagens. O amarelo `#FFCC00` foi confirmado nos títulos oficiais. Os backgrounds oficiais preservam seus tons e texturas. [Style tile atualizado](style-tile.html).

As campanhas e suas frases são as exibidas no site oficial: Natal brasileiro; Vai ficar em casa?; Futebol feminino é Coisa Nossa. Os links apontam aos vídeos associados a esses materiais. A [página oficial de Zero](https://www.guaranaantarctica.com.br/pt-br/produto/guarana-antarctica-zero) foi aberta e confirmou o formato de 350 ml e o destino usado nos CTAs.

## Auditoria da MANA

Referência: [MANA Yerba Mate](https://en.manayerbamate.com/). Foram observados a troca de sabor, a rotação, o deslocamento da lata durante scroll e a passagem para o restante da página, incluindo o footer. Os screenshots fornecidos também mostram o pull tab aberto.

A inspeção do DOM e do [bundle público](https://manayerbamate.com/cdn/shop/t/18/assets/global.js?v=70175767351616846921743419969) identificou:

- canvas com WebGLRenderer/Three.js e câmera de perspectiva;
- GLTFLoader e um modelo `MANA_canettes__v5_WEBGL.gltf`;
- mapas de embalagem por sabor e iluminação HDR;
- AnimationMixer e animações do modelo;
- GSAP, ScrollTrigger, Lenis e requestAnimationFrame;
- troca coordenada de textura, rotação e deslocamento lateral;
- limite de DPR e adaptação do tamanho de renderização.

Nenhum código, modelo, textura ou ilustração da MANA foi integrado ao projeto.

## ProductExperience

A implementação própria usa **CSS 2,5D** e dois packshots oficiais, controlados por uma única classe `ProductExperience`. Mantém produto atual/anterior, estado da troca, progresso, posição, rotação, escala e profundidade.

O master GSAP coordena imagem, tipografia, background e entrada das cenas. Original sai lateralmente e recua; Zero entra pela lateral oposta e assume a mesma posição. A troca dos produtos não usa opacity. No final, clique, teclas laterais e drag horizontal usam o mesmo controlador, com interrupção segura em trocas rápidas.

O desktop usa um palco fixado com 5,4 alturas de tela de deslocamento ativo. O mobile tem quatro cenas em fluxo natural, sem pin; o mesmo sistema acompanha a rolagem. Movimento reduzido apresenta quatro cenas estáticas e mantém a seleção por botão/teclado.

Abertura da lata: **não implementada**. Os assets disponíveis são fotografias frontais; um giro de 360° ou pull tab articulado exigiria modelo ou renders fiéis da embalagem. A perspectiva usada aqui é limitada e não simula o verso da lata.

## Assets

| Asset | Origem / resolução |
| --- | --- |
| `assets/can.webp` | Site oficial; 371 × 681 px úteis, alpha real |
| `assets/zero.webp` | Site oficial; 366 × 681 px úteis, alpha real |
| `assets/logo-horizontal.webp` | Header oficial; 289 × 71 px, alpha real |
| `assets/logo.webp` | Logo oficial; utilizado no footer |
| `assets/product-bg.webp` | Background oficial; 1920 × 986 px |
| `assets/brand-graphics.webp` | Grafismos oficiais; 1366 × 547 px |
| `assets/culture-natal.webp` | Original oficial de 1920 × 1080, otimizado para 1600 × 900 |
| `assets/culture-pipoca.webp` | Original oficial; 770 × 440 px |
| `assets/culture-futebol.webp` | Original oficial; 770 × 440 px |

Os oito assets da primeira entrega e os nove screenshots desta etapa foram inspecionados. Os screenshots servem como referência, não como página rasterizada. A fotografia fullscreen de fruto, os ramos gerados, suas fontes anteriores e o arquivo de prompts foram removidos do projeto servido. Nenhuma imagem nova foi gerada nesta etapa.

Próximo refinamento possível: packshots oficiais Original e Zero em maior resolução, idealmente pelo menos 2000 px úteis de altura. Os atuais funcionam na composição e nas transições, mas têm limite de detalhe em telas Retina. Um modelo correto seria necessário apenas para rotação integral ou abertura.

## Verificação

- Quatro cenas, na ordem correta; nenhuma referência operacional à antiga seção.
- Nenhum asset sem referência; nenhum CSS, GSAP ou ScrollTrigger da seção removida.
- Sintaxe de JavaScript, caminhos locais e anchors: PASS.
- Todos os arquivos servidos: HTTP 200; sem erros ou avisos no console do preview.
- Viewports 1440, 1280, 1024, 430, 393, 390 e 375: sem overflow horizontal. Mobile sem pin.
- Seleção Original → Zero e Zero → Original, troca rápida, teclado e drag: PASS, mantendo o scroll.
- Movimento reduzido: fixture local simulando a preferência; quatro cenas, sem pin e seleção funcional. A configuração do sistema não foi alterada.
- Refresh, resize e navegação de cenas foram exercitados. O estado é sincronizado depois do refresh do ScrollTrigger e o controlador interativo usa poses independentes.
- Back/forward na aba de preview: verificado.

Medição local no navegador integrado, viewport 1440 × 900, durante a troca de produtos: **120 frames; média 16,67 ms; p95 17,4 ms; máximo 17,7 ms; CLS 0; zero long tasks**. É uma amostra dessa interação nesse ambiente, não uma garantia universal de FPS. Os assets principais somam aproximadamente 984 KiB; os masters de fallback são carregados apenas em caso de erro; sem render loop contínuo próprio, WebGL ou vídeos.

Verificação retomada em 13/10/2026: Safari desktop e Google Chrome nativos foram exercitados com a versão atual. Hero, navegação entre cenas, seletor final, trocas rápidas e refresh funcionaram nos dois. A troca guiada por scroll e sua reversão também foram confirmadas no Safari. Screenshots dessa verificação foram salvos na pasta de entrega.

Limite de verificação: as dimensões exatas e as métricas de performance acima foram medidas no navegador integrado; os testes nativos usaram o tamanho disponível da janela. Safari em iPhone físico ainda não foi testado.

## Arquivos editáveis

`index.html`: conteúdo e estrutura. `styles.css`: identidade e responsive. `app.js`: controlador, master timeline e interações. `content.js`: dados dos produtos e campanhas. `assets/`: arquivos oficiais otimizados. `vendor/`: GSAP e ScrollTrigger locais.


## Correção da mídia da terceira seção — 13/10/2026

Causa reproduzida: ao selecionar Em casa e depois No campo, o GSAP mantinha `x = 720.008 px` derivado do `translateX(100%)` inicial do CSS. A animação terminava com `xPercent = 0`, mas o deslocamento em pixels permanecia. O packshot da campanha estava carregado (770 × 440; HTTP 200), visível e opaco, porém inteiramente fora da galeria e cortado pelo overflow.

Correção restrita a CampaignGallery: zerar x/y antes da animação; normalizar a foto ativa ao terminar, após resize e pageshow. Nenhum CSS, controlador de produto ou timeline global foi alterado. O script tem chave de versão para evitar que reload normal reutilize a versão anterior em cache.

Fallback: data-fallback aponta para cópias dos masters oficiais já existentes no trabalho — culture-natal-fallback.jpg, culture-pipoca-fallback.png e culture-futebol-fallback.png. A imagem correspondente substitui o WebP somente em caso de erro. Não houve geração de imagem ou mudança de crop/composição.

Verificação específica desta correção: sequência problemática, entrada/reversão, reload em #coisa-nossa, resize e alinhamento final em 1440/1280/390/430 no navegador integrado. A foto ativa terminou em translate(0,0), visibility visible, opacity 1, object-fit cover. Chrome nativo: hard refresh, sequência problemática e reload normal exercitados, com prova visual. Os três fallbacks foram carregados com sucesso em fixture isolada que simula falha dos WebPs. Sintaxe e 24 arquivos locais: PASS. Safari nativo: verificação interrompida por uso ativo do aplicativo; a prova visual desta correção não foi concluída. Sem deploy.
