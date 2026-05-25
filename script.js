let currentUser = null

const chat =
document.getElementById("chat")

let currentChatId = null

let memory = []

// =====================
// ADICIONAR MENSAGEM
// =====================

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

// =====================
// LOGIN
// =====================

async function loginGoogle(){

const provider =
new firebase.auth.GoogleAuthProvider()

provider.setCustomParameters({
prompt:"select_account"
})

try{

await auth.signInWithPopup(provider)

}catch(err){

console.log(err)

alert(err.message)

}

}

// =====================
// LOGOUT
// =====================

function logout(){

auth.signOut()

location.reload()

}

// =====================
// LOGIN STATE
// =====================

auth.onAuthStateChanged(async(user)=>{

if(user){

currentUser = user

document.getElementById("userName")
.innerText = user.displayName

document.getElementById("userPhoto")
.src = user.photoURL

loadChats()

}

})

// =====================
// NOVO CHAT
// =====================

async function createNewChat(firstMessage){

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
"Crie um título curto para essa conversa."

},

{
role:"user",
content:firstMessage
}

]

})

}

)

const data =
await response.json()

const title =
data.choices[0].message.content

const doc =
await db.collection("chats").add({

uid:currentUser.uid,

title:title,

messages:[],

time:Date.now()

})

currentChatId = doc.id

loadChats()

}

// =====================
// ENVIAR
// =====================

async function sendMessage(){

const input =
document.getElementById("messageInput")

const text =
input.value

if(!text) return

if(!currentChatId){

await createNewChat(text)

}

addMessage(text,"user")

memory.push({

role:"user",
content:text

})

input.value = ""

const thinking =
document.createElement("div")

thinking.className =
"message ai"

thinking.innerText =
"Pensando..."

chat.appendChild(thinking)

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
"Você é Rainbow AI."

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

// SALVAR

await db.collection("chats")
.doc(currentChatId)
.update({

messages:memory

})

}catch(err){

thinking.remove()

console.log(err)

addMessage("Erro 😭","ai")

}

}

// =====================
// CARREGAR CHATS
// =====================

async function loadChats(){

const list =
document.getElementById("historyList")

list.innerHTML = ""

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

snapshot.forEach(doc=>{

const data = doc.data()

const div =
document.createElement("div")

div.className =
"historyItem"

div.innerText =
data.title

div.onclick = ()=>{

openChat(doc.id)

}

list.appendChild(div)

})

}

// =====================
// ABRIR CHAT
// =====================

async function openChat(id){

chat.innerHTML = ""

currentChatId = id

const doc =
await db.collection("chats")
.doc(id)
.get()

const data =
doc.data()

memory =
data.messages || []

memory.forEach(msg=>{

if(msg.role == "user"){

addMessage(msg.content,"user")

}else{

addMessage(msg.content,"ai")

}

})

}

// =====================
// ENTER
// =====================

document
.getElementById("messageInput")

.addEventListener("keypress",function(e){

if(e.key === "Enter"){

sendMessage()

}

})
