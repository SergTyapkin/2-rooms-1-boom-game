const observableObjects = [];

function _checkAllObjects() {
  observableObjects.forEach((obj) => {
      const element = obj.element;
      if (!element) {
        return;
      }
      const position = element.getBoundingClientRect();

      // проверка, находится ли элемент в видимой области прокрутки
      if (
        (position.top <= window.innerHeight - obj.bottomOffset) &&
        (position.bottom >= obj.topOffset)
      ) {
        element.classList.add(obj.className);
      } else {
        element.classList.remove(obj.className);
      }
    }
  );
}

window.addEventListener('scroll', _checkAllObjects);


export function addAddingClassOnVisible(elements, className, topOffset = 50, bottomOffset = 150) {
  if (!elements) {
    return;
  }
  if (typeof elements[Symbol.iterator] === 'function') {
    elements.forEach(el => {
      observableObjects.push({
        element: el,
        className,
        topOffset,
        bottomOffset,
      });
    });
    _checkAllObjects();
    return;
  }
  observableObjects.push({
    element: elements,
    className,
    topOffset,
    bottomOffset,
  });
  _checkAllObjects();
}
