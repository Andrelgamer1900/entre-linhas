# Entre Linhas - Biblioteca Digital

Este é o projeto base para o aplicativo **Entre Linhas**, um simulador de biblioteca digital (estilo Kindle) desenvolvido como parte do projeto acadêmico.

## Integrantes do Grupo
- **Ana Clara Barbosa dos Anjos** (Scrum Master)
- **Cauan Gonçalves Ferreira**
- **Luan Patrique da Silva Oliveira**
- **André Leandro Cordeiro de Carvalho**

## Estrutura de Diretórios

A estrutura segue o padrão Maven para projetos Java, organizada da seguinte forma:

- `src/main/java/com/entrelinhas/`: Código fonte do sistema.
    - `model/`: Classes de entidade (ex: Livro, Usuario, Avaliacao).
    - `repository/`: Interfaces para persistência de dados.
    - `service/`: Lógica de negócio (ex: Cálculo de progresso).
    - `controller/`: Pontos de entrada da API/Interface.
    - `config/`: Configurações do sistema.
- `src/main/resources/`: Arquivos de configuração e recursos estáticos.
- `src/test/`: Testes unitários e de integração.
- `docs/`: Documentação do projeto.
    - `requirements/`: Histórias de Usuário e Requisitos Não-Funcionais.
    - `wireframes/`: Esboços das telas do aplicativo.

## Tecnologias Planejadas
- **Linguagem:** Java
- **Arquitetura:** MVC (Model-View-Controller)
