document.addEventListener('DOMContentLoaded', function () {
  const switchInput = document.getElementById('modoOscuroSwitch');
  const body = document.body;

  // Cargar preferencia guardada
  if (localStorage.getItem('modo') === 'oscuro') {
    body.classList.add('bg-dark', 'text-white');
    if (switchInput) switchInput.checked = true;
  }

  if (switchInput) {
    switchInput.addEventListener('change', function () {
      if (this.checked) {
        body.classList.add('bg-dark', 'text-white');
        localStorage.setItem('modo', 'oscuro');
      } else {
        body.classList.remove('bg-dark', 'text-white');
        localStorage.setItem('modo', 'claro');
      }
    });
  }

  // Cambia el ícono del switch según el modo
  const iconoModo = document.getElementById('icono-modo');
  function actualizarIconoModo() {
    if (body.classList.contains('bg-dark')) {
      iconoModo.textContent = '🌙';
    } else {
      iconoModo.textContent = '☀️';
    }
  }
  if (iconoModo && switchInput) {
    actualizarIconoModo();
    switchInput.addEventListener('change', actualizarIconoModo);
  }

  // Validación de formulario de contacto mejorada
  if (document.querySelector('form')) {
    const form = document.querySelector('form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const asuntoInput = document.getElementById('asunto');
    const mensajeInput = document.getElementById('mensaje');

    // Función para mostrar/ocultar feedback
    function setInvalid(input, message) {
      input.classList.add('is-invalid');
      let feedback = input.nextElementSibling;
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.appendChild(feedback);
      }
      feedback.textContent = message;
    }
    function clearInvalid(input) {
      input.classList.remove('is-invalid');
      let feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
      }
    }

    // Validación activa en tiempo real
    function setValid(input) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      let feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
      }
    }

    function validateField(input, validator, message) {
      if (!validator(input.value)) {
        setInvalid(input, message);
        input.classList.remove('is-valid');
        return false;
      } else {
        setValid(input);
        return true;
      }
    }

    nombreInput.addEventListener('input', function() {
      validateField(nombreInput, v => v.trim() !== '', 'Por favor, ingrese su nombre.');
    });
    emailInput.addEventListener('input', function() {
      validateField(emailInput, v => /^\S+@\S+\.\S+$/.test(v), 'Por favor, ingrese un correo electrónico válido.');
    });
    asuntoInput.addEventListener('input', function() {
      validateField(asuntoInput, v => v.trim() !== '', 'Por favor, ingrese el asunto.');
    });
    mensajeInput.addEventListener('input', function() {
      validateField(mensajeInput, v => v.trim() !== '', 'Por favor, ingrese su mensaje.');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let errores = 0;

      // Validaciones
      if (!validateField(nombreInput, v => v.trim() !== '', 'Por favor, ingrese su nombre.')) errores++;
      if (!validateField(emailInput, v => /^\S+@\S+\.\S+$/.test(v), 'Por favor, ingrese un correo electrónico válido.')) errores++;
      if (!validateField(asuntoInput, v => v.trim() !== '', 'Por favor, ingrese el asunto.')) errores++;
      if (!validateField(mensajeInput, v => v.trim() !== '', 'Por favor, ingrese su mensaje.')) errores++;

      if (errores > 0) return;

      // Mostrar modal de éxito
      const modal = document.getElementById('modal-exito');
      const modalNombre = document.getElementById('modal-nombre');
      if (modal && modalNombre) {
        modalNombre.textContent = nombreInput.value;
        modal.classList.add('show');
        document.body.classList.add('modal-open-custom');
      }
      // Limpiar validaciones visuales
      [nombreInput, emailInput, asuntoInput, mensajeInput].forEach(i => i.classList.remove('is-valid'));
      form.reset();
      // Reiniciar contador de caracteres inmediatamente
      if (charCount && mensajeInput) {
        charCount.textContent = "0/500 caracteres";
      }
    });

    // Cerrar modal
    document.addEventListener('click', function (e) {
      const modal = document.getElementById('modal-exito');
      if (modal && modal.classList.contains('show')) {
        if (e.target.id === 'modal-exito' || e.target.id === 'modal-cerrar') {
          modal.classList.remove('show');
          document.body.classList.remove('modal-open-custom');
        }
      }
    });
  }

  // Contador de caracteres para el textarea de mensaje
  const mensajeInput = document.getElementById('mensaje');
  const charCount = document.getElementById('charCount');
  if (mensajeInput && charCount) {
    mensajeInput.addEventListener('input', function() {
      let length = mensajeInput.value.length;
      if (length > 500) {
        mensajeInput.value = mensajeInput.value.slice(0, 500);
        length = 500;
      }
      charCount.textContent = `${length}/500 caracteres`;
    });
    // Inicializar contador al cargar
    charCount.textContent = `${mensajeInput.value.length}/500 caracteres`;
  }

  // Reiniciar contador al enviar el formulario
  if (form && charCount && mensajeInput) {
    form.addEventListener('submit', function () {
      setTimeout(function() {
        if (charCount && mensajeInput) {
          charCount.textContent = "0/500 caracteres";
          mensajeInput.classList.remove('is-valid');
        }
      }, 0);
    });
  }
});