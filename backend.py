from flask import Flask, request, jsonify
import requests
import urllib.parse

app = Flask(__name__)

GROQ_KEY = "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"

@app.route("/ia", methods=["POST"])
def ia():

    texto = request.json["text"]

    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [
            {"role": "system", "content": "Você é JunBot, uma IA inteligente e amigável."},
            {"role": "user", "content": texto}
        ]
    }

    r = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=data
    )

    resposta = r.json()["choices"][0]["message"]["content"]

    # imagem IA
    img_url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(texto)

    return jsonify({
        "texto": resposta,
        "imagem": img_url
    })

if __name__ == "__main__":
    app.run(debug=True)
