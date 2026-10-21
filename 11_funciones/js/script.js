//Funciones--------------------------------------------------------------------------
/*
let nombre="chapoy";
let estatura=1.65;
let peso=57;
let casada = true;
let genero = 'f';
let vehiculo = null;
let edad = undefined;
 
alert(nombre + ' ' + estatura + ' ' + peso + ' ' + casada + ' ' + genero + ' ' + vehiculo + 
    ' ' + estatura + ' ' + edad);

console.log(typeof nombre); 
console.log(typeof estatura);
console.log(typeof peso);
console.log(typeof casada);
console.log(typeof genero);
console.log(typeof vehiculo);
console.log(typeof estatura);
console.log(typeof edad);

*/

//FUNCIONES EN JAVIERSCRIPT 

let seccion = document.getElementById("resultados")
function votar(){
    let edad = 122;
    let miVoto = edad >=18 ? "puede votar" : "no puede votar";
    seccion.innerHTML = seccion.innerHTML + miVoto;
    
}

votar();

//funciones anonimas, sin nombre y se ejecutan en una variable 
let producto = function(a,b){
    return a * b;
}
let res = producto(3,6);
seccion.innerHTML += '<br>'+ res;

//constructor

miFuncion = new Function("a", "b", "e", "return (a*b) + c;");
let res2 = miFuncion(5,7,3);
seccion.innerHTML += '<br>' +res2;

//anonimas autoinvocadas, funciones que se ejecutan de manera automatica

(function(){
    seccion.innerHTML += '<br> soy una funcion anonima';

}) ();

(function(a=3, b=5 ){
    seccion.innerHTML += '<br> suma = '+ (a+b);
})();