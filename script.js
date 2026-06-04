const NGROK_URL = "https://ngrok-free.dev";
let personagens = [];
let Richmond = null;

window.addEventListener("DOMContentLoaded", function() {
    const salvos = localStorage.getItem('polly_ai_chars');
    if (salvos) {
        personagens = JSON.parse(salvos);
        renderizarLista();
    }

    document.getElementById("btn-criar").addEventListener("click", criarNovoPersonagem);
    document.getElementById("btn-enviar").addEventListener("click", enviarMensagem);
    document.getElementById("user-input").addEventListener("keypress", verificarEnter);
});

function criarNovoPersonagem() {
    const nameInput = document.getElementById('char-name');
    const modelInput = document.getElementById('char-model');
    const promptInput = document.getElementById('char-prompt');

    if (!nameInput.value || !promptInput.value) {
        alert("Por favor, preencha o nome e as instruções da IA!");
        return;
    }

    const novoChar = {
        id: Date.now(),
        name: nameInput.value,
        model: modelInput.value,
        prompt: promptInput.value,
        historico: []
    };

    personagens.push(novoChar);
    salvarNoNavegador();
    renderizarLista();
    selecionarPersonagem(novoChar.id);

    nameInput.value = '';
    promptInput.value = '';
}

function renderizarLista() {
    const listDiv = document.getElementById('char-list');
    listDiv.innerHTML = '';

    personagens.forEach(char => {
        const card = document.createElement('div');
        card.className = "char-card" + (Richmond && Richmond.id === char.id ? " active" : "");
        card.onclick = function() { selecionarPersonagem(char.id); };
        card.innerHTML = "<h4>" + char.name + "</h4><p>Modelo: " + char.model + "</p>";
        listDiv.appendChild(card);
    });
}

function selecionarPersonagem(id) {
    Richmond = personagens.find(function(c) { return c.id === id; });
    renderizarLista();

    document.getElementById('current-char-title').innerText = "Conversando com: " + Richmond.name;
    document.getElementById('current-char-info').innerText = "Modelo ativo: " + Richmond.model + ' | Instrução: "' + Richmond.prompt + '"';

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    
    if (Richmond.historico.length === 0) {
        adicionarMensagemNaTela('ai', "Olá! Eu fui configurado para agir como: \"" + Richmond.prompt + "\". Como posso te ajudar hoje?");
    } else {
        Richmond.historico.forEach(function(msg) {
            adicionarMensagemNaTela(msg.role === 'user' ? 'user' : 'ai', msg.content);
        });
    }
}

function enviarMensagem() {
    if (!Richmond) {
        alert("Crie ou escolha um personagem ao lado primeiro!");
        return;
    }

    const input = document.getElementById('user-input');
    const texto = input.value.trim();
    if (!texto) return;

    input.value = '';

    adicionarMensagemNaTela('user', texto);
    Richmond.historico.push({ role: "user", content: texto });

    let mensagensParaEnviar = [
        { role: "system", content: Richmond.prompt }
    ];
    
    mensagensParaEnviar = mensagensParaEnviar.concat(Richmond.historico);

    fetch(NGROK_URL + "/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer bpk-d7cdc91f2a02778d-public",
            "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({
            model: Richmond.model,
            messages: mensagensParaEnviar
        })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                const respostaIA = data.choices[0].message.content;
                adicionarMensagemNaTela('ai', respostaIA);
                Richmond.historico.push({ role: "assistant", content: respostaIA });
                salvarNoNavegador();
            })
            .catch(function(err) {
                adicionarMensagemNaTela('ai', "Erro de Conexão: Certifique-se de que o seu Ngrok e o Ollama estão ligados no PC!");
            });
}

function adicionarMensagemNaTela(remetente, texto) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = "message " + remetente;
    msgDiv.innerText = texto;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function salvarNoNavegador() {
    localStorage.setItem('polly_ai_chars', JSON.stringify(personagens));
}

function verificarEnter(event) {
    if (event.key === "Enter") enviarMensagem();
}
