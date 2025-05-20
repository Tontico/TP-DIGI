import Utilisateur from "./utilisateur.js";

class Membre extends Utilisateur {
  constructor(nom) {
    super(nom);
    this.livresEmpruntes = [];
  }

  louerLivre(livre) {
    this.livresEmpruntes.push(livre);
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("utilisateur", "membre");
    
    let livresHTML = '';
    if (this.livresEmpruntes.length > 0) {
      livresHTML = `
        <div class="livres-empruntes">
          <h4>Livres empruntés:</h4>
          <ul>
            ${this.livresEmpruntes.map(livre => `<li>${livre.title} (${livre.author})</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      livresHTML = `<p>Aucun livre emprunté</p>`;
    }

    div.innerHTML = `
      <h3>${this.nom}</h3>
      <p>ID: ${this.id}</p>
      ${livresHTML}
    `;
    
    return div;
  }
}

export default Membre;