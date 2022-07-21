# Desafio 05 - Criando um projeto do zero
# 💻 Sobre o desafio

Nesse desafio, você deverá criar uma aplicação para treinar o que aprendeu até agora no ReactJS

Essa será uma aplicação onde o seu principal objetivo é criar um blog do zero. Você vai receber uma aplicação praticamente em branco que deve consumir os dados do Prismic e ter a interface implementada conforme o layout do Figma. Você terá acesso a diversos arquivos para implementar:

- Estilizações global, comum e individuais;
- Importação de fontes Google;
- Paginação de posts;
- Cálculo de tempo estimado de leitura do post;
- Geração de páginas estáticas com os métodos `getStaticProps` e `getStaticPaths`;
- Formatação de datas com `date-fns`;
- Uso de ícones com `react-icons`;
- Requisições HTTP com `fetch`;
- Entre outros.

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

## Se preparando para o desafio
- [x] Prismic
  1. *slug*
  2. *banner*
  3. *title*
  4. *first_publication_date (campo gerado automaticamente pelo Prismic)*
  5. *author*
  6. *content (primeiro grupo)*
  7. *content (segundo grupo)*
  8. *heading (primeiro grupo)*
  9. *body (primeiro grupo)*
  10. *heading (segundo grupo)*
  11. *body (segundo grupo)*
- [ ] Figma;
- [ ] fetch;
- [ ] react-icons;
- [ ] date-fns.

## O que devo editar na aplicação?
Com o template já clonado, as dependências instaladas e o Prismic já configurado, você deve completar onde não possui código com o código para atingir os objetivos de cada teste. Os documentos que devem ser editados são:

- [x] *src/pages/_document.tsx*
    - [x] Nesse arquivo você deve configurar a importação da fonte Inter do Google Fonts.
    - [x] Os tamanhos utilizados são `Regular`, `Semi Bold` e `Bold`.
- [x] *src/pages/index.tsx*
- [x] *src/pages/home.module.scss*
- [x] *src/pages/post/[slug].tsx*
- [x] *src/pages/posts/post.module.scss);*
- [x] *src/components/Header/index.tsx);*
    - [x] Nesse arquivo você deve renderizar a logo `spacetraveling`.
    - [x] Ela deve ser exportada do Figma e salva na pasta `public` na raiz do seu projeto para a correta utilização.
    - [x] Além disso, a logo deve ter o `alt` com o valor `logo` para que o teste possa encontrá-la corretamente.
    - [x] Por fim, ao clicar na logo é preciso navegar para a página principal `/`.
- [x] *src/components/Header/header.module.scss);*
    - [x] Nesse arquivo você deve implementar toda a estilização do Header da aplicação.
- [x] *src/styles/global.scss*
    - [x] Nesse arquivo você deve implementar toda a estilização global da sua aplicação (ex.: variáveis das cores do seu projeto).
- [c] *src/styles/common.module.scss*

## Especificação dos testes
Para esse desafio, temos os seguintes testes:
- [x] **Teste components/Header/index.tsx**
  - [x] should be able to render logo
  - [x] should be able to navigate to home page after a click
- [x] **Testes pages/Home/index.tsx**
  - [x] should be able to return prismic posts documents using getStaticProps
  - [x] should be able to render posts documents info
  - [x] should be able to navigate to post page after a click
  - [x] should be able to load more posts if available
  - [x] should not be able to load more posts if not available
- [x] **Testes pages/post/[slug].tsx**
  - [x] should be able to return prismic posts documents paths using getStaticPaths
  - [x] should be able to return prismic post document using getStaticProps
  - [x] should be able to render post document info
  - [x] should be able to render loading message if fallback

**Função para calcular o tempo de leitura**
```
function calculateReadingTime(content = []): string {
    const wordReadingPerMinute = 200;
    let totalWords = 0;
    let averageReadingtime = 0;

    totalWords = content.reduce((acumulador, valorAtual) => {
      const heading = valorAtual.heading?.split(' ');
      const body = RichText.asText(valorAtual.body).split(' ');
      return acumulador + (heading.length + body.length);
    }, totalWords);

    averageReadingtime = Math.ceil(totalWords / wordReadingPerMinute);
    return `${averageReadingtime} min`;
  }
```
