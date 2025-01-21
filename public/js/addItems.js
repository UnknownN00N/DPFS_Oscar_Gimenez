document.addEventListener('DOMContentLoaded', () => {
  let elementCount = 0;
  let lastGeneratedElements = {};

  const toggleButton = document.querySelector('.content--toggleButton');
  const toggleContentButton = document.getElementById('toggleContentPlus');
  const downButtons = document.getElementById('toggleContentTab');
  const contentMenu = document.querySelector('.contentMenu');
  const contentParagraph = contentMenu.querySelector('p');
  const dataContainer = document.querySelector('.data-container');

  if (!toggleButton || !toggleContentButton || !downButtons || !contentMenu || !dataContainer) {
    console.error('Elementos requeridos no encontrados.');
    return;
  }

  const hideElements = (...elements) => elements.forEach(el => el.classList.add('hidden'));
  const showElements = (...elements) => elements.forEach(el => el.classList.remove('hidden'));

  const restorePreviewBoxes = () => {
    document.querySelectorAll('.contentPreview--box').forEach(box => {
      box.classList.add('visible');
    });
  };

  toggleButton.addEventListener('click', () => {
    hideElements(toggleButton, downButtons);
    showElements(toggleContentButton, contentMenu, contentParagraph);

    // Ocultar todos los contentPreview--box
    document.querySelectorAll('.contentPreview--box').forEach(box => {
      box.classList.remove('visible');
    });
  });

  toggleContentButton.addEventListener('click', () => {
    hideElements(toggleContentButton, contentMenu);
    showElements(toggleButton, downButtons);

    // Restaurar todos los contentPreview--box
    restorePreviewBoxes();
  });

  const initializeContentMenuHandlers = () => {
    const addButtons = document.querySelectorAll('.contentMenu--buttons .data-add-button');

    addButtons.forEach(addButton => {
      addButton.addEventListener('click', async () => {
        elementCount++;
        const containerSelector = addButton.dataset.targetContainer;
        const container = document.querySelector(containerSelector);
        const partialType = addButton.dataset.partialType;
        const cancelButtonSelector = addButton.dataset.cancelButton;

        if (!container || !partialType || !cancelButtonSelector) {
          console.error('Datos del botón no válidos.');
          return;
        }

        const cancelButton = document.querySelector(cancelButtonSelector);

        try {
          const partialUrl = `/partial?type=${partialType}&id=${elementCount}`;
          const response = await fetch(partialUrl);

          if (!response.ok) throw new Error('Error al cargar el partial');

          const partialHTML = await response.text();
          const newElement = document.createElement('div');
          newElement.classList.add('dynamic-partial');
          newElement.innerHTML = partialHTML;

          container.appendChild(newElement);
          lastGeneratedElements[partialType] = newElement;

          hideElements(toggleContentButton, contentMenu);

          // Ocultar todos los contentPreview--box
          document.querySelectorAll('.contentPreview--box').forEach(box => {
            box.classList.remove('visible');
          });

          showElements(cancelButton);

          initializePartialHandlers(newElement, cancelButton);

          // Asociar el cancelButton con el partial recién generado
          cancelButton.addEventListener('click', () => {
            // Eliminar solo el partial asociado con este botón
            if (!newElement.classList.contains('editing')) {
              newElement.remove();
              hideElements(cancelButton);

              // Restaurar el menú principal y los contentPreview--box
              showElements(toggleContentButton, contentMenu);
              restorePreviewBoxes();
            }
          });
        } catch (error) {
          console.error('Error al cargar el partial:', error);
        }
      });
    });
  };

  const initializePartialHandlers = (partialElement, cancelButton) => {
    const saveButton = partialElement.querySelector('.save-button');
    const editButton = partialElement.querySelector('.edit-button');
    const deleteButton = partialElement.querySelector('.delete-button');
    const form = partialElement.querySelector('.dynamicForm--box');
    const previewBox = partialElement.querySelector('.contentPreview--box');
    const titleInput = partialElement.querySelector('input[type="text"]');
    const previewTitle = previewBox.querySelector('.contentPreview');

    if (!saveButton || !editButton || !deleteButton || !form || !previewBox || !titleInput || !previewTitle) {
      console.error('Elementos internos del partial no encontrados.');
      return;
    }

    // Guardar cambios
    saveButton.addEventListener('click', () => {
      const titleValue = titleInput.value.trim();
      if (titleValue) {
        previewTitle.textContent = titleValue;
        previewBox.classList.add('visible');
        form.classList.remove('visible');

        // Restaurar botones "+ Descripción", "+ Recursos" y "+ Contenido"
        showElements(toggleButton, downButtons);
        hideElements(cancelButton);

        partialElement.classList.remove('editing'); // Remover estado de edición

        // Mostrar todos los previewBox al guardar
        restorePreviewBoxes();
      } else {
        alert('El título no puede estar vacío.');
      }
    });

    // Editar contenido
    editButton.addEventListener('click', () => {
      previewBox.classList.remove('visible'); // Ocultar la previsualización del actual
      form.classList.add('visible'); // Mostrar el formulario

      // Ocultar todos los demás previewBox
      document.querySelectorAll('.contentPreview--box').forEach(box => {
        box.classList.remove('visible');
      });

      // Ocultar botones "+ Descripción", "+ Recursos" y "+ Contenido"
      hideElements(toggleButton, downButtons);

      partialElement.classList.add('editing'); // Marcar como edición
    });

    // Eliminar contenido
    deleteButton.addEventListener('click', () => {
      partialElement.remove(); // Eliminar el partial del DOM
      hideElements(cancelButton);

      // Restaurar botones "+ Descripción", "+ Recursos" y "+ Contenido"
      showElements(toggleButton, downButtons);

      // Restaurar contentPreview--box
      restorePreviewBoxes();
    });
  };

  const initializeDownButtonsHandlers = () => {
    const downButtonsAdd = downButtons.querySelectorAll('.data-add-button');

    downButtonsAdd.forEach(addButton => {
      addButton.addEventListener('click', async () => {
        elementCount++;
        const containerSelector = addButton.dataset.targetContainer;
        const container = document.querySelector(containerSelector);
        const partialType = addButton.dataset.partialType;
        const cancelButtonSelector = addButton.dataset.cancelButton;

        if (!container || !partialType || !cancelButtonSelector) {
          console.error('Datos del botón no válidos.');
          return;
        }

        const cancelButton = document.querySelector(cancelButtonSelector);

        try {
          const partialUrl = `/partial?type=${partialType}&id=${elementCount}`;
          const response = await fetch(partialUrl);

          if (!response.ok) throw new Error('Error al cargar el partial');

          const partialHTML = await response.text();
          const newElement = document.createElement('div');
          newElement.classList.add('dynamic-partial');
          newElement.innerHTML = partialHTML;

          container.appendChild(newElement);
          lastGeneratedElements[partialType] = newElement;

          hideElements(toggleButton, downButtons);

          // Ocultar todos los previewBox
          document.querySelectorAll('.contentPreview--box').forEach(box => {
            box.classList.remove('visible');
          });

          showElements(cancelButton);

          initializePartialHandlers(newElement, cancelButton);

          cancelButton.addEventListener('click', () => {
            // Caso de generación de partial dinámico
            if (!newElement.classList.contains('editing')) {
              newElement.remove();
              hideElements(cancelButton);
              showElements(toggleButton, downButtons);

              // Restaurar contentPreview--box
              restorePreviewBoxes();
            }
          });
        } catch (error) {
          console.error('Error al cargar el partial:', error);
        }
      });
    });
  };

  initializeContentMenuHandlers();
  initializeDownButtonsHandlers();
});

/*

https://www.phind.com/search?cache=j0pblpdcojgiqzxq8cd3zyj6

Resumen del código y mejores prácticas:

    Se ha modificado la función hideSpecificAddButtonAfterGenerate para aceptar dos parámetros: el botón generado (generatedButton) y el ID del botón específico que queremos ocultar (specificButtonId).
    La función ahora busca el botón específico que se pasó como parámetro y lo oculta.
    Se ha mantenido la funcionalidad existente de encontrar el botón generado.
    Se ha seguido la siguiente mejor práctica:
        Uso de parámetros para personalizar el comportamiento de la función.

Con esta implementación, puedes ocultar un botón específico después de generar un elemento relacionado con él. Por ejemplo, si quieres ocultar el botón "+ Descripción" después de generar un elemento de descripción, simplemente pasas el ID de ese botón como segundo parámetro a la función hideSpecificAddButtonAfterGenerate.

Esta solución te da más flexibilidad para controlar qué botones se ocultan después de generar elementos dinámicos en tu interfaz.

const initializeContentMenuHandlers = () => {
  const addButtons = document.querySelectorAll('.contentMenu--buttons.data-add-button');

  addButtons.forEach(addButton => {
    addButton.addEventListener('click', async (event) => {
      elementCount++;
      const containerSelector = addButton.dataset.targetContainer;
      const container = document.querySelector(containerSelector);
      const partialType = addButton.dataset.partialType;
      const cancelButtonSelector = addButton.dataset.cancelButton;

      if (!container || !partialType || !cancelButtonSelector) {
        console.error('Datos del botón no válidos.');
        return;
      }

      const cancelButton = document.querySelector(cancelButtonSelector);

      try {
        const partialUrl = `/partial?type=${partialType}&id=${elementCount}`;
        const response = await fetch(partialUrl);

        if (!response.ok) throw new Error('Error al cargar el partial');

        const partialHTML = await response.text();
        const newElement = document.createElement('div');
        newElement.classList.add('dynamic-partial');
        newElement.innerHTML = partialHTML;

        container.appendChild(newElement);
        lastGeneratedElements[partialType] = newElement;

        hideElements(toggleContentButton, downButtons);

        // Ocultar todos los contentPreview--box
        document.querySelectorAll('.contentPreview--box').forEach(box => {
          box.classList.remove('visible');
        });

        // Mostrar el botón de cancelación solo si el tipo no es "itemResources"
        if (partialType !== "itemResources") {
          showElements(cancelButton);
        }

        initializePartialHandlers(newElement, cancelButton);

        // Ocultar el botón especificado después de generar el elemento
        hideSpecificAddButtonAfterGenerate(event.target, addButton.id);

        cancelButton.addEventListener('click', () => {
          // Eliminar solo el partial asociado con este botón
          if (!newElement.classList.contains('editing')) {
            newElement.remove();
            hideElements(cancelButton);

            // Restaurar los botones y contentPreview--box
            showElements(toggleContentButton, downButtons);
            restorePreviewBoxes();
          }
        });
      } catch (error) {
        console.error('Error al cargar el partial:', error);
      }
    });
  });
};

// Función para ocultar un botón específico después de generar el elemento
const hideSpecificAddButtonAfterGenerate = (generatedButton, specificButtonId) => {
  // Buscar el botón correspondiente en la sección de contenido
  const generatedButtonElement = document.querySelector(`#${generatedButton.id}`);
  
  if (generatedButtonElement) {
    // Ocultar el botón específico que se pasó como parámetro
    const buttonToHide = document.querySelector(`#${specificButtonId}`);
    if (buttonToHide) {
      buttonToHide.style.display = 'none';
    }
  }
};

*/