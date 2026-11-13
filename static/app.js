fetch("/categorias")
    .then(respuesta => respuesta.json())
    .then(categorias => {
        const comboFiltro = document.getElementById("categoria");
        const comboProducto = document.getElementById("categoria-producto");


        for (const categoria of categorias) {
            const opcionFiltro = document.createElement("option");
            opcionFiltro.value = categoria.categoriaid;
            opcionFiltro.textContent = categoria.nombre;
            comboFiltro.appendChild(opcionFiltro);

            const opcionProducto = document.createElement("option");
            opcionProducto.value = categoria.categoriaid;
            opcionProducto.textContent = categoria.nombre;
            comboProducto.appendChild(opcionProducto);
        }
    });

let productoSeleccionado = null;

function cargarProductos(categoriaid = "") 
{
    let url = "/productos";

    if (categoriaid !== "") {
        url = "/productos?categoriaid=" + categoriaid;
    }

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(productos => {
            const tabla = document.getElementById("tabla-productos");

            tabla.innerHTML = "";

            for (const producto of productos) {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${producto.productoid}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria}</td>
                `;

                fila.addEventListener("click", function () {

                    document.querySelectorAll("#tabla-productos tr").forEach(f => {
                        f.classList.remove("fila-seleccionada");
                    });

                    fila.classList.add("fila-seleccionada"); 

                    productoSeleccionado = producto.productoid;    

                    document.getElementById("nombre").value = producto.nombre;
                    document.getElementById("descripcion").value = producto.descripcion;
                    document.getElementById("precio").value = producto.precio;
                    document.getElementById("stock").value = producto.stock;
                    document.getElementById("categoria-producto").value = producto.categoriaid;
                });

                tabla.appendChild(fila);
            }
        });
}

const comboCategoria = document.getElementById("categoria");

comboCategoria.addEventListener("change", function () 
{
    cargarProductos(comboCategoria.value);
});

cargarProductos();

const botonNuevo = document.getElementById("btn-nuevo");

botonNuevo.addEventListener("click", function () {

    productoSeleccionado = null;

    document.querySelectorAll("#tabla-productos tr").forEach(f => {
        f.classList.remove("fila-seleccionada");
    });

    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("categoria-producto").value = "";
});

const botonAgregar = document.getElementById("btn-agregar");

botonAgregar.addEventListener("click", function () {

    const formulario = document.getElementById("form-producto");

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const producto = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value),
        categoriaid: parseInt(document.getElementById("categoria-producto").value)
    };

    fetch("/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            comboCategoria.value = "";
            cargarProductos();
            document.getElementById("btn-nuevo").click();
        });

});

const botonModificar = document.getElementById("btn-modificar");

botonModificar.addEventListener("click", function () {

    if (productoSeleccionado === null) {
        alert("Seleccione un producto de la tabla.");
        return;
    }

    const formulario = document.getElementById("form-producto");

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const producto = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: parseFloat(document.getElementById("precio").value),
        stock: parseInt(document.getElementById("stock").value),
        categoriaid: parseInt(document.getElementById("categoria-producto").value)
    };

    fetch("/productos/" + productoSeleccionado, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            comboCategoria.value = "";
            cargarProductos();
            document.getElementById("btn-nuevo").click();
        });

});

const botonEliminar = document.getElementById("btn-eliminar");

botonEliminar.addEventListener("click", function () {

    if (productoSeleccionado === null) {
        alert("Seleccione un producto de la tabla.");
        return;
    }

    if (!confirm("¿Está seguro de eliminar el producto seleccionado?")) {
        return;
    }

    fetch("/productos/" + productoSeleccionado, {
        method: "DELETE"
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            comboCategoria.value = "";
            cargarProductos();
            document.getElementById("btn-nuevo").click();
        });

});