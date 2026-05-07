window.onload = async () => {
  try {
    const res = await fetch("https://junbot-site-1.onrender.com/ia", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: "oi"})
    });

    const data = await res.json();

    document.getElementById("resposta").innerHTML =
      data.texto;

  } catch (e) {
    document.getElementById("resposta").innerHTML =
      "IA offline no momento 😅";
  }
};
