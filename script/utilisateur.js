class Utilisateur {
  constructor(nom) {
    this.nom = nom;
    this.id = Date.now();
  }

  render() {
    const div = document.createElement("div");
    div.classList.add("utilisateur");
    div.innerHTML = `
      <h3>${this.nom}</h3>
      <p>ID: ${this.id}</p>
    `;
    return div;
  }
}

export default Utilisateur;