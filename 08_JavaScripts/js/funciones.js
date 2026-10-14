function mostrarDatos(){
    //
    /** comentarios completos */

    var letra = document.getElementById("letra").value;
    var num1 = document.getElementById("n1").value;

    numInt = parseInt(num1);
    numFloat = parseFloat(num1);
 
    datos = 'Carcter' + letra +'<br> Cadena: ' + num1 + '<br> Entero: ' +numInt+ '<br> Flotante: ' +numFloat+'Concatenacion'+(letra +"_"+num1);
    document.getElementById("resultados").innerHTML=datos;
}