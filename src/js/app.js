let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta el DIV actual segun el tab que se presiona
    mostrarSeccion();

    //Oculta o muestra la seccion segun lo que selecciones
    cambiarSeccion();

    //Paginacion

    paginaSiguiente();
    paginaAnterior();

    //Comprueba pagina actual para manegar la paginacion visualmente
    botonesPaginador();

    //Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validación)
    mostrarResumen();

    //Guardar el nombre de la cita en el objeto/array
    nombreCita();

    //Guardar fecha de la cita en el objeto/array
    fechaCita();

    //Deshabilitar dias anteriores en la fecha
    deshabilitarFechaAnterior();

    //Guarda la hora en el objeto/array
    horaCita();
}

function mostrarSeccion(){

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Background al tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso); //Paso el dato a number, estaba en string
            
            mostrarSeccion();
            botonesPaginador();
        })
    });
}

async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        //Generar el HTML

        servicios.forEach( servicio => {
            const {id, nombre, precio} = servicio;

            //DOM Scripting

            //Generar nombre del corte
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Generar precio servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita

            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //Inyectar en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){

    let elemento; //Iniciamos variable sin valor
    
    //Forzar que el elemento al que hacemos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    //Comprobar si esta clickado o no
    if(elemento.classList.contains('selected')){
        elemento.classList.remove('selected');

        //Eliminamos servicio del Array

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else{
        elemento.classList.add('selected');

        //console.log(elemento.firstElementChild.nextElementSibling.textContent);
        //Agregamos el servicio al Array

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id){
    //console.log('Eliminando...', id);
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); //Llama a todos los id menos el pasado por parametro a la funcion, de esta forma se elimina.

    //console.log(cita);
}

function agregarServicio(servicioObj){
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj]; //Toma una copia de los servicios y añade servicioObj

    //console.log(cita);
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        //console.log(pagina);
        botonesPaginador();
    })
};

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        //console.log(pagina);
        botonesPaginador();
    })
};

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Estamos en la pagina 3, recarga el array de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen(){
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionar el resumen

    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el html previo

    while(resumenDiv.firstChild){
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //Validacion de objeto

    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos en el formulario';
        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen DIV
        resumenDiv.appendChild(noServicios);

        return;
    }

    //Mostrar el resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la Cita';


    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;
    
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');
    
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de los Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //Interactuar con el Array de servicios

    servicios.forEach( servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt(totalServicio[1].trim());

        //Colocar texto y precio en el DIV

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });


    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);

}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); //Trim elimina los espacios en blanco del string, al inicio y al final de la cadena

        //Validacion de que nombreTexto tiene que tener contenido
        if (nombreTexto === '' || nombreTexto.length < 3 ){
            mostrarAlerta('nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            cita.nombre = nombreTexto;
            //console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo){
    //console.log('El mensaje es', mensaje);

    //Si hay una alerta previa, no crear otra

    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia){
        return; //Sale de la funcion y deja de ejecutarse
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error'){
        alerta.classList.add('error');
    }

    //Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    //Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        //console.log(e.target.value);
        const dia = new Date(e.target.value).getUTCDay(); //Devuelve el numero del dia dentro de la semana

        //Caso, los fines de semana no están disponibles en reserva de cita
        if([0, 6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('No puedes seleccionar la cita en fin de semana','error');
        } else {
            cita.fecha = fechaInput.value;
            //console.log(cita);
        }

        //Manejo de datos en fecha input
        /*const opciones = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
        }*/
        //console.log(dia.toLocaleDateString('es-ES', opciones)); //Libreria para trabajar con las fechas
    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate();

    //Formato deseado AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        //console.log(e.target.value);

        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if(hora[0] < 10 || hora[0] > 18){
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);            
        } else {
            cita.hora = horaCita;
        }
    });
}