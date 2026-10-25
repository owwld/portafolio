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

function calcularSueldo() {
    let añosTrabajados = parseInt(document.getElementById("añosTrabajados").value.trim());
    if (isNaN(añosTrabajados)) return alert("Por favor ingresa un número válido de años trabajados.");
    
    const sueldoBase = 40000;
    let porcentajeAumento = 0;

    if (añosTrabajados > 10) {
        porcentajeAumento = 0.10;
    } else if (añosTrabajados > 5) {
        porcentajeAumento = 0.07;
    } else if (añosTrabajados > 3) {
        porcentajeAumento = 0.05;
    } else {
        porcentajeAumento = 0.03;
    }

    let sueldoTotal = sueldoBase + (sueldoBase * porcentajeAumento);

    document.getElementById("resultados").innerHTML = "Sueldo Total: $" + sueldoTotal.toFixed(2);
}

function mostrarImpares() {
    let texto = "1";
    
    for (let i = 3; i <= 100; i += 2) {
        texto += ", " + i;
    }

    document.getElementById("resultados2").innerHTML = "Números impares del 1 al 100: <br><br>" + texto;
}

function mostrarAsteriscos() {
    let cantidad = parseInt(document.getElementById("numAsteriscos").value.trim());
    if (isNaN(cantidad) || cantidad <= 0) return alert("Por favor ingresa un número válido de asteriscos.");

    let texto = "";
    for (let i = 0; i < cantidad; i++) {
        texto += "*";
    }
    document.getElementById("resultados2").innerHTML = "Asteriscos: <br><br>" + texto;

}

function mostrarTablaMultiplicar() {
    let numero = parseInt(document.getElementById("numTabla").value.trim());
    if (isNaN(numero)) return alert("Por favor ingresa un número válido para la tabla de multiplicar.");

    let texto = "";
    for (let i = 1; i <= 10; i++) {
        texto += numero + " x " + i + " = " + (numero * i) + "<br>";
    }
    document.getElementById("resultados2").innerHTML = "Tabla de multiplicar del " + numero + ": <br><br>" + texto;
}

let paises = ["México", "Canadá", "Japón", "Brasil", "Alemania", "Francia", "Italia", "España", "Argentina", "Chile"];

function mostrarArreglo(mensaje) {
    let elem = document.getElementById("resultadosArreglos");
    elem.innerHTML = mensaje + "<br><br>Arreglo actual: [" + paises.join(", ") + "]";
}

function probarPop() {
    let eliminado = paises.pop();
    mostrarArreglo("Pop eliminó: " + eliminado);
}

function probarShift() {
    let eliminado = paises.shift();
    mostrarArreglo("Shift eliminó: " + eliminado);
}

function probarPush() {
    let nuevo = document.getElementById("inputPush").value.trim();
    if (nuevo !== "") {
        paises.push(nuevo);
        mostrarArreglo("Push agregó: " + nuevo);
    } else {
        alert("Ingresa un país");
    }
}

function probarUnshift() {
    let nuevo = document.getElementById("inputUnshift").value.trim();
    if (nuevo !== "") {
        paises.unshift(nuevo);
        mostrarArreglo("Unshift agregó: " + nuevo);
    } else {
        alert("Ingresa un país");
    }
}

function probarSplice() {
    let pos = parseInt(document.getElementById("posSplice").value);
    let cant = parseInt(document.getElementById("cantSplice").value);
    if (!isNaN(pos) && !isNaN(cant)) {
        let borrados = paises.splice(pos, cant);
        mostrarArreglo("Splice eliminó: " + borrados.join(", "));
    } else {
        alert("Ingresa valores válidos");
    }
}

function probarDelete() {
    let pos = parseInt(document.getElementById("posDelete").value);
    if (!isNaN(pos) && pos >= 0 && pos < paises.length) {
        delete paises[pos];
        mostrarArreglo("Delete borró la posición: " + pos);
    } else {
        alert("Ingresa una posición válida");
    }
}

function probarReverse() {
    paises.reverse();
    mostrarArreglo("Arreglo invertido con Reverse");
}

function probarSort() {
    paises.sort();
    mostrarArreglo("Arreglo ordenado con Sort");
}

function probarConcat() {
    let texto = document.getElementById("inputConcat").value.trim();
    if (texto !== "") {
        let nuevos = texto.split(",");
        paises = paises.concat(nuevos);
        mostrarArreglo("Concat agregó: " + nuevos.join(", "));
    } else {
        alert("Ingresa al menos un país");
    }
}

function probarJoin() {
    let sep = document.getElementById("inputJoin").value;
    let unido = paises.join(sep !== "" ? sep : ", ");
    document.getElementById("resultadosArreglos").innerHTML = "Resultado de Join: " + unido;
}

function probarLength() {
    mostrarArreglo("El arreglo tiene " + paises.length + " elementos.");
}

function reiniciarArreglo() {
    paises = ["México", "Canadá", "Japón", "Brasil", "Alemania", "Francia", "Italia", "España", "Argentina", "Chile"];
    mostrarArreglo("Se ha reestablecido el arreglo a su estado original.");
}

// Función para mostrar / ocultar el formulario de ingreso (Sección IV)
function toggleFormulario() {
    let form = document.getElementById("formIngreso");
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}