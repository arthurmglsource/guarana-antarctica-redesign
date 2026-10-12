# Guaraná Antarctica — primeira entrega local

Escopo: header, hero, entrada animada, primeiro scroll e transição para a origem. Os capítulos Brasil e Produto ficam para a próxima etapa visual. Nenhum site foi registrado, publicado ou conectado a um domínio.

Preview: http://127.0.0.1:5187/

Para iniciar novamente, a partir desta pasta: `python3 -m http.server 5187 --bind 127.0.0.1`.

## Pesquisa oficial

Consultada em 12 de outubro de 2026. O site respondeu ao navegador, embora a ferramenta de busca tenha encontrado proteção anti-bot.

- [Site oficial Brasil](https://www.guaranaantarctica.com.br/pt-br): navegação Produtos, Maués e Nossa História; produto Regular e Zero; fotografia com gotas; verde, vermelho, branco e amarelo; grafismos de folhas; tom simples e brasileiro.
- [Maués](https://www.guaranaantarctica.com.br/pt-br/maues): confirma “Original do Brasil”, a origem amazônica, o vínculo com Maués e o cultivo do fruto. A copy curta do projeto é editorial, baseada nesses fatos; não é apresentada como uma citação da marca.
- [Relatório Ambev](https://www.ambev.com.br/sites/g/files/wnfebl5836/files/2023-05/Annual%20and%20ESG%20Report%202023.pdf): confirma o vínculo com produtores de Maués. Dados numéricos não foram usados na página.
- Logo transparente e lata com condensação foram obtidos do próprio site oficial. Apenas margens transparentes foram retiradas; o produto não foi redesenhado, deformado nem recriado com IA.
- O site usa uma família identificada no CSS como Bud Crafted. Sem comprovação de licença de redistribuição, não foi copiada. Anton e Barlow foram escolhidas pela coerência visual e legibilidade, com suas licenças OFL incluídas. As cores são tokens desta execução derivados dos códigos visuais observados, não uma alegação de valores oficiais de um manual de marca.

## Auditoria dos anexos

Todos os oito anexos são RGB com fundo opaco. Mantêm as proporções originais.

| Imagem | Dimensões | Inspeção / decisão |
| --- | --- | --- |
| 1 — Original | 512 × 512 | Fundo branco, lata pequena na área; referência de produto. |
| 2 — Logo | 736 × 736 | Logo sobre verde; substituído pelo logo oficial transparente. |
| 3 — Original com gotas | 539 × 960 | Melhor packshot Original anexado; forma e rótulo correspondem ao asset servido no site. O recorte oficial transparente foi priorizado para preservar pixels reais. |
| 4 — É coisa nossa | 236 × 214 | Referência de linguagem gráfica; resolução insuficiente para uso ampliado. |
| 5 — Lata 0,33 L | 600 × 600 | Embalagem com indicação 0,33 L; não selecionada para a experiência brasileira de 350 ml. |
| 6 — Lata 269 ml | 400 × 400 | Outro formato e resolução limitada; não selecionada. |
| 7 — Zero | 500 × 500 | Produto pequeno dentro do quadro e baixa definição; não usado nesta etapa. |
| 8 — Zero no cenário azul | 1199 × 1753 | Maior imagem anexada; cenário incorporado e fotografia sem recorte. Não é necessário no escopo atual. |

Produto integrado: `assets/can.webp`, 371 × 681 pixels úteis. Logo: `assets/logo.webp`. Recomendação para o próximo refinamento: packshot oficial Original com pelo menos 2.000 pixels de altura útil para melhorar a nitidez do macrozoom. O atual funciona no hero, mas perde detalhe ao ampliar durante a transição.

## Imagens geradas

Usado o gerador integrado Imagegen, com solicitação de máxima qualidade disponível. Higgsfield não foi usado, conforme a substituição autorizada pelo usuário. Não foram gerados vídeos.

- `assets/origin.webp`: macro botânico panorâmico, 1672 × 941, ilustrativo; não é registro fotográfico de uma fazenda específica.
- `assets/sprig.webp`: ramo de guaraná com alpha real, otimizado para o tamanho de exibição.
- [Prompts completos](generation-prompts.json): instruções exatas usadas nas duas gerações.
- [Style tile](style-tile.html): tokens, tipografia e direção de fotografia usados no site.

## Motion e validação

GSAP 3.14.2 + ScrollTrigger, servidos localmente. Sem Lenis, WebGL ou vídeo. Rolagem nativa, timeline reversível, zoom progressivo, preenchimento verde e abertura circular da cena botânica. O texto entra depois da passagem. Desktop usa cerca de 2,45 alturas de tela de deslocamento ativo; mobile usa 1,85.

Verificado:

- Sintaxe de JavaScript e existência de referências locais: PASS.
- HTTP 200 e todas as imagens carregadas: PASS.
- Hero e origem no Chrome desktop e Safari desktop: PASS.
- Desktop 1440 × 900 e 1280 × 800: inspeção visual PASS.
- Viewports 1024, 430, 393, 390 e 375 pixels: sem overflow horizontal após refresh. Hero mobile recomposto; origem e CTA inspecionados em 393 e 375.
- Rolagem comum, reversão, CTA Maués, refresh e resize: PASS.
- Movimento reduzido: testado em fixture local que simula a preferência; sem pin, duas cenas em fluxo normal e link para origem funcional. A configuração do sistema do usuário não foi alterada.
- Nenhum erro ou aviso registrado no console do preview.

Limites: sem medição instrumental de FPS, CLS ou Lighthouse; sem dispositivo iPhone físico. Não se afirma 60 fps nem validação Safari iOS. Back/forward foram verificados na aba de preview.

## Arquivos

`index.html` é a página; `styles.css` contém composição e breakpoints; `app.js` concentra o motion; `content.js` contém a copy editável. `assets/` e `vendor/` permitem servir o site sem dependências de rede externas. Os links externos apontam para destinos oficiais reais.
