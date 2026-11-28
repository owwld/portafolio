/* =====================================================
   NELL (Nest Living León) - Almacenamiento y Utilidades
   ===================================================== */

(function () {
  "use strict";

  // Claves de localStorage
  var CLAVES = {
    usuarios: "nell_usuarios",
    publicaciones: "nell_publicaciones",
    resenas: "nell_resenas",
    solicitudes: "nell_solicitudes",
    contratos: "nell_contratos",
    mensajes: "nell_mensajes",
    reportes: "nell_reportes",
    sesion: "nell_sesion",
    registroArrendadorTemp: "nell_registro_arrendador_temp"
  };

  // Crea un controlador genérico para cada tabla en localStorage
  function crearTabla(clave) {
    function leer() {
      try {
        var dato = localStorage.getItem(clave);
        return dato ? JSON.parse(dato) : [];
      } catch (e) {
        return [];
      }
    }

    function guardar(lista) {
      localStorage.setItem(clave, JSON.stringify(lista));
    }

    return {
      todos: function () {
        return leer();
      },
      buscar: function (id) {
        var lista = leer();
        for (var i = 0; i < lista.length; i++) {
          if (String(lista[i].id) === String(id)) {
            return lista[i];
          }
        }
        return null;
      },
      filtrar: function (fn) {
        return leer().filter(fn);
      },
      agregar: function (obj) {
        var lista = leer();
        var nuevo = Object.assign({}, obj);
        if (!nuevo.id) {
          nuevo.id = "id_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
        }
        lista.push(nuevo);
        guardar(lista);
        return nuevo;
      },
      actualizar: function (id, cambios) {
        var lista = leer();
        var actualizado = null;
        for (var i = 0; i < lista.length; i++) {
          if (String(lista[i].id) === String(id)) {
            lista[i] = Object.assign({}, lista[i], cambios);
            actualizado = lista[i];
            break;
          }
        }
        guardar(lista);
        return actualizado;
      },
      eliminar: function (id) {
        var lista = leer().filter(function (item) {
          return String(item.id) !== String(id);
        });
        guardar(lista);
      },
      eliminarDonde: function (fn) {
        var lista = leer().filter(function (item) {
          return !fn(item);
        });
        guardar(lista);
      }
    };
  }

  // Instancias de las tablas
  var tablas = {
    usuarios: crearTabla(CLAVES.usuarios),
    publicaciones: crearTabla(CLAVES.publicaciones),
    resenas: crearTabla(CLAVES.resenas),
    solicitudes: crearTabla(CLAVES.solicitudes),
    contratos: crearTabla(CLAVES.contratos),
    mensajes: crearTabla(CLAVES.mensajes),
    reportes: crearTabla(CLAVES.reportes)
  };

  // Escapa texto de usuario antes de usar innerHTML
  function escaparHTML(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Formato de moneda ($10,000)
  function formatoDinero(cantidad) {
    var num = Number(cantidad) || 0;
    return "$" + Math.round(num).toLocaleString("en-US");
  }

  // Fecha actual en formato ISO (YYYY-MM-DD)
  function fechaHoyISO() {
    var hoy = new Date();
    var y = hoy.getFullYear();
    var m = String(hoy.getMonth() + 1).padStart(2, "0");
    var d = String(hoy.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  // Convierte YYYY-MM-DD a dd/mm/aaaa
  function formatearFecha(fecha) {
    if (!fecha) return "";
    if (fecha.indexOf("/") !== -1) return fecha;
    var partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  // Suma N meses a una fecha YYYY-MM-DD y devuelve YYYY-MM-DD
  function sumarMeses(fechaISO, meses) {
    var partes = (fechaISO || fechaHoyISO()).split("-");
    var anio = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1;
    var dia = parseInt(partes[2], 10);
    var fecha = new Date(anio, mes + Number(meses || 0), dia);
    var y = fecha.getFullYear();
    var m = String(fecha.getMonth() + 1).padStart(2, "0");
    var d = String(fecha.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  // Iniciales (ej. "Carlos", "Mendoza" -> "CM")
  function obtenerIniciales(nombre, apellido) {
    var n = (nombre || "").trim();
    var a = (apellido || "").trim();
    if (!a && n.indexOf(" ") !== -1) {
      var partes = n.split(/\s+/);
      n = partes[0];
      a = partes[1];
    }
    var i1 = n ? n.charAt(0).toUpperCase() : "U";
    var i2 = a ? a.charAt(0).toUpperCase() : "";
    return i1 + i2;
  }

  // Primer nombre + primer apellido
  function nombreCorto(usuario) {
    if (!usuario) return "Usuario";
    var pNombre = (usuario.nombre || "").trim().split(/\s+/)[0] || "";
    var pApellido = (usuario.apellido || "").trim().split(/\s+/)[0] || "";
    return (pNombre + " " + pApellido).trim() || "Usuario";
  }

  // Nombre completo
  function nombreCompleto(usuario) {
    if (!usuario) return "Usuario";
    return ((usuario.nombre || "") + " " + (usuario.apellido || "")).trim();
  }

  // Extrae colonia de una dirección y la devuelve como "Col. X"
  function extraerColonia(direccion) {
    if (!direccion) return "Col. Centro";
    var texto = String(direccion).trim();
    var coincidencia = texto.match(/(?:colonia|col\.?)\s+([^,]+)/i);
    if (coincidencia && coincidencia[1]) {
      return "Col. " + coincidencia[1].trim();
    }
    var partes = texto.split(",");
    var ultimo = partes[partes.length - 1].trim().replace(/^col\.?\s*/i, "");
    return "Col. " + (ultimo || "Centro");
  }

  // Clase CSS según estado
  function claseEstado(estado) {
    var e = (estado || "").toLowerCase();
    if (e === "activo" || e === "aprobado" || e === "aprobada" || e === "publicada") {
      return "estado-verde";
    }
    if (e === "rechazado" || e === "rechazada") {
      return "estado-rojo";
    }
    return "estado-ambar";
  }

  // Degradado de color para viviendas sin fotografías
  function degradadoPorDefecto(indice) {
    var paleta = [
      "linear-gradient(135deg, #2d5c53 0%, #4ec9a2 100%)",
      "linear-gradient(135deg, #2b3a4a 0%, #4a7c82 100%)",
      "linear-gradient(135deg, #3a4a3f 0%, #6da88b 100%)",
      "linear-gradient(135deg, #353f4f 0%, #598392 100%)",
      "linear-gradient(135deg, #2b4c47 0%, #3a9a78 100%)",
      "linear-gradient(135deg, #3e4c59 0%, #52796f 100%)"
    ];
    var num = 0;
    var str = String(indice || 0);
    for (var i = 0; i < str.length; i++) {
      num += str.charCodeAt(i);
    }
    return paleta[num % paleta.length];
  }

  // Reduce una imagen con canvas a ~700px y JPEG 0.7
  function reducirImagenCanvas(archivo, callback) {
    var lector = new FileReader();
    lector.onload = function (evento) {
      var img = new Image();
      img.onload = function () {
        var max = 700;
        var ancho = img.width;
        var alto = img.height;

        if (ancho > max || alto > max) {
          if (ancho > alto) {
            alto = Math.round((alto * max) / ancho);
            ancho = max;
          } else {
            ancho = Math.round((ancho * max) / alto);
            alto = max;
          }
        }

        var canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, ancho, alto);
        callback(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = evento.target.result;
    };
    lector.readAsDataURL(archivo);
  }

  // Obtener parámetro de query string (?id=...)
  function obtenerParametro(nombre) {
    var params = new URLSearchParams(window.location.search);
    return params.get(nombre);
  }

  // Identificador único de conversación entre dos IDs ordenados
  function idConversacion(idA, idB) {
    return [String(idA), String(idB)].sort().join("__");
  }

  // Carga los usuarios y datos de prueba
  function cargarDatosDePrueba(forzar) {
    var existentes = localStorage.getItem(CLAVES.usuarios);
    if (!forzar && existentes && JSON.parse(existentes).length > 0) {
      return;
    }

    var usuarios = [
      {
        id: "u_est_1",
        rol: "estudiante",
        nombre: "Carlos",
        apellido: "Mendoza",
        correo: "carlos.mendoza@mail.com",
        telefono: "477 123 4567",
        ciudad: "León, Guanajuato",
        universidad: "UTL",
        miembroDesde: "Enero 2022",
        contrasena: "123456",
        notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
      },
      {
        id: "u_est_2",
        rol: "estudiante",
        nombre: "Andres",
        apellido: "Guardado",
        correo: "andres.guardado@mail.com",
        telefono: "477 123 4667",
        ciudad: "León, Guanajuato",
        universidad: "UTL",
        miembroDesde: "Enero 2022",
        contrasena: "123456",
        notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
      },
      {
        id: "u_arr_1",
        rol: "arrendador",
        nombre: "Miguel Eduardo",
        apellido: "Carpio Lopez",
        correo: "miguecarp21@gmail.com",
        telefono: "477 676 6969",
        ciudad: "León, Guanajuato",
        genero: "Hombre",
        rfc: "CALM900315ABC",
        cuentaBancaria: "012345678901234567",
        foto: "",
        miembroDesde: "Marzo 2021",
        contrasena: "123456",
        notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
      },
      {
        id: "u_adm_1",
        rol: "admin",
        nombre: "Admin",
        apellido: "NELL",
        correo: "admin@nell.com",
        telefono: "477 000 0000",
        ciudad: "León, Guanajuato",
        miembroDesde: "Enero 2021",
        contrasena: "admin123",
        notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
      }
    ];

    var publicaciones = [
      {
        id: "pub_1",
        arrendadorId: "u_arr_1",
        titulo: "Casa moderna privada",
        precio: 10000,
        deposito: 4500,
        tipo: "Casa",
        universidad: "Universidad Tecnologica de Leon (UTL)",
        direccion: "Blvd. Gran Jardin 120, Col. Gran Jardin",
        colonia: "Col. Gran Jardin",
        habitaciones: 5,
        descripcion: "Amplia casa en zona exclusiva de León a 10 minutos de la universidad de Leon UTL, 5 cuartos individuales, cocina equipada y 2 cajones de estacionamiento, ideal para un grupo grande de universitarios",
        amenidades: ["WiFi", "parking", "Mascotas", "A/C", "Amueblado"],
        fotos: [],
        estado: "Publicada"
      },
      {
        id: "pub_2",
        arrendadorId: "u_arr_1",
        titulo: "Departamento zona UIA",
        precio: 4500,
        deposito: 2250,
        tipo: "Departamento",
        universidad: "UIA",
        direccion: "Av. Universidad 310, Col. Las joyas",
        colonia: "Col. Las joyas",
        habitaciones: 2,
        descripcion: "Departamento cómodo y funcional cerca de UIA, ideal para estudiantes que buscan tranquilidad y buena conexión de transporte.",
        amenidades: ["WiFi", "parking", "Terraza"],
        fotos: [],
        estado: "Publicada"
      },
      {
        id: "pub_3",
        arrendadorId: "u_arr_1",
        titulo: "Departamento en 3er piso",
        precio: 12000,
        deposito: 6500,
        tipo: "Departamento",
        universidad: "UTL",
        direccion: "Paseo del Molino 405, Col. El molino residencial",
        colonia: "Col. El molino residencial",
        habitaciones: 3,
        descripcion: "Departamento amplio en tercer piso dentro de zona residencial segura, ambiente exclusivo para mujeres estudiantes.",
        amenidades: ["WiFi", "parking", "Solo mujer", "A/C", "Amueblado"],
        fotos: [],
        estado: "Publicada"
      },
      {
        id: "pub_4",
        arrendadorId: "u_arr_1",
        titulo: "Casa",
        precio: 5450,
        deposito: 2700,
        tipo: "Casa",
        universidad: "UG",
        direccion: "Calle Chiapas 214, Col. Chapalita",
        colonia: "Col. Chapalita",
        habitaciones: 3,
        descripcion: "Casa amueblada en colonia céntrica con terraza y espacio para mascotas, a pocos minutos de campus UG.",
        amenidades: ["WiFi", "parking", "Mascotas", "Terraza", "Amueblado"],
        fotos: [],
        estado: "Publicada"
      },
      {
        id: "pub_5",
        arrendadorId: "u_arr_1",
        titulo: "Depa octavo piso",
        precio: 15000,
        deposito: 7500,
        tipo: "Departamento",
        universidad: "UTL",
        direccion: "Torre Molino 802, Col. El molino residencial",
        colonia: "Col. El molino residencial",
        habitaciones: 3,
        descripcion: "Departamento en octavo piso con terraza panorámica, aire acondicionado y mobiliario moderno.",
        amenidades: ["WiFi", "parking", "Terraza", "A/C", "Amueblado"],
        fotos: [],
        estado: "Publicada"
      },
      {
        id: "pub_6",
        arrendadorId: "u_arr_1",
        titulo: "Casa centrica mediterranea",
        precio: 8500,
        deposito: 4250,
        tipo: "Casa",
        universidad: "UG",
        direccion: "Calle Madero 512, Col. Centro",
        colonia: "Col. Centro",
        habitaciones: 4,
        descripcion: "Casa estilo mediterráneo en zona centro de León, cercana a sedes universitarias, comercios y transporte.",
        amenidades: ["WiFi", "Terraza", "Mascotas", "A/C", "Amueblado"],
        fotos: [],
        estado: "Publicada"
      }
    ];

    var resenas = [
      {
        id: "res_1",
        publicacionId: "pub_1",
        autorId: "ext_jorge",
        autorNombre: "Jorge Ramos",
        estrellas: 4,
        mensaje: "La casa tiene un diseño moderno increíble, mucha luz natural y la seguridad de la zona privada te da total tranquilidad. El único detalle es que el acceso para visitas es un poco tardado por los filtros de vigilancia, pero fuera de eso, excelente.",
        fecha: "2026-09-15"
      },
      {
        id: "res_2",
        publicacionId: "pub_1",
        autorId: "ext_fernanda",
        autorNombre: "Fernanda Rangel",
        estrellas: 3,
        mensaje: "Visualmente la casa es hermosa y la privada es muy segura y silenciosa. Sin embargo, los espacios interiores son algo reducidos para el precio y tuvimos un par de detalles con la presión del agua en el segundo piso",
        fecha: "2026-10-02"
      }
    ];

    var solicitudes = [
      {
        id: "sol_1",
        publicacionId: "pub_1",
        viviendaTitulo: "Casa moderna privada",
        colonia: "Col. Gran Jardin",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "ext_ana_garcia",
        estudianteNombre: "Ana Garcia",
        estudianteCorreo: "ana.garcia@mail.com",
        estudianteTelefono: "477 210 1101",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-12-01",
        duracion: 12,
        renta: 10000,
        deposito: 4500,
        mensaje: "Hola, me interesa rentar la casa para el próximo cuatrimestre.",
        estado: "Pendiente",
        contratoId: ""
      },
      {
        id: "sol_2",
        publicacionId: "pub_1",
        viviendaTitulo: "Casa moderna privada",
        colonia: "Col. Gran Jardin",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "ext_juan_macias",
        estudianteNombre: "Juan Macias",
        estudianteCorreo: "juan.macias@mail.com",
        estudianteTelefono: "477 210 1102",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-12-01",
        duracion: 12,
        renta: 10000,
        deposito: 4500,
        mensaje: "Somos compañeros de la UTL y buscamos casa cerca.",
        estado: "Pendiente",
        contratoId: ""
      },
      {
        id: "sol_3",
        publicacionId: "pub_1",
        viviendaTitulo: "Casa moderna privada",
        colonia: "Col. Gran Jardin",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "ext_pedro_cortez",
        estudianteNombre: "Pedro Cortez",
        estudianteCorreo: "pedro.cortez@mail.com",
        estudianteTelefono: "477 210 1103",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-12-05",
        duracion: 6,
        renta: 10000,
        deposito: 4500,
        mensaje: "Me gustaría conocer la propiedad esta semana.",
        estado: "Pendiente",
        contratoId: ""
      },
      {
        id: "sol_4",
        publicacionId: "pub_1",
        viviendaTitulo: "Casa moderna privada",
        colonia: "Col. Gran Jardin",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "ext_miguel_papo",
        estudianteNombre: "Miguel Papo",
        estudianteCorreo: "miguel.papo@mail.com",
        estudianteTelefono: "477 210 1104",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-12-10",
        duracion: 12,
        renta: 10000,
        deposito: 4500,
        mensaje: "Tengo disponibilidad inmediata para firmar contrato.",
        estado: "Pendiente",
        contratoId: ""
      },
      {
        id: "sol_5",
        publicacionId: "pub_6",
        viviendaTitulo: "Casa centrica mediterranea",
        colonia: "Col. Centro",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "ext_pedro_cortez",
        estudianteNombre: "Pedro Cortez",
        estudianteCorreo: "pedro.cortez@mail.com",
        estudianteTelefono: "477 210 1103",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-11-01",
        duracion: 12,
        renta: 8500,
        deposito: 4250,
        mensaje: "Solicito información para renta anual.",
        estado: "Rechazada",
        contratoId: ""
      },
      {
        id: "sol_6",
        publicacionId: "pub_6",
        viviendaTitulo: "Casa centrica mediterranea",
        colonia: "Col. Centro",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        estudianteId: "u_est_2",
        estudianteNombre: "Andres Guardado",
        estudianteCorreo: "andres.guardado@mail.com",
        estudianteTelefono: "477 123 4667",
        estudianteCiudad: "León, Guanajuato",
        estudianteUniversidad: "UTL",
        estudianteMiembroDesde: "Enero 2022",
        fechaInicio: "2026-11-15",
        duracion: 12,
        renta: 8500,
        deposito: 4250,
        mensaje: "Me interesa mucho la ubicación céntrica para mis estudios.",
        estado: "Aprobada",
        contratoId: "con_6"
      }
    ];

    var contratos = [
      {
        id: "con_1",
        publicacionId: "pub_1",
        viviendaTitulo: "Casa moderna privada",
        colonia: "Col. Gran jardin",
        estudianteId: "u_est_1",
        estudianteNombre: "Carlos Mendoza",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4567",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 676 6969",
        fechaInicio: "2026-08-01",
        fechaFin: "2027-08-01",
        duracion: 12,
        renta: 10000,
        deposito: 4500,
        estado: "Activo",
        archivoContrato: ""
      },
      {
        id: "con_2",
        publicacionId: "pub_3",
        viviendaTitulo: "Departamento en 3er piso",
        colonia: "Col. El molino residencial",
        estudianteId: "u_est_2",
        estudianteNombre: "Andres Guardado",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4667",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 676 6969",
        fechaInicio: "2024-12-12",
        fechaFin: "2025-12-07",
        duracion: 12,
        renta: 12000,
        deposito: 6500,
        estado: "Finalizado",
        archivoContrato: ""
      },
      {
        id: "con_3",
        publicacionId: "pub_ext_1",
        viviendaTitulo: "Privada del Río",
        colonia: "Col. Echeveste",
        estudianteId: "ext_amanda",
        estudianteNombre: "Amanda Diaz",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 555 0199",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 676 6969",
        fechaInicio: "2024-07-12",
        fechaFin: "2025-07-12",
        duracion: 12,
        renta: 6000,
        deposito: 3000,
        estado: "Rechazado",
        archivoContrato: ""
      },
      {
        id: "con_4",
        publicacionId: "pub_3",
        viviendaTitulo: "Departamento en 3er piso",
        colonia: "Col. El molino residencial",
        estudianteId: "u_est_1",
        estudianteNombre: "Carlos Mendoza",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4567",
        arrendadorId: "ext_jose_lopez",
        arrendadorNombre: "Jose Lopez",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 333 2211",
        fechaInicio: "2024-06-01",
        fechaFin: "2025-06-01",
        duracion: 12,
        renta: 12000,
        deposito: 6500,
        estado: "Finalizado",
        archivoContrato: ""
      },
      {
        id: "con_5",
        publicacionId: "pub_ext_1",
        viviendaTitulo: "Privada del Río",
        colonia: "Col. Echeveste",
        estudianteId: "u_est_1",
        estudianteNombre: "Carlos Mendoza",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4567",
        arrendadorId: "ext_amanda_diaz",
        arrendadorNombre: "Amanda Diaz",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 555 0199",
        fechaInicio: "2024-07-12",
        fechaFin: "2025-07-12",
        duracion: 12,
        renta: 6000,
        deposito: 3000,
        estado: "Rechazado",
        archivoContrato: ""
      },
      {
        id: "con_6",
        publicacionId: "pub_6",
        viviendaTitulo: "Casa centrica mediterranea",
        colonia: "Col. Centro",
        estudianteId: "u_est_2",
        estudianteNombre: "Andres Guardado",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4667",
        arrendadorId: "u_arr_1",
        arrendadorNombre: "Miguel Carpio",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 676 6969",
        fechaInicio: "2026-11-15",
        fechaFin: "2027-11-15",
        duracion: 12,
        renta: 8500,
        deposito: 4250,
        estado: "Activo",
        archivoContrato: ""
      },
      {
        id: "con_7",
        publicacionId: "pub_ext_2",
        viviendaTitulo: "Casa compartida UG",
        colonia: "Col. Centro",
        estudianteId: "u_est_2",
        estudianteNombre: "Andres Guardado",
        estudianteCiudad: "León, Guanajuato",
        estudianteTelefono: "477 123 4667",
        arrendadorId: "ext_roberto_salas",
        arrendadorNombre: "Roberto Salas",
        arrendadorCiudad: "León, Guanajuato",
        arrendadorTelefono: "477 444 8899",
        fechaInicio: "2024-01-15",
        fechaFin: "2024-12-15",
        duracion: 11,
        renta: 5000,
        deposito: 2500,
        estado: "Finalizado con problemas",
        archivoContrato: ""
      }
    ];

    var convCarlosMiguel = idConversacion("u_est_1", "u_arr_1");
    var mensajes = [
      {
        id: "msg_1",
        conversacionId: convCarlosMiguel,
        remitenteId: "u_est_1",
        remitenteNombre: "Carlos Mendoza",
        remitenteRol: "estudiante",
        texto: "Buenos dias, me gustaria saber si la casa cuenta con establecimientos donde pueda surtir mi despensa de manera cercana",
        fecha: "2026-11-20 10:15"
      },
      {
        id: "msg_2",
        conversacionId: convCarlosMiguel,
        remitenteId: "u_arr_1",
        remitenteNombre: "Miguel Carpio",
        remitenteRol: "arrendador",
        texto: "Buenos dias, cuenta con Walmart, Soriana entre otras tiendas tambien cercanas, ademas tiene cerca una lavanderia",
        fecha: "2026-11-20 10:22"
      },
      {
        id: "msg_3",
        conversacionId: convCarlosMiguel,
        remitenteId: "u_arr_1",
        remitenteNombre: "Miguel Carpio",
        remitenteRol: "arrendador",
        texto: "Con gusto puedo agendarle una cita para visitar la casa si gusta",
        fecha: "2026-11-20 10:23"
      },
      {
        id: "msg_4",
        conversacionId: convCarlosMiguel,
        remitenteId: "u_arr_1",
        remitenteNombre: "Miguel Carpio",
        remitenteRol: "arrendador",
        texto: "quedo atento a su respuesta",
        fecha: "2026-11-20 10:23"
      }
    ];

    localStorage.setItem(CLAVES.usuarios, JSON.stringify(usuarios));
    localStorage.setItem(CLAVES.publicaciones, JSON.stringify(publicaciones));
    localStorage.setItem(CLAVES.resenas, JSON.stringify(resenas));
    localStorage.setItem(CLAVES.solicitudes, JSON.stringify(solicitudes));
    localStorage.setItem(CLAVES.contratos, JSON.stringify(contratos));
    localStorage.setItem(CLAVES.mensajes, JSON.stringify(mensajes));
    if (!localStorage.getItem(CLAVES.reportes) || forzar) {
      localStorage.setItem(CLAVES.reportes, JSON.stringify([]));
    }
  }

  // Gestión de sesión activa
  function obtenerSesion() {
    var id = localStorage.getItem(CLAVES.sesion);
    if (!id) return null;
    return tablas.usuarios.buscar(id);
  }

  function iniciarSesion(usuarioId) {
    localStorage.setItem(CLAVES.sesion, String(usuarioId));
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVES.sesion);
  }

  // Inicializar datos al cargar el script
  cargarDatosDePrueba(false);

  // Exponer API global
  window.NELL = {
    CLAVES: CLAVES,
    tablas: tablas,
    escaparHTML: escaparHTML,
    formatoDinero: formatoDinero,
    fechaHoyISO: fechaHoyISO,
    formatearFecha: formatearFecha,
    sumarMeses: sumarMeses,
    obtenerIniciales: obtenerIniciales,
    nombreCorto: nombreCorto,
    nombreCompleto: nombreCompleto,
    extraerColonia: extraerColonia,
    claseEstado: claseEstado,
    degradadoPorDefecto: degradadoPorDefecto,
    reducirImagenCanvas: reducirImagenCanvas,
    obtenerParametro: obtenerParametro,
    idConversacion: idConversacion,
    cargarDatosDePrueba: cargarDatosDePrueba,
    obtenerSesion: obtenerSesion,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion
  };
})();