// ======================================
// RAINBOW AI SUPER SCRIPT 🌈
// ======================================

const API_KEY =
"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"

const MODEL =
"meta-llama/llama-4-scout-17b-16e-instruct"

let memory = []

const chat =
document.getElementById("chat")

const input =
document.getElementById("messageInput")

const fileInput =
document.getElementById("fileInput")

// ======================================
// ADD MESSAGE
// ======================================

function addMessage(text,type){

const div =
document.createElement("div")

div.className =
"message " + type

div.innerText = text

chat.appendChild(div)

chat.scrollTop =
chat.scrollHeight

}

// ======================================
// ADD IMAGE
// ======================================

function addImage(url){

const img =
document.createElement("img")

img.src = url

img.className =
"aiImage"

chat.appendChild(img)

chat.scrollTop =
chat.scrollHeight

}

// ======================================
// FILE TO TEXT
// ======================================

async function readFileContent(file){

return new Promise((resolve)=>{

const reader =
new FileReader()

reader.onload =
(e)=>{

resolve(e.target.result)

}

reader.readAsText(file)

})

}

// ======================================
// IMAGE TO BASE64
// ======================================

async function imageToBase64(file){

return new Promise((resolve)=>{

const reader =
new FileReader()

reader.onload =
()=>{

resolve(reader.result)

}

reader.readAsDataURL(file)

})

}

// ======================================
// GENERATE IMAGE
// ======================================

async function generateImage(prompt){

addMessage(
"🎨 Gerando imagem...",
"ai"
)

const url =
`https://image.pollinations.ai/prompt/${
encodeURIComponent(prompt)
}?width=1024&height=1024&nologo=true`

addImage(url)

}

// ======================================
// SEND MESSAGE
// ======================================

async function sendMessage(){

const text =
input.value.trim()

const file =
fileInput.files[0]

if(!text && !file) return

// ======================================
// IMAGE COMMAND
// ======================================

if(text.startsWith("/img ")){

const prompt =
text.replace("/img ","")

addMessage(text,"user")

await generateImage(prompt)

input.value = ""

return

}

// ======================================
// USER MESSAGE
// ======================================

if(text){

addMessage(text,"user")

memory.push({

role:"user",
content:text

})

}

// ======================================
// FILE SYSTEM
// ======================================

let extraContent = ""

let imageBase64 = null

if(file){

addMessage(
`📎 Arquivo: ${file.name}`,
"user"
)

// TEXT FILES

if(

file.name.endsWith(".txt")
||
file.name.endsWith(".js")
||
file.name.endsWith(".html")
||
file.name.endsWith(".css")
||
file.name.endsWith(".json")
||
file.name.endsWith(".py")

){

extraContent =
await readFileContent(file)

}

// IMAGE FILES

if(

file.type.startsWith("image/")

){

imageBase64 =
await imageToBase64(file)

}

}

// ======================================
// THINKING
// ======================================

const thinking =
document.createElement("div")

thinking.className =
"message ai"

thinking.innerText =
"Pensando..."

chat.appendChild(thinking)

// ======================================
// REQUEST
// ======================================

try{

let messages = [

{

role:"system",

content:
`
Você é Rainbow AI.

Você ajuda o usuário.

Você consegue:
- analisar arquivos
- analisar código
- analisar imagens
- conversar normalmente
`

}

]

// MEMORY

memory.forEach((m)=>{

messages.push(m)

})

// FILE CONTENT

if(extraContent){

messages.push({

role:"user",

content:
`
ARQUIVO:

${extraContent}
`

})

}

// IMAGE VISION

if(imageBase64){

messages.push({

role:"user",

content:[

{

type:"text",

text:
"Analise esta imagem."

},

{

type:"image_url",

image_url:{
url:imageBase64
}

}

]

})

}

// NORMAL TEXT

if(text){

messages.push({

role:"user",

content:text

})

}

// ======================================
// FETCH
// ======================================

const response =
await fetch(

"https://api.groq.com/openai/v1/chat/completions",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

"Authorization":
`Bearer ${API_KEY}`

},

body:JSON.stringify({

model:

imageBase64
?

"llama-3.2-11b-vision-preview"

:

MODEL,

messages:messages,

max_tokens:1000

})

}

)

const data =
await response.json()

thinking.remove()

const reply =
data.choices[0]
.message.content

addMessage(reply,"ai")

memory.push({

role:"assistant",
content:reply

})

}catch(err){

thinking.remove()

console.log(err)

addMessage(
"Erro 😭",
"ai"
)

}

// CLEAR

input.value = ""

fileInput.value = ""

}

// ======================================
// ENTER
// ======================================

input.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

sendMessage()

}

}
)
