import Livre from "./livre.js";

class LivreNumerique extends Livre {
  constructor(title, author, year, tailleFichier) {
    super(title, author, year);
    this.tailleFichier = tailleFichier;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("book", "book-numeric");
    div.innerHTML = `
      <h2>${this.title}</h2>
      <p>Auteur: ${this.author}</p>
      <p>Année: ${this.year}</p>
      <p>Taille du fichier: ${this.tailleFichier} Mo</p>
      <button class="delete-button">Supprimer</button>
    `;
    return div;
  }
}

export default LivreNumerique;