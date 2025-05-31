// Script para validación de búsqueda y alertas flotantes

function validateSearch() {
  const input = document.getElementById('searchInput').value.trim();
  if (!input) {
    alert('Por favor, ingresa un término de búsqueda.');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  const alert = document.getElementById('floating-alert');
  if(alert) {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.top = '0px';
      setTimeout(() => alert.remove(), 600);
    }, 3500);
  }
});
