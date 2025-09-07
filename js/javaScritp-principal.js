let productos = [];
let contador = 1;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fecha").textContent = new Date().toLocaleDateString();
  document.getElementById("numero-cotizacion").textContent = generarNumeroCotizacion();
});

function generarNumeroCotizacion() {
  return "COT-" + String(contador).padStart(4, "0");
}

function agregarProducto() {
  const producto = document.getElementById("producto").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);

  if (!producto || isNaN(cantidad) || isNaN(precio)) {
    alert("Completa todos los campos");
    return;
  }

  productos.push({ producto, cantidad, precio });
  renderTabla();
  limpiarFormulario();
}

function renderTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";
  let total = 0;

  productos.forEach((p, i) => {
    const subtotal = p.cantidad * p.precio;
    total += subtotal;

    const fila = `
      <tr>
        <td>${i + 1}</td>
        <td>${p.producto}</td>
        <td>${p.cantidad}</td>
        <td>S/ ${p.precio.toFixed(2)}</td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td class="acciones-col"><button onclick="eliminarProducto(${i})">❌</button></td>
      </tr>
    `;
    tbody.innerHTML += fila;
  });

  document.getElementById("total").textContent = total.toFixed(2);
}

function eliminarProducto(i) {
  productos.splice(i, 1);
  renderTabla();
}

function limpiarFormulario() {
  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("precio").value = "";
}

function limpiarCotizacion() {
  productos = [];
  renderTabla();
}

async function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const cot = document.getElementById("cotizacion");

  try {
    const canvas = await html2canvas(cot, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(document.getElementById("numero-cotizacion").textContent + ".pdf");
  } catch (err) {
    console.error("Error al generar PDF:", err);
    alert("Ocurrió un error al generar el PDF. Revisa la consola.");
  }
}

function enviarWhatsApp() {
  const cliente = document.getElementById("nombre-cliente").value;
  const total = document.getElementById("total").textContent;
  const mensaje = `Hola ${cliente}, te envío la cotización ${document.getElementById("numero-cotizacion").textContent}. Total: S/ ${total}`;
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
