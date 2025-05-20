import Livre from "./livre.js";

class LivrePapier extends Livre {
  constructor(title, author, year, nombrePages) {
    super(title, author, year);
    this.nombrePages = nombrePages;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("book", "book-paper");
    div.innerHTML = `
      <h2>${this.title}</h2>
      <p>Auteur: ${this.author}</p>
      <p>Année: ${this.year}</p>
      <p>Nombre de pages: ${this.nombrePages}</p>
      <button class="delete-button">Supprimer</button>
    `;
    return div;
  }
}

export default LivrePapier;