import icons from 'url:../../img/icons.svg';

export default class views {
  _data;
  _errMsg = 'No recipes found for your query. Please try again!';
  _scsMsg = '';

  /**
   * render the received object to the DOM
   * @param {object | object[]} data the data to be rendered e.g (recipe)
   * @param {boolean}[render=true] if false create markup string insteade of rendering to the DOM
   * @returns {undefined | string} markup string if rende = falde
   * @author kira
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    // console.log(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements, newElements);

    newElements.forEach((elem, i) => {
      const curEl = curElements[i];

      if (!elem.isEqualNode(curEl) && elem.firstChild?.nodeValue.trim() !== '')
        curEl.textContent = elem.textContent;
      // console.log(curEl, elem.firstChild.nodeValue.trim());
      // curEl.innerHTML = elem.innerHTML;
      if (!elem.isEqualNode(curEl)) {
        Array.from(elem.attributes).forEach((attr, i) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpiner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    // console.log('spiner', markup);
  }

  renderError(msg = this._errMsg) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(msg = this._scsMsg) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
