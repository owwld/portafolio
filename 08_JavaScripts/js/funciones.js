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