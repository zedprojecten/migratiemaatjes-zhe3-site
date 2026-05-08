# Vorige build is afgewezen — fix dit prioritair

De vorige build van deze site is afgekeurd door een runtime gate (visual QA, smoke-test, copy-quality, of vergelijkbaar). Lees deze feedback voordat je code aanpast en behandel de genoemde issues als je nummer-1 prioriteit.

## Originele error

```
Visual QA verwierp de build (score 4): Home midden-sectie en grote delen van 'hoe het werkt' hebben donkergrijze tekst op zwart — onleesbaar, faalt WCAG.; Hero gebruikt exact de AI-generic groen/paars/blauw gradient — botst hard met 'nuchter, vakkundig, technisch-betrouwbaar' tone.; Hero-titel 'Custom datasets, foutloos van A naar B' mixt Engels in een Nederlandse site.
```

## Wat te doen

1. Identificeer per issue welk component/pagina geraakt wordt.
2. Pas de code aan zodat de issue verdwijnt (contrast fix, content    toevoegen, layout aanpassen, etc).
3. Verifieer met je smoke-test/visual-check voor je BUILD_COMPLETE schrijft.
