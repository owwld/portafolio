/* =====================================================
   NELL - Control de sesión y barra superior por rol
   ===================================================== */

(function () {
  "use strict";

  // Valida la sesión, dibuja la barra superior y devuelve el usuario actual
  function iniciarLayout() {
    var body = document.body;
    var rolRequerido = body.getAttribute("data-rol");
    var menuActivo = body.getAttribute("data-menu") || "";
    var raiz = body.getAttribute("data-raiz") || "";

    var usuario = NELL.obtenerSesion();

    if (!usuario || (rolRequerido && usuario.rol !== rolRequerido)) {
      window.location.href = raiz + "index.html";
      return null;
    }

    var menusPorRol = {
      estudiante: [
        { id: "inicio", texto: "Inicio", href: raiz + "estudiante/inicio.html" },
        { id: "perfil", texto: "Perfil", href: raiz + "estudiante/perfil.html" },
        { id: "historial", texto: "Historial", href: raiz + "estudiante/historial.html" }
      ],
      arrendador: [
        { id: "publicaciones", texto: "Publicaciones", href: raiz + "arrendador/publicaciones.html" },
        { id: "solicitudes", texto: "Solicitudes", href: raiz + "arrendador/solicitudes.html" },
        { id: "contratos", texto: "Contratos", href: raiz + "arrendador/contratos.html" },
        { id: "perfil", texto: "Mi perfil", href: raiz + "arrendador/perfil.html" }
      ],
      admin: [
        { id: "usuarios", texto: "Usuarios", href: raiz + "admin/usuarios.html" }
      ]
    };

    var rutaInicio = {
      estudiante: raiz + "estudiante/inicio.html",
      arrendador: raiz + "arrendador/publicaciones.html",
      admin: raiz + "admin/usuarios.html"
    };

    var rutaPerfil = {
      estudiante: raiz + "estudiante/perfil.html",
      arrendador: raiz + "arrendador/perfil.html",
      admin: raiz + "admin/usuarios.html"
    };

    var enlaces = menusPorRol[usuario.rol] || [];
    var htmlEnlaces = enlaces
      .map(function (item) {
        var clase = item.id === menuActivo ? "activo" : "";
        return (
          '<a href="' +
          item.href +
          '" class="' +
          clase +
          '">' +
          NELL.escaparHTML(item.texto) +
          "</a>"
        );
      })
      .join("");

    var corto = NELL.nombreCorto(usuario);
    var iniciales = NELL.obtenerIniciales(usuario.nombre, usuario.apellido);

    var header = document.getElementById("barraSuperior");
    if (header) {
      header.className = "barra-superior";
      header.innerHTML =
        '<a href="' +
        rutaInicio[usuario.rol] +
        '" class="logo-nell">NELL<span class="punto">.</span></a>' +
        '<nav class="menu-rol">' +
        htmlEnlaces +
        "</nav>" +
        '<div class="usuario-barra">' +
        '<span class="nombre-usuario-barra">' +
        NELL.escaparHTML(corto) +
        "</span>" +
        '<a href="' +
        rutaPerfil[usuario.rol] +
        '" class="avatar-circulo" title="Ir a mi perfil">' +
        NELL.escaparHTML(iniciales) +
        "</a>" +
        '<button type="button" id="btnCerrarSesion" class="btn-salir">Salir</button>' +
        "</div>";

      var btnSalir = document.getElementById("btnCerrarSesion");
      if (btnSalir) {
        btnSalir.addEventListener("click", function () {
          NELL.cerrarSesion();
          window.location.href = raiz + "index.html";
        });
      }
    }

    return usuario;
  }

  window.iniciarLayout = iniciarLayout;
})();