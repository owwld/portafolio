function mostrarDatos(){
    // Comentarios completos
    var letra = document.getElementById("letra").value;
    var num1 = document.getElementById("n1").value;
    var num2 = document.getElementById("n2").value; 

    numInt = parseInt(num2); 
    numFloat = parseFloat(num1);

    var tipoNumero = "";
    if (numInt % 2 == 0) {
        tipoNumero = "Par";
    } else {
        tipoNumero = "Impar";
    }

    datos = 'Carcter: ' + letra + '<br> Cadena: ' + num1 + '<br> Entero: ' + numInt + '<br> Flotante: ' + numFloat + '<br> Concatenacion: ' + (letra + "_" + num1) + '<br> El numero ' + numInt + ' es: ' + tipoNumero;
    
    document.getElementById("resultados").innerHTML = datos;
}

function mostrarFactorial(){
    var num3 = document.getElementById("n3").value;
    var numF = parseInt(num3); 

    var factorial = 1;
    for (var i = 1; i <= numF; i++) {
        factorial = factorial * i;
    }

    datosFactorial = 'El factorial de ' + numF + ' es: ' + factorial;
    document.getElementById("resultados").innerHTML = datosFactorial;
}

function mostrarRespuestas() {
    var res1 = document.querySelector('input[name="p1"]:checked');
    var res2 = document.querySelector('input[name="p2"]:checked');
    var res3 = document.querySelector('input[name="p3"]:checked');

    if (!res1 || !res2 || !res3) {
        document.getElementById("resultadoEncuesta").innerHTML = "<p>Por favor, responde todas las preguntas antes de enviar.</p>";
        return;
    }

    var salida = '<br>' +'1.- ¿Javascript es fácil de aprender?<br>' +'Respuesta: ' + res1.value.toLowerCase() + '<br><br>' +'2.- ¿Los getElements son sencillos de implementar?<br>' +'Respuesta: ' + res2.value.toLowerCase() + '<br><br>' +
    '3.- ¿Ya puedo desarrollar páginas profesionales con JS?<br>'+'Respuesta: ' + res3.value.toLowerCase();

    document.getElementById("resultadoEncuesta").innerHTML = salida;
}