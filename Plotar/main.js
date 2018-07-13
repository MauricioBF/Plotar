const dados = [];
const selection = document.querySelector('#cidades');
const graphic = document.querySelector('#grafico');
const divh3 = document.querySelector('#lista');

for (let cont = 1999; cont < 2011; cont++) {
    const url = 'https://cors-anywhere.herokuapp.com/http://dados.fee.tche.br/ckan-download/fee-' + cont +'-mun-genero-feminino-103217.csv';
    fetch(url).then(text).then(process).then(addOption).catch(console.error);
}

selection.addEventListener('change', function(e) {
    open(e.target.value);
});
divh3.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        close(e.target.style.color, e.target);
    }
});

function text(response) {
    return response.text();
}

function process(text) {
    const rows = text.split('\n');
    const records = [];
    for (let i = 2; i < rows.length - 1; i++) {
        const columns = rows[i].split(',');
        columns[0] = columns[0].replace(/"/g, '');
        columns[1] = columns[1].replace(/"/g, '');
        columns[2] = columns[2].replace(/"/g, '');
        columns[3] = columns[3].replace(/"/g, '');
        columns[4] = columns[4].replace(/"/g, '');
        const record = {
            municipio: columns[0],
            ibge: columns[1],
            lat: columns[2],
            long: columns[3],
            taxa: columns[4]
        };
        records.push(record);
    }
    dados[dados.length] = records;
}

function addOption() {
    for (let cont = 1; cont < dados[0].length; cont++) {
        const option = document.createElement('option');
        option.value = dados[0][cont].municipio;
        option.innerText = dados[0][cont].municipio;
        selection.appendChild(option);
    }
}

function open(nome) {
    if (nome !== '') {
        let color = 'rgb(0, 0, 0)';
        const h3 = createh3(nome);
        divh3.appendChild(h3);
        for (let contano = 0, contgraphic = 1;
            contano < 12; contano++,
            contgraphic+=2) { // Ano
            let nunmunicipio = 0;
            // Cria a div e h3
            const div = creatediv();
            // Adiciona cor a div
            if (contano === 0) {
                color = createcolor();
                div.style.background = color;
                h3.style.color = color;
            } else {
                div.style.background = color;
                h3.style.color = color;
            }
            // Pega taxa
            for (let contmunicipio = 0, stop = false;
                contmunicipio < dados[contano].length && stop === false;
                contmunicipio++) {
                if (dados[contano][contmunicipio].municipio === nome) {
                    nunmunicipio = contmunicipio;
                    stop = true;
                }
            }
            const taxa = dados[contano][nunmunicipio].taxa;
            // Adiciona altura a div com base na taxa
            div.style.height = (taxa/1500)*400 + 'px';
            // Adiciona a minidiv e o h3 a div mae
            graphic.childNodes[contgraphic].appendChild(div);
            // Adiciona largura
            for (let contlargura = 0;
                contlargura < graphic.childNodes[contgraphic].childNodes.length;
                contlargura++) {
                const largura =
                100/(graphic.childNodes[contgraphic].childNodes.length);
                const graphicchild =
                graphic.childNodes[contgraphic].childNodes[contlargura];
                graphicchild.style.width = largura + '%';
                // Definir esquerda
                graphicchild.style.left = contlargura*(largura) + '%';
            }
        }
    }
}

function close(color, h3) {
    h3.remove();
    for (let contano = 0, contgraphic = 1;
        contano < 12; contano++,
        contgraphic += 2) {
        // Pegar a div com a mesma cor
        for (let contdiv = 0;
            contdiv < graphic.childNodes[contgraphic].childNodes.length;
            contdiv++) {
            if (graphic.childNodes[contgraphic].
                childNodes[contdiv].style.background === color) {
                // Mudar
                graphic.childNodes[contgraphic].childNodes[contdiv].remove();
            }
            for (let contlargura = 0;
                contlargura < graphic.childNodes[contgraphic].childNodes.length;
                contlargura++) {
                const largura =
                    100 / (graphic.childNodes[contgraphic].childNodes.length);
                const graphicchild =
                    graphic.childNodes[contgraphic].childNodes[contlargura];
                graphicchild.style.width = largura + '%';
                // Definir esquerda
                graphicchild.style.left = contlargura * (largura) + '%';
            }
        }
    }
}

function creatediv() {
    const div = document.createElement('div');
    div.className = 'barra';
    return div;
}

function createh3(text) {
    const h3 = document.createElement('h3');
    h3.innerText = text;
    return h3;
}

function createcolor(number) {
    const a = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const c = Math.floor(Math.random() * 255);
    const color = 'rgb(' + a + ', ' + b +', ' + c + ')';
    return color;
}