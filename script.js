let currentUser = null

const chat =
document.getElementById("chat")

let memory = []

// ======================
// ADICIONAR MENSAGEM
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

console.log(result.user)

}catch(err){

console.log(err)

alert(err.message)

}

}
// ======================
// VERIFICAR LOGIN
// ======================

auth.onAuthStateChanged(async (user)=>{

if(user){

currentUser = user

document.getElementById("userName")
.innerText = user.displayName

document.getElementById("userPhoto")
.src = user.photoURL

document.getElementById("userPhoto")
.style.display = "block"

loadHistory()

console.log("LOGADO:",user)

}else{

console.log("DESLOGADO")

}

})

// ======================
// ENVIAR MENSAGEM
// ======================

async function sendMessage(){

const input =
document.getElementById("messageInput")

const text =
input.value

if(!text) return

// MOSTRA MENSAGEM USER

addMessage(text,"user")

memory.push({

role:"user",
content:text

})

input.value = ""

// MENSAGEM IA

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

"Content-Type":"application/json",

"Authorization":
"Bearer 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"

},

body:JSON.stringify({

model:
"meta-llama/llama-4-scout-17b-16e-instruct",

messages:[

{
role:"system",

content:
"Você é Rainbow AI. Seja amigável, engraçada, inteligente e lembre das conversas, faça oque o Usuario mandar."

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
data.choices[0].message.content

memory.push({

role:"assistant",
content:reply

})

addMessage(reply,"ai")

// ======================
// SALVAR FIRESTORE
// ======================

if(currentUser){

await db.collection("chats").add({

uid:currentUser.uid,

user:text,

ai:reply,

time:Date.now()

})

loadHistory()

}

}catch(err){

thinking.remove()

console.log(err)

addMessage("Erro 😭","ai")

}

}

// ======================
// CARREGAR HISTÓRICO
// ======================

async function loadHistory(){

if(!currentUser) return

const list =
document.getElementById("historyList")

list.innerHTML = ""

const snapshot =
await db.collection("chats")
.where("uid","==",currentUser.uid)
.orderBy("time","desc")
.get()

snapshot.forEach(doc=>{

const data = doc.data()

const div =
document.createElement("div")

div.className =
"historyItem"

div.innerHTML =

`
<b>Você:</b><br>
${data.user}
`

div.onclick = ()=>{

addMessage(data.user,"user")

addMessage(data.ai,"ai")

}

list.appendChild(div)

})

}

// ======================
// ENTER PARA ENVIAR
// ======================

document
.getElementById("messageInput")

.addEventListener("keypress",function(e){

if(e.key === "Enter"){

sendMessage()

}

})
