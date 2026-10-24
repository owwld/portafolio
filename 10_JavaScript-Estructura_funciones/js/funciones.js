function mostrarRespuestas1(){
    let nom = document.getElementById("nombre").value.trim();
    if(!nom) return alert("Por favor ingresa tu nombre.");

    let ciudad = document.getElementById("ciudad").value;
    if(!ciudad) return alert("Por favor selecciona una ciudad.");

    let ubi = document.querySelector('input[name="ubi"]:checked');
    if(!ubi) return alert("Por favor selecciona una opción de ubicación.");

    document.getElementById("resultadoEncuesta").innerHTML = 
        "Nombre: " + nom + "<br>" + "Ciudad: " + ciudad + "<br>" + "Ubicación: " + ubi.value;    
}

//variable global para acumular los resultados de la suma
let acumulator = 0;
function sumarNumeros() {
    let num1 = parseInt(document.getElementById("numS").value.trim());
    if(isNaN(num1)) return alert("Por favor ingresa un número valido.");

    if(num1 > 0){
    acumulator += num1;
    document.getElementById("resultados").innerHTML = "Resultado acumulado: " + acumulator;
    } else {
        document.getElementById("resultados").innerHTML = "Resultado acumulado total: " + acumulator;
        acumulator = 0; // Reinicia el acumulador después de mostrar el resultado final
        return alert("Por favor ingresa un número positivo para acumular la suma.");

    }
}

function compararNumeros(){
    let num1 = parseInt(document.getElementById("num1").value.trim());
    let num2 = parseInt(document.getElementById("num2").value.trim());
    let num3 = parseInt(document.getElementById("num3").value.trim());

    if(isNaN(num1) || isNaN(num2) || isNaN(num3)) return alert("Por favor ingresa números válidos.");

    if(num1 >= num2 && num1 >= num3){
        document.getElementById("resultados").innerHTML = "El número mayor es: " + num1;
    }else if(num2 >= num1 && num2 >= num3){
        document.getElementById("resultados").innerHTML = "El número mayor es: " + num2;
    }else{
        document.getElementById("resultados").innerHTML = "El número mayor es: " + num3;
    } 
}

function calcularImporteNeto() {
    let importeBruto = parseFloat(document.getElementById("importeBruto").value.trim());
    if (isNaN(importeBruto)) return alert("Por favor ingresa un importe bruto válido.");

    let impuesto = (importeBruto > 15000) ? 0.16 : 0.10;
    let importeNeto = importeBruto - (importeBruto * impuesto);

    document.getElementById("resultados").innerHTML = "Importe Neto: $" + importeNeto.toFixed(2);
}

