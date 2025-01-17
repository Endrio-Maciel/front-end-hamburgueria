
# Sistema de Gestão Financeira - Frontend

Este repositório contém o frontend do sistema de gestão financeira para hamburgueria. O objetivo do projeto é permitir o controle e a visualização das entradas e saídas financeiras, com funcionalidades de previsão de lucro e controle de transações. 

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Next.js**: Framework React para renderização do lado servidor (SSR) e geração de sites estáticos (SSG).
- **TailwindCSS**: Framework de CSS utilitário para estilização rápida e responsiva.
- **Fetch API**: Para consumir a API do backend e realizar requisições HTTP.
- **JWT (JSON Web Token)**: Para autenticação de usuários no sistema.

## Funcionalidades

- **Dashboard**: Exibição de gráficos financeiros com entradas, saídas e previsão de lucro.
- **Transações**: Visualização, criação, edição e exclusão de transações financeiras.
- **Categorias**: Criação e associação de transações a categorias personalizadas.
- **Autenticação**: Sistema de login utilizando JWT.

## Autenticação

Este sistema utiliza **JWT (JSON Web Token)** para autenticação de usuários. Após realizar o login, o token gerado será armazenado localmente no navegador (geralmente em cookies ou localStorage) e será enviado nas requisições para garantir que o usuário tenha acesso às funcionalidades apropriadas.

## Dependências

- `react`
- `next`
- `tailwindcss`
- `axios` ou `fetch` (para consumo de API)
- `jsonwebtoken` (para autenticação)
- `react-router-dom` (para navegação, se necessário)
