# Usando Puppeteer para automatizar coleta de dados durante o desafio da FIAP na Maratona Behind The Code

<p>
  <a href="https://www.linkedin.com/in/paulodelia/">
      <img alt="Paulo D'Elia" src="https://img.shields.io/badge/-paulodelia-important?style=flat&logo=Linkedin&logoColor=white" />
   </a>
  <a href="https://github.com/paulohdelia/behind-the-code-fiap-2020/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/paulohdelia/behind-the-code-fiap-2020?color=important">
  </a> 
  <img src="https://img.shields.io/github/languages/count/paulohdelia/behind-the-code-fiap-2020?color=important&style=flat-square">
</p>

O desafio da FIAP foi divido em duas partes:
  1. Coletar e organizar dados em formato JSON
  2. Treinar e testar o modelo do Watson Discovery
  
##  Coletar e organizar dados em formato JSON

Os dados deveriam ser coletados de alguns links específicos, como esse vídeo do famoso site [TED](https://www.ted.com/talks/pierre_barreau_how_ai_could_compose_a_personalized_soundtrack_to_your_life/transcript?language=pt-br) e este artigo do site [Olhar Digital](https://olhardigital.com.br/colunistas/wagner_sanchez/post/o_futuro_cada_vez_mais_perto/78972)

Também era necessário que fossem organizados desta forma
```json
{
  "author": "Autor/Autora do conteúdo",
  "body": "Corpo do conteúdo (transcrição da palestra ou todo o corpo de um artigo)",
  "title": "Título da palestra ou artigo",
  "type": "Tipo do conteúdo (deve ser exatamente article ou video)",
  "url": "URL onde o conteúdo foi acessado"
}
```

Primeiro eu analisei os sites para entender como eu poderia extrair informações

![](http://drive.google.com/uc?export=view&id=18mRZVul_7Pjums2D5eMgL2Z1mtnQHlZQ)

Tendo as informações que eu precisava fiz um script com o Puppeteer para extrair os dados dos sites 

```js
// Get info from transcription
let rawTranscription = document.querySelectorAll('[dir="ltr"] span > a');

// Get author
let author = document.querySelector("#content > div > div:nth-child(2) > div.bg\\:gray-ll.c\\:black.p-x\\:2.p-y\\:\\.5.bg\\:white\\@md > div.f\\:\\.9.m-b\\:\\.4.m-t\\:\\.5.d\\:i-b").textContent;

// Get title
let title = document.querySelector("#content > div > div:nth-child(2) > div.bg\\:gray-ll.c\\:black.p-x\\:2.p-y\\:\\.5.bg\\:white\\@md > h1").textContent;

// Variable that will store content of transcription
let body = '';

// Get all text and turn into a single text in variable body
rawTranscription.forEach(t => {
    body += t.textContent + ' ';
})

// In this case, type is video because is from TedTalks
let json = {
    author,
    body,
    title,
    type: 'video'
}
```

Agora com acesso a esses dados só precisei usar as funções que vem com o Node para criar os arquivos em JSON

```js
// I will use the title to make the json file name
// Replace all whitespace with -
const title = json.title.toLowerCase().replace(/\s/g, '-');

// Turn javascript object into JSON
json = JSON.stringify(json);

// Create and save JSON
fs.writeFile(`${title}.json`, json, 'utf8', () => console.log(`${title}.json created`));
```

![](http://drive.google.com/uc?export=view&id=1D4kA-Z0x8C5l_vqnvQMMBhAYjyMfOZrx)

## Treinar e testar o modelo do Watson Discovery

Esta etapa foi a mais simples, e também a mais demorada

Primeiro instanciei o Watson Discovery e fiz uma coleção com aqueles arquivos em JSON

Depois disso começou a parte que tomou maior tempo. Para melhorar o modelo, fiz mais ou menos 50 **queries** (consultas) e validei os resultados como "relavante" ou "não relevante"

![](http://drive.google.com/uc?export=view&id=1zv_Nco8_RV-fU7N1yXrRP5FhHyos0BO2)

E para finalizar coloquei o modelo em prática

![](http://drive.google.com/uc?export=view&id=1hSCY0UaPZxvan674O5MZypWk5l5oY-bm)
