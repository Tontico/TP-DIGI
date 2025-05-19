class Livre {
  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("book");
    div.innerHTML = `
      <h2>${this.title}</h2>
      <p>Auteur: ${this.author}</p>
      <p>Année: ${this.year}</p>
    `;
    return div;
  }

  addBookToList() {
    let bookListContainer = document.querySelector(".book-list");
    if (!bookListContainer) {
      bookListContainer = document.createElement("div");
      bookListContainer.classList.add("book-list");
      document.body.appendChild(bookListContainer);
    }
    bookListContainer.appendChild(this.render());
  }
}

export default Livre;
