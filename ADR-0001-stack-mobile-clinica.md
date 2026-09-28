# ADR-0001 — Stack mobile para clínica pequena

- **Status:** Aceito
- **Data:** 2026-09-28
- **Autor:** Luiz Felipe Dias Cardoso Feres Lima

## Contexto

Uma clínica pequena precisa de um aplicativo de agendamento. A equipe tem dois desenvolvedores, ambos sem experiência prévia em desenvolvimento mobile, e o prazo disponível é de três meses. A solução deve permitir entrega rápida, manutenção simples e acesso pelos pacientes sem exigir instalação obrigatória em lojas de aplicativos.

Restrições principais: equipe reduzida, curva de aprendizado mobile, prazo curto, necessidade de atender diferentes dispositivos e risco de retrabalho ao manter bases de código distintas.

## Decisão

Adotar uma **Progressive Web App (PWA)** para o aplicativo de agendamento.

A PWA permite reutilizar conhecimentos de desenvolvimento web, manter uma única base de código e entregar o sistema diretamente pelo navegador. Também pode oferecer instalação opcional, funcionamento com recursos de cache e experiência próxima à de um aplicativo, sem depender da publicação em lojas.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **PWA — escolhida** | Menor curva de aprendizado; código único; distribuição imediata por URL; instalação opcional; menor custo operacional. | Limitações e diferenças entre navegadores; acesso mais restrito a recursos nativos; notificações podem ser menos consistentes. |
| React Native | Reutilização de código entre Android e iOS; acesso maior a recursos nativos; ecossistema amplo. | Exige aprender conceitos mobile e integrações nativas; configuração e depuração podem aumentar o prazo; publicação em lojas continua necessária. |
| Flutter | Código único; componentes e comportamento visual consistentes; bom suporte multiplataforma. | Nova linguagem e novo framework para a equipe; maior esforço inicial de aprendizado; distribuição normalmente depende das lojas. |
| Nativo — Kotlin + Swift | Melhor integração com cada plataforma; desempenho e APIs nativas completos. | Duas bases de código; maior custo de desenvolvimento e manutenção; exige conhecimentos específicos; incompatível com o prazo e o tamanho da equipe. |

## Consequências

### Positivas

- Entrega inicial compatível com o prazo de três meses.
- Aproveitamento das habilidades web já existentes.
- Uma única base de código e processo de atualização centralizado.
- Acesso por link, sem instalação obrigatória nem aprovação de loja.
- Instalação opcional para usuários que desejarem uma experiência mais próxima de aplicativo.

### Negativas e riscos

- Notificações push, execução em segundo plano e integrações com recursos do aparelho podem variar por navegador e sistema operacional.
- Recursos avançados de câmera, geolocalização ou pagamentos podem exigir soluções específicas ou uma futura migração para abordagem híbrida/nativa.
- Compatibilidade e experiência devem ser testadas nos navegadores móveis mais utilizados pelo público da clínica.
- A equipe deverá acompanhar limites de suporte a PWA e documentar as decisões de compatibilidade.

## Referências

- [MDN — Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).
- [Charland e LeRoux — Mobile application development: web vs. native](https://dblp.org/rec/journals/cacm/CharlandL11.html).
- [Michael Nygard — Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
