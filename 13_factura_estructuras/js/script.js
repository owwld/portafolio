// Variable global para la acumulación del HTML
let Conceptos = '';

// Event Listener para el botón Generar
document.getElementById('generar').addEventListener('click', function() {
    generarConceptos();
});

// Event Listener para el botón Agregar Concepto (si existe en tu HTML)
let botonAgregar = document.getElementById('agregar');
if (botonAgregar) {
    botonAgregar.addEventListener('click', function() {
        agregarUnConcepto();
    });
}

// Generar Conceptos
let generarConceptos = function() {
    let num = parseInt(document.getElementById('n-conceptos').value, 10);
    Conceptos = ''; // Reiniciamos el acumulador para que no repita conceptos anteriores

    if (num > 0) {
        for (let i = 0; i < num; i++) {
            Conceptos += '<div id="Concepto' + i + '" class="fila-concepto">';
            Conceptos += estructurarConcepto(i);
            Conceptos += '</div>';
        }

        document.getElementById('titulo-conceptos').classList.add('quitar-titulo-conceptos');
        document.getElementById('conceptos').innerHTML = Conceptos;
        
        if (document.getElementById('agregar')) {
            document.getElementById('agregar').classList.add('mostrar-agregar');
        }

        calculosRestantes();
    } else {
        alert("Por favor ingresa un número mayor a 0.");
    }
};

// Estructura del concepto mediante template
function estructurarConcepto(num) {
    return `
        <label class="borrar">
            <img src="iconos/borrar.png" onclick="eliminarConcepto('Concepto${num}')" style="cursor:pointer;" alt="Borrar"></img>
        </label>
        <label>Cantidad :
            <input type="number" name="cantidad" id="cantidad${num}" value="1" min="1" oninput="calcularImporte(${num})"></input>
        </label>
        <label>Descripcion: 
            <input type="text" id="descripcion${num}" placeholder="descripcion"></input>
        </label>
        <label>Valor unitario: 
            <input type="number" id="valorUnitario${num}" value="0.00" step="0.01" min="0" oninput="calcularImporte(${num})"></input>
        </label>
        <label>Importe: 
            <input type="number" id="importe${num}" class="input-importe" value="0.00" step="0.01" readonly></input>
        </label>    
    `;
}

// Agregar un concepto de forma individual
let agregarUnConcepto = function() {
    let contenedor = document.getElementById('conceptos');
    let nuevoIndex = Date.now(); // Genera un ID único para evitar colisiones al eliminar/agregar

    let divFila = document.createElement('div');
    divFila.id = 'Concepto' + nuevoIndex;
    divFila.className = 'fila-concepto';
    divFila.innerHTML = estructurarConcepto(nuevoIndex);

    contenedor.appendChild(divFila);
    calculosRestantes();
};

// Calcular importes por renglón
let calcularImporte = function(x) {
    let cant = parseFloat(document.getElementById('cantidad' + x).value) || 0;
    let precio = parseFloat(document.getElementById('valorUnitario' + x).value) || 0;

    let importe = cant * precio;
    document.getElementById('importe' + x).value = importe.toFixed(2);

    calculosRestantes();
};

// Eliminar un renglón de concepto
let eliminarConcepto = function(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.remove();
        calculosRestantes();
    }

    let contenedor = document.getElementById('conceptos');
    // Si se borran todas las filas, regresa al estado inicial
    if (contenedor.children.length === 0) {
        document.getElementById('titulo-conceptos').classList.remove('quitar-titulo-conceptos');
        if (document.getElementById('agregar')) {
            document.getElementById('agregar').classList.remove('mostrar-agregar');
        }
        document.getElementById('n-conceptos').value = 0;
    }
};

// Cálculos del Subtotal, IVA y Total
let calculosRestantes = function() {
    let importes = document.querySelectorAll('.input-importe');
    let subtotal = 0;

    importes.forEach(function(input) {
        subtotal += parseFloat(input.value) || 0;
    });

    let iva = subtotal * 0.16;
    let total = subtotal + iva;

    document.getElementById('subTotal').innerHTML = subtotal.toFixed(2);
    document.getElementById('iva').innerHTML = iva.toFixed(2);
    document.getElementById('total').innerHTML = total.toFixed(2);
};