function mostrarRespuestas() {
    let nom = document.getElementById("nombre").value.trim();
    if (!nom) return alert("Por favor ingresa tu nombre.");

    let des = document.getElementById("des").value.trim();
    if (!des) return alert("Por favor ingresa una descripción.");

    let correo = document.getElementById("correo").value.trim();
    if (!correo) return alert("Por favor ingresa tu correo.");
    
    let pass = document.getElementById("password").value.trim();
    if (!pass) return alert("Por favor ingresa tu contraseña.");

    let archivo = document.getElementById("archivo").value;
    if (!archivo) return alert("Por favor selecciona un archivo.");

    let ciudad = document.getElementById("ciudad").value;

    let fem = document.getElementById("fem").checked;
    let mas = document.getElementById("mas").checked;
    let otro = document.getElementById("otro").checked;
    let gen = fem ? "Femenino" : mas ? "Masculino" : otro ? "Otro" : "";
    if (!gen) return alert("Por favor selecciona un género.");

    let leer = document.getElementById("leer").checked;
    let nadar = document.getElementById("nadar").checked;
    let jugar = document.getElementById("jugar").checked;
    let pasatiempo = (leer ? "Leer " : "") + (nadar ? "Nadar " : "") + (jugar ? "Jugar " : "");
    if (!pasatiempo) return alert("Por favor selecciona al menos un pasatiempo.");

    document.getElementById("resultadoEncuesta").innerHTML = 
        "Nombre: " + nom + "<br>" + "Descripción: " + des + "<br>" + "Correo: " + correo + "<br>" +
        "Password: " + pass + "<br>" + "Género: " + gen + "<br>" + "Pasatiempos: " + pasatiempo + "<br>" +
        "Archivo: " + archivo + "<br>" + "Ciudad: " + ciudad;
}