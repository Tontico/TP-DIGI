import Utilisateur from "./utilisateur.js";

class Bibliothecaire extends Utilisateur {
  constructor(nom) {
    super(nom);
    this.livresAjoutes = [];
  }

  ajouterLivre(livre) {
    this.livresAjoutes.push(livre);
    livre.addBookToList();
    return livre;
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("utilisateur", "bibliothecaire");

    let livresHTML = "";
    if (this.livresAjoutes.length > 0) {
      livresHTML = `
        <div class="livres-ajoutes">
          <h4>Livres ajoutés à la bibliothèque:</h4>
          <ul>
            ${this.livresAjoutes
              .map((livre) => `<li>${livre.title} (${livre.author})</li>`)
              .join("")}
          </ul>
        </div>
      `;
    } else {
      livresHTML = `<p>Aucun livre ajouté</p>`;
    }

    div.innerHTML = `
      <h3>${this.nom} - Bibliothécaire</h3>
      <p>ID: ${this.id}</p>
      ${livresHTML}
    `;

    return div;
  }
}

export default Bibliothecaire;
