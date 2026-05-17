const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "db.json";

function lerDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function salvarDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post("/comprar", (req, res) => {
  let db = lerDB();

  if (!db.disponivel) {
    return res.json({
      status: "erro",
      msg: "Produto esgotado"
    });
  }

  db.disponivel = false;
  db.dataVenda = new Date().toISOString();
  salvarDB(db);

  res.json({
    status: "aguardando",
    msg: "Pagamento aguardando"
  });
});

app.get("/conta", (req, res) => {
  let db = lerDB();

  if (!db.disponivel) {
    return res.json({
      usuario: db.usuario,
      senha: db.senha
    });
  }

  res.json({
    msg: "Ainda disponível"
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
