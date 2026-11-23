// =========================================================================
// js/serpientes.js - Archivo encargado de buscar serpientes en internet,
// mostrar su informacion completa y guardar las favoritas de cada usuario
// =========================================================================

const API_URL = 'https://api.inaturalist.org/v1/taxa';
const TAXON_SERPIENTES = 85553;
const POR_PAGINA = 12;

let paginaActual = 1;
let busquedaActual = '';
let totalResultados = 0;
let especiesEnPantalla = [];
let serpienteModalActualId = null;

const FAMILIAS_VENENOSAS = ['Elapidae', 'Viperidae', 'Atractaspididae', 'Hydrophiidae'];

const MAPA_IDS_FAMILIAS = {
    85554: 'Colubridae',
    85555: 'Viperidae',
    85556: 'Elapidae',
    85557: 'Boidae',
    32145: 'Pythonidae',
    85558: 'Typhlopidae',
    85559: 'Leptotyphlopidae',
    130992: 'Lamprophiidae',
    130991: 'Homalopsidae',
    130990: 'Xenopeltidae'
};

const MAPA_GENERO_FAMILIA = {
    'Python': 'Pythonidae', 'Malayopython': 'Pythonidae', 'Morelia': 'Pythonidae',
    'Antaresia': 'Pythonidae', 'Liasis': 'Pythonidae', 'Aspidites': 'Pythonidae',
    'Boa': 'Boidae', 'Eunectes': 'Boidae', 'Corallus': 'Boidae', 'Epicrates': 'Boidae',
    'Chilabothrus': 'Boidae', 'Eryx': 'Boidae', 'Lichanura': 'Boidae', 'Charina': 'Boidae',
    'Crotalus': 'Viperidae', 'Bothrops': 'Viperidae', 'Agkistrodon': 'Viperidae',
    'Vipera': 'Viperidae', 'Bitis': 'Viperidae', 'Trimeresurus': 'Viperidae',
    'Daboia': 'Viperidae', 'Lachesis': 'Viperidae',
    'Naja': 'Elapidae', 'Dendroaspis': 'Elapidae', 'Micrurus': 'Elapidae',
    'Ophiophagus': 'Elapidae', 'Bungarus': 'Elapidae', 'Oxyuranus': 'Elapidae',
    'Notechis': 'Elapidae', 'Hydrophis': 'Elapidae',
    'Lampropeltis': 'Colubridae', 'Pantherophis': 'Colubridae', 'Thamnophis': 'Colubridae',
    'Pituophis': 'Colubridae', 'Heterodon': 'Colubridae', 'Natrix': 'Colubridae',
    'Spilotes': 'Colubridae', 'Drymarchon': 'Colubridae', 'Oxybelis': 'Colubridae'
};

// Averigua a que familia biologica pertenece cada serpiente para que su informacion sea exacta
function detectarFamiliaReal(datos) {
    const ancestros = datos.ancestors || [];
    const ancestorIds = datos.ancestor_ids || [];
    const genero = ancestros.find(a => a.rank === 'genus')?.name || datos.name.split(' ')[0];

    let familia = ancestros.find(a => a.rank === 'family')?.name;

    if (!familia && ancestorIds.length > 0) {
        const idEncontrado = ancestorIds.find(id => MAPA_IDS_FAMILIAS[id]);
        if (idEncontrado) familia = MAPA_IDS_FAMILIAS[idEncontrado];
    }

    if (!familia && MAPA_GENERO_FAMILIA[genero]) {
        familia = MAPA_GENERO_FAMILIA[genero];
    }

    if (!familia && datos.wikipedia_summary) {
        const matchFamilia = datos.wikipedia_summary.match(/\b([A-Z][a-z]+idae)\b/);
        if (matchFamilia) familia = matchFamilia[1];
    }

    return familia || 'Serpentes (Familia no especificada)';
}

// Obtiene de la memoria del navegador las serpientes que el usuario marco como favoritas
function obtenerFavoritos(usuario) {
    return JSON.parse(localStorage.getItem(`favs_${usuario}`)) || [];
}

// Guarda en la memoria del navegador la lista actualizada de serpientes favoritas
function guardarFavoritos(usuario, lista) {
    localStorage.setItem(`favs_${usuario}`, JSON.stringify(lista));
}

// Elige el mejor nombre para mostrar: primero en espanol; si no existe, en ingles o su nombre cientifico
function obtenerNombreMostrar(especie) {
    let nombre = especie.preferred_common_name 
        || especie.english_common_name 
        || (especie.matched_term && especie.matched_term.toLowerCase() !== especie.name.toLowerCase() ? especie.matched_term : null)
        || especie.name;

    return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

// Determina si la serpiente es venenosa revisando su familia y palabras clave en su descripcion
function evaluarVeneno(especie) {
    const familia = detectarFamiliaReal(especie);
    const esFamiliaVenenosa = FAMILIAS_VENENOSAS.includes(familia);
    
    const texto = `${especie.name} ${especie.preferred_common_name || ''} ${especie.english_common_name || ''} ${especie.wikipedia_summary || ''}`.toLowerCase();
    const palabrasClave = ['cobra', 'víbora', 'vibora', 'cascabel', 'mamba', 'coral', 'serpiente marina', 'crotalus', 'naja', 'bothrops', 'micrurus', 'dendroaspis', 'venenosa', 'venomous'];
    
    return esFamiliaVenenosa || palabrasClave.some(p => texto.includes(p));
}

// Pide a internet la lista de serpientes segun la pagina y el texto escrito en el buscador
async function cargarCatalogo(pagina = 1, query = '') {
    const contenedor = document.getElementById('catalogoSerpientes');
    const loader = document.getElementById('loader');
    if (!contenedor) return;

    if (loader) loader.classList.remove('d-none');
    contenedor.innerHTML = '';

    const params = new URLSearchParams({
        taxon_id: TAXON_SERPIENTES,
        rank: 'species',
        locale: 'es',
        page: pagina,
        per_page: POR_PAGINA
    });
    if (query.trim() !== '') params.append('q', query.trim());

    try {
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const data = await res.json();
        totalResultados = data.total_results;
        paginaActual = pagina;
        busquedaActual = query;
        especiesEnPantalla = data.results;

        dibujarTarjetas(especiesEnPantalla, contenedor, false);
        actualizarPaginacion();
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<div class="col-12"><div class="alert alert-danger text-center">Error de conexión con la base de datos de serpientes.</div></div>`;
    } finally {
        if (loader) loader.classList.add('d-none');
    }
}

// Carga los datos de la persona conectada y muestra las serpientes que ha guardado
function iniciarPerfil() {
    const sesion = verificarSesion();
    if (!sesion) return;

    const favs = obtenerFavoritos(sesion.user);

    document.getElementById('perfilNombre').textContent = sesion.nombre || sesion.user;
    document.getElementById('perfilUser').textContent = `@${sesion.user}`;
    document.getElementById('perfilContador').textContent = favs.length;

    const contenedor = document.getElementById('listaFavoritos');

    if (favs.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center rounded-4 p-5 shadow-sm">
                    <h5 class="fw-bold mb-2">Aún no tienes serpientes favoritas</h5>
                    <p class="text-muted small mb-3">Explora el catálogo y guarda las especies que más te interesen para verlas aquí.</p>
                    <a href="catalogo.html" class="btn btn-dark btn-sm fw-bold px-4 rounded-3">Ir al Catálogo</a>
                </div>
            </div>`;
        return;
    }

    especiesEnPantalla = favs;
    dibujarTarjetas(favs, contenedor, true);
}

// Construye las tarjetas de cada serpiente en pantalla y conecta sus botones sin usar JS en el HTML
function dibujarTarjetas(lista, contenedor, enPerfil) {
    contenedor.innerHTML = '';
    const sesion = verificarSesion();
    if (!sesion) return;

    const favsActuales = obtenerFavoritos(sesion.user);

    if (lista.length === 0) {
        contenedor.innerHTML = `<div class="col-12"><div class="alert alert-warning text-center">No se encontraron serpientes.</div></div>`;
        return;
    }

    lista.forEach(especie => {
        const nombreMostrar = obtenerNombreMostrar(especie);
        const foto = (especie.default_photo && especie.default_photo.medium_url) 
            ? especie.default_photo.medium_url 
            : 'https://placehold.co/400x300?text=Sin+Foto';

        const esVenenosa = evaluarVeneno(especie);
        const yaEsFavorita = favsActuales.some(f => f.id === especie.id);

        const badgeVeneno = esVenenosa 
            ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm">Venenosa</span>`
            : `<span class="badge bg-success position-absolute top-0 start-0 m-2 shadow-sm">No venenosa</span>`;

        const textoBotonFav = yaEsFavorita ? 'Quitar de Guardados' : 'Agregar a Favoritos';
        const claseBotonFav = yaEsFavorita
            ? 'btn btn-warning btn-sm w-100 fw-bold mt-2 btn-fav'
            : 'btn btn-outline-warning text-dark btn-sm w-100 mt-2 btn-fav';

        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <div class="position-relative">
                    <img src="${foto}" class="card-img-top" style="height: 190px; object-fit: cover;">
                    ${badgeVeneno}
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold mb-1">${nombreMostrar}</h6>
                    <p class="text-muted fst-italic small mb-2">${especie.name}</p>
                    <p class="small text-secondary flex-grow-1">
                        Avistamientos: <strong>${(especie.observations_count || 0).toLocaleString()}</strong>
                    </p>
                    <button type="button" class="btn btn-dark btn-sm w-100 rounded-3 btn-info-serpiente">
                        Ver toda la información
                    </button>
                    <button type="button" class="${claseBotonFav}">
                        ${textoBotonFav}
                    </button>
                </div>
            </div>
        `;

        // Conecta los eventos de clic directamente desde JavaScript
        col.querySelector('.btn-info-serpiente').addEventListener('click', () => verFichaTecnica(especie.id));
        col.querySelector('.btn-fav').addEventListener('click', () => alternarFavorito(especie.id, enPerfil));

        contenedor.appendChild(col);
    });
}

// Guarda o quita una serpiente de la lista de favoritos cuando se presiona el boton amarillo
function alternarFavorito(idEspecie, enPerfil) {
    const sesion = verificarSesion();
    if (!sesion) return;

    let favs = obtenerFavoritos(sesion.user);
    const existe = favs.some(f => f.id === idEspecie);

    if (existe) {
        favs = favs.filter(f => f.id !== idEspecie);
    } else {
        const especieObj = especiesEnPantalla.find(e => e.id === idEspecie);
        if (especieObj) favs.push(especieObj);
    }

    guardarFavoritos(sesion.user, favs);

    if (enPerfil) {
        iniciarPerfil();
    } else {
        dibujarTarjetas(especiesEnPantalla, document.getElementById('catalogoSerpientes'), false);
    }
}

// Abre la ventana emergente con toda la informacion biologica, habitat y galeria de fotos
async function verFichaTecnica(idEspecie) {
    const especie = especiesEnPantalla.find(e => e.id === idEspecie);
    if (!especie) return;

    serpienteModalActualId = idEspecie;

    const fotoExacta = (especie.default_photo && especie.default_photo.medium_url)
        ? especie.default_photo.medium_url
        : 'https://placehold.co/600x400?text=Sin+Foto';

    const imgElemento = document.getElementById('modalFoto');
    imgElemento.src = '';
    imgElemento.onerror = function() {
        this.src = 'https://placehold.co/600x400?text=Sin+Foto';
    };
    imgElemento.src = fotoExacta;

    const galeriaDiv = document.getElementById('modalGaleria');
    galeriaDiv.innerHTML = '<small class="text-muted">Buscando más fotos...</small>';

    actualizarDatosModal(especie);
    document.getElementById('modalDistribucion').textContent = 'Consultando regiones registradas...';

    const modalEl = document.getElementById('modalSerpiente');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    try {
        const res = await fetch(`${API_URL}/${idEspecie}?locale=es`);
        const data = await res.json();

        if (serpienteModalActualId !== idEspecie) return;

        const detalle = data.results[0];
        if (!detalle) return;

        actualizarDatosModal(detalle);

        const lugares = (detalle.listed_taxa || [])
            .map(lt => lt.place?.display_name || lt.place?.name)
            .filter(Boolean);
        const lugaresUnicos = [...new Set(lugares)].slice(0, 6);

        document.getElementById('modalDistribucion').textContent = lugaresUnicos.length > 0
            ? lugaresUnicos.join(', ')
            : 'Distribución global registrada en el mapa de observaciones.';

        const fotosExtra = (detalle.taxon_photos || []).slice(0, 5);
        galeriaDiv.innerHTML = '';

        if (fotosExtra.length > 1) {
            fotosExtra.forEach(item => {
                if (item.photo && item.photo.square_url && item.photo.medium_url) {
                    const miniImg = document.createElement('img');
                    miniImg.src = item.photo.square_url;
                    miniImg.className = 'rounded-2 border shadow-sm';
                    miniImg.style.width = '58px';
                    miniImg.style.height = '58px';
                    miniImg.style.objectFit = 'cover';
                    miniImg.style.cursor = 'pointer';
                    miniImg.title = 'Clic para ver esta foto';

                    miniImg.addEventListener('click', () => {
                        document.getElementById('modalFoto').src = item.photo.medium_url;
                        document.getElementById('modalAutorFoto').textContent = item.photo.attribution || 'Foto verificada en iNaturalist';
                    });

                    galeriaDiv.appendChild(miniImg);
                }
            });
        } else {
            galeriaDiv.innerHTML = '<small class="text-muted">Esta especie solo tiene 1 foto disponible.</small>';
        }
    } catch (error) {
        if (serpienteModalActualId === idEspecie) {
            galeriaDiv.innerHTML = '';
            document.getElementById('modalDistribucion').textContent = 'Ver mapa de distribución en iNaturalist.';
        }
    }
}

// Coloca dentro de la ventana todos los textos de clasificacion, habitat, veneno y conservacion
function actualizarDatosModal(datos) {
    const nombreMostrar = obtenerNombreMostrar(datos);
    const ancestros = datos.ancestors || [];
    
    const familia = detectarFamiliaReal(datos);
    const genero = ancestros.find(a => a.rank === 'genus')?.name || datos.name.split(' ')[0];
    const suborden = ancestros.find(a => a.rank === 'suborder')?.name || 'Serpentes';

    const esVenenosa = evaluarVeneno(datos);
    const infoEcologica = obtenerInfoEcologicaPorFamilia(familia);

    const descripcion = datos.wikipedia_summary
        ? datos.wikipedia_summary.replace(/<[^>]*>?/gm, '')
        : `${nombreMostrar} (${datos.name}) es una serpiente perteneciente a la familia ${familia}. ${infoEcologica.comportamiento}`;

    const conservacion = datos.conservation_status
        ? `${datos.conservation_status.status_name.toUpperCase()} (${datos.conservation_status.authority || 'UICN'})`
        : 'No evaluado / Preocupación menor';

    document.getElementById('modalNombre').textContent = nombreMostrar;
    document.getElementById('modalCientifico').textContent = datos.name;
    document.getElementById('modalAutorFoto').textContent = datos.default_photo?.attribution || 'Foto verificada en iNaturalist';
    document.getElementById('modalDesc').textContent = descripcion;
    document.getElementById('modalHabitat').textContent = infoEcologica.habitat;
    document.getElementById('modalObs').textContent = (datos.observations_count || 0).toLocaleString();
    document.getElementById('modalId').textContent = datos.id;
    document.getElementById('modalConservacion').textContent = conservacion;
    document.getElementById('modalLinkMapa').href = `https://www.inaturalist.org/taxa/${datos.id}`;

    document.getElementById('modalVeneno').innerHTML = esVenenosa
        ? '<span class="badge bg-danger fs-6">Especie Venenosa (Precaución)</span>'
        : '<span class="badge bg-success fs-6">No venenosa / Sin riesgo médico mayor</span>';

    document.getElementById('modalTaxonomia').innerHTML = `
        <span class="badge bg-secondary">Suborden: ${suborden}</span>
        <span class="badge bg-dark">Familia: ${familia}</span>
        <span class="badge bg-primary">Género: ${genero}</span>
        <span class="badge bg-info text-dark">Rango: ${datos.rank}</span>
    `;
}

// Contiene la explicacion del habitat y comportamiento natural segun la familia de la serpiente
function obtenerInfoEcologicaPorFamilia(familia) {
    const infoPorFamilia = {
        'Viperidae': {
            habitat: 'Bosques templados y tropicales, matorrales áridos, desiertos, zonas rocosas y pastizales. Muchas especies son terrestres y se camuflan entre la hojarasca.',
            comportamiento: 'Poseen colmillos retráctiles para inyectar veneno y órganos sensibles al calor para detectar presas de sangre caliente. Cumplen un rol clave controlando poblaciones de roedores.'
        },
        'Elapidae': {
            habitat: 'Selvas húmedas, sabanas, bosques secos, zonas costeras y arrecifes (en el caso de las serpientes marinas). Suelen refugiarse en madrigueras, troncos huecos o bajo rocas.',
            comportamiento: 'Cuentan con colmillos fijos delanteros y veneno principalmente neurotóxico. Son depredadores activos que se alimentan de otros reptiles, anfibios, peces o pequeños mamíferos.'
        },
        'Colubridae': {
            habitat: 'Gran variedad de ecosistemas: bosques, selvas, praderas, humedales, zonas agrícolas y áreas cercanas a cuerpos de agua. Incluye especies terrestres, arborícolas y semiacuáticas.',
            comportamiento: 'Es la familia más diversa de serpientes. La gran mayoría son inofensivas para el ser humano y cazan mediante constricción o captura directa de ranas, lagartijas, aves y roedores.'
        },
        'Boidae': {
            habitat: 'Selvas tropicales, bosques húmedos, sabanas y zonas cercanas a ríos o pantanos. Muchas tienen hábitos crepusculares o nocturnos y excelentes capacidades trepadoras.',
            comportamiento: 'No son venenosas; someten a sus presas mediante constricción muscular. Poseen receptores térmicos en los labios para localizar aves y mamíferos.'
        },
        'Pythonidae': {
            habitat: 'Selvas tropicales, bosques abiertos, sabanas y pastizales de África, Asia y Oceanía, frecuentemente cerca de fuentes de agua o madrigueras.',
            comportamiento: 'Serpientes constrictoras no venenosas de gran fuerza física. Las hembras enrollan su cuerpo alrededor de los huevos para incubarlos y protegerlos hasta la eclosión.'
        },
        'Hydrophiidae': {
            habitat: 'Aguas marinas costeras, arrecifes de coral y estuarios cálidos de los océanos Índico y Pacífico.',
            comportamiento: 'Adaptadas completamente a la vida acuática con cola aplanada en forma de remo y válvulas nasales que se cierran al sumergirse.'
        }
    };

    return infoPorFamilia[familia] || {
        habitat: 'Ecosistemas terrestres, bosques, zonas de vegetación densa, áreas rocosas o cercanas a fuentes de agua dulce según su región de origen.',
        comportamiento: 'Como todas las serpientes, es un reptil carnívoro de sangre fría que regula su temperatura con el entorno y ayuda a mantener el equilibrio ecológico del ecosistema.'
    };
}

// Actualiza el numero de pagina actual y activa o desactiva los botones Anterior y Siguiente
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(totalResultados / POR_PAGINA) || 1;
    document.getElementById('infoPaginacion').textContent = `Página ${paginaActual} de ${totalPaginas.toLocaleString()}`;
    document.getElementById('btnAnterior').disabled = paginaActual <= 1;
    document.getElementById('btnSiguiente').disabled = paginaActual >= totalPaginas;
}