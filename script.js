let currentUser = null

const chat =
document.getElementById("chat")

let memory = []

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

async function loginGoogle(){

const provider =
new firebase.auth.GoogleAuthProvider()

try{

const result =
await auth.signInWithPopup(provider)

const user = result.user

currentUser = user

document.getElementById("userName")
.innerText = user.displayName

document.getElementById("userPhoto")
.src = user.photoURL

loadHistory()

}catch(err){

alert("Erro login")

}

}

function logout(){

auth.signOut()

location.reload()

}

auth.onAuthStateChanged(user=>{

if(user){

currentUser = user

document.getElementById("userName")
.innerText = user.displayName

document.getElementById("userPhoto")
.src = user.photoURL

loadHistory()

}

})

async function sendMessage(){

const input =
document.getElementById("messageInput")

const text =
input.value

if(!text) return

addMessage(text,"user")

memory.push({
role:"user",
content:text
})

input.value = ""

addMessage("Pensando...","ai")

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
"Você é Rainbow AI. Seja amigável e lembre das conversas."
},

...memory

]

})

}

)

const data =
await response.json()

document.querySelectorAll(".ai")[
document.querySelectorAll(".ai").length - 1
].remove()

const reply =
data.choices[0].message.content

memory.push({
role:"assistant",
content:reply
})

addMessage(reply,"ai")

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

addMessage("Erro 😭","ai")

}

}

async function loadHistory(){

if(!currentUser) return

const list =
document.getElementById("historyList")

list.innerHTML = ""

const snapshot =
await db.collection("chats")
.where("uid","==",currentUser.uid)
.get()

snapshot.forEach(doc=>{

const data = doc.data()

const div =
document.createElement("div")

div.className =
"historyItem"

div.innerHTML =
"<b>Você:</b> " + data.user

div.onclick = ()=>{

addMessage(data.user,"user")
addMessage(data.ai,"ai")

}

list.appendChild(div)

})

}
