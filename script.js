const API_KEY =
"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"

let currentUser = null
let currentChatId = null
let memory = []

const chat =
document.getElementById("chat")

// ======================
// LOGIN GOOGLE
// ======================

async function loginGoogle(){

const provider =
new firebase.auth.GoogleAuthProvider()

provider.setCustomParameters({
prompt:"select_account"
})

try{

const result =
await auth.signInWithPopup(provider)

currentUser = result.user

document.getElementById("loginBtn")
.style.display = "none"

document.getElementById("profile")
.style.display = "flex"

document.getElementById("userName")
.innerText = currentUser.displayName

document.getElementById("userPhoto")
.src = currentUser.photoURL

loadChats()

}catch(err){

console.log(err)

alert(err.message)

}

}

// ======================
// LOGOUT
// ======================

function logout(){

auth.signOut()

location.reload()

}

// ======================
// LOGIN STATE
// ======================

auth.onAuthStateChanged(async(user)=>{

if(user){

currentUser = user

document.getElementById("loginBtn")
.style.display = "none"

document.getElementById("profile")
.style.display = "flex"

document.getElementById("userName")
.innerText = user.displayName

document.getElementById("userPhoto")
.src = user.photoURL

loadChats()

}else{

document.getElementById("loginBtn")
.style.display = "block"

document.getElementById("profile")
.style.display = "none"

}

})

// ======================
// NOVA CONVERSA
// ======================

function newChat(){

currentChatId = null

memory = []

chat.innerHTML = `

<div class="welcome">

<h1>
Rainbow AI 🌈
</h1>

<p>
Nova conversa criada
</p>

</div>

`

}

// ======================
// ADD MSG
// ======================

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

// ======================
// SALVAR CHAT
// ======================

async function saveChat(){

if(!currentUser) return
if(!currentChatId) return

await db.collection("chats")
.doc(currentChatId)
.set({

uid:
currentUser.uid,

title:
memory[0]?.content
?.slice(0,30)
|| "Nova Conversa",

messages:
memory,

time:
Date.now()

})

}

// ======================
// HISTORICO
// ======================

async function loadChats(){

if(!currentUser) return

const history =
document.getElementById("historyList")

history.innerHTML = ""

const snapshot =
await db.collection("chats")

.where(
"uid",
"==",
currentUser.uid
)

.orderBy(
"time",
"desc"
)

.get()

snapshot.forEach((doc)=>{

const data = doc.data()

const button =
document.createElement("button")

button.className =
"historyButton"

button.innerText =
data.title || "Conversa"

button.onclick = ()=>{

openChat(doc.id)

}

history.appendChild(button)

})

}

// ======================
// ABRIR CHAT
// ======================

async function openChat(id){

currentChatId = id

chat.innerHTML = ""

const doc =
await db.collection("chats")
.doc(id)
.get()

const data =
doc.data()

memory =
data.messages || []

memory.forEach((msg)=>{

if(msg.role == "user"){

addMessage(
msg.content,
"user"
)

}else{

addMessage(
msg.content,
"ai"
)

}

})

}

// ======================
// ENVIAR MSG
// ======================

async function sendMessage(){

if(!currentUser){

alert("Faça login.")

return

}

const input =
document.getElementById("messageInput")

const text =
input.value.trim()

if(!text) return

// AUTO CRIAR CHAT

if(!currentChatId){

const doc =
await db.collection("chats")
.add({

uid:
currentUser.uid,

title:
text.slice(0,30),

messages:[],

time:
Date.now()

})

currentChatId = doc.id

loadChats()

}

// MSG USER

addMessage(text,"user")

memory.push({

role:"user",
content:text

})

input.value = ""

// IA PENSANDO

const thinking =
document.createElement("div")

thinking.className =
"message ai"

thinking.innerText =
"Pensando..."

chat.appendChild(thinking)

chat.scrollTop =
chat.scrollHeight

try{

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
"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[

{

role:"system",

content:
`
Você é Rainbow AI.

Você lembra da conversa anterior.

Responda de forma amigável,
inteligente e natural.
`

},

...memory

]

})

}

)

const data =
await response.json()

thinking.remove()

const reply =
data.choices[0]
.message.content

// MSG IA

addMessage(reply,"ai")

memory.push({

role:"assistant",
content:reply

})

// SALVAR FIREBASE

await saveChat()

}catch(err){

thinking.remove()

console.log(err)

addMessage(
"Erro 😭",
"ai"
)

}

}

// ======================
// ENTER
// ======================

document
.getElementById("messageInput")

.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

sendMessage()

}

}
)
