<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>JunBot IA</title>
<style>
body { background:#111; color:white; font-family:Arial; text-align:center; }
input,button{padding:10px;width:300px;margin:5px;}
img{max-width:300px;margin-top:20px;border-radius:10px;}
</style>
</head>

<body>

<h1>🤖 JunBot IA</h1>

<input id="txt" placeholder="Digite algo">

<br>

<button onclick="chat()">💬 IA</button>
<button onclick="img()">🖼️ Imagem</button>

<pre id="res"></pre>
<img id="img"/>

<script>

const API_KEY = "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";

async function chat(){

let texto = document.getElementById("txt").value;

let r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method:"POST",
headers:{
"Authorization":"Bearer "+API_KEY,
"Content-Type":"application/json"
},
body: JSON.stringify({
model:"llama-3.1-8b-instant",
messages:[{role:"user", content:texto}]
})
});

let d = await r.json();

document.getElementById("res").innerText =
d.choices?.[0]?.message?.content || "erro";

document.getElementById("img").src="";
}

function img(){

let t = document.getElementById("txt").value;

let seed = Date.now();

let url = "https://image.pollinations.ai/prompt/"
+ encodeURIComponent(t)
+ "?width=1024&height=1024&seed=" + seed;

document.getElementById("img").src = url;
document.getElementById("res").innerText = "";

}

</script>

</body>
</html>
