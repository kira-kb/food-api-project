class searchView {
  #parentElement = document.querySelector('.search');
  #searchInput = this.#parentElement.querySelector('.search__field');

  getQuery() {
    const query = this.#searchInput.value;
    this.#searchInput.value = '';
    return query;
  }

  addHandleSearch(event) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      event();
    });
  }
}

export default new searchView();
