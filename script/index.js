
import Membre from "./membre.js";
import Bibliothecaire from "./bibliothecaire.js";
import LivreNumerique from "./livreNumerique.js";
import LivrePapier from "./livrePapier.js";


class HomeInterface {
  constructor() {
    this.books = JSON.parse(localStorage.getItem("books")) || [];
    this.currentSection = null;
    this.typeUser = null;

    this.init();
  }

  init() {
    const selectUser = document.getElementById("user-select");
    if (selectUser) {
      selectUser.addEventListener("change", () => this.setupSelectUser());
    }

    const isNumericCheckbox = document.getElementById("isNumeric");
    if (isNumericCheckbox) {
      isNumericCheckbox.addEventListener("change", () =>
        this.toggleBookTypeFields()
      );
    }

    this.setupEventListeners();
    this.hideAllSections();
  }

  setupSelectUser() {
    const selectUser = document.getElementById("user-select");
    const userType = selectUser.value;

    if (userType === "membre") {
      this.typeUser = new Membre(userType);
    } else if (userType === "bibliothecaire") {
      this.typeUser = new Bibliothecaire(userType);
    } else {
      this.typeUser = null;
    }
    this.hideAllSections();
    this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    menu.style.display = "block";
    const menuItems = menu.querySelectorAll("li");

    menuItems.forEach((item) => {
      const action = item.getAttribute("data-action");

      if (this.typeUser instanceof Membre) {
        if (action === "display" || action === "find" || action === "leave") {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      } else if (this.typeUser instanceof Bibliothecaire) {
        item.style.display = "block";
      } else {
        menu.style.display = "none";
      }
    });
  }

  setupEventListeners() {
    const listItems = document.querySelectorAll("#menu li");
    listItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const action = event.target.getAttribute("data-action");

        listItems.forEach((li) => li.classList.remove("selected"));

        event.target.classList.add("selected");

        this.showSection(action);
      });
    });
    document
      .getElementById("add-book-btn")
      .addEventListener("click", () => this.addBooks());
    document
      .getElementById("search-term")
      .addEventListener("change", () => this.findBookByName());
    document
      .getElementById("delete-book-btn")
      .addEventListener("click", () => this.deleteBookByName());
    document
      .getElementById("confirm-leave")
      .addEventListener("click", () => this.leave());
    document
      .getElementById("cancel-leave")
      .addEventListener("click", () => this.hideAllSections());
  }

  showSection(sectionName) {
    this.hideAllSections();

    const section = document.getElementById(`${sectionName}-book-section`);
    if (section) {
      section.style.display = "block";
      this.currentSection = sectionName;

      if (sectionName === "display") {
        this.displayBooks();
      }
    } else if (sectionName === "leave") {
      document.getElementById("leave-section").style.display = "block";
    }
  }

  hideAllSections() {
    const sections = document.querySelectorAll(".section-container");
    sections.forEach((section) => {
      section.style.display = "none";
    });
  }

  toggleBookTypeFields() {
    const isNumeric = document.getElementById("isNumeric").checked;
    const sizeInputLabel = document.querySelector("label[for='size']");
    const sizeInput = document.getElementById("size");

    if (isNumeric) {
      sizeInputLabel.textContent = "Taille du fichier (Mo) :";
      sizeInput.placeholder = "Entrez la taille du fichier en Mo";
    } else {
      sizeInputLabel.textContent = "Nombre de pages :";
      sizeInput.placeholder = "Entrez le nombre de pages";
    }
  }

  addBooks() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const year = document.getElementById("year").value.trim();
    const isNumeric = document.getElementById("isNumeric").checked;
    const size = document.getElementById("size").value.trim();
    const messageElement = document.getElementById("add-book-message");

    if (!title) {
      messageElement.textContent = "Le titre du livre ne peut pas être vide.";
      messageElement.style.color = "red";
      return;
    }

    if (!author) {
      messageElement.textContent = "L'auteur du livre ne peut pas être vide.";
      messageElement.style.color = "red";
      return;
    }

    if (!year) {
      messageElement.textContent =
        "L'année de publication ne peut pas être vide.";
      messageElement.style.color = "red";
      return;
    }

    if (!size) {
      messageElement.textContent = isNumeric
        ? "La taille du fichier ne peut pas être vide."
        : "Le nombre de pages ne peut pas être vide.";
      messageElement.style.color = "red";
      return;
    }

    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    const duplicateBook = existingBooks.find(
      (book) => book.title.trim().toLowerCase() === title.toLowerCase()
    );

    if (duplicateBook) {
      messageElement.textContent = `Un livre intitulé "${title}" existe déjà dans la bibliothèque.`;
      messageElement.style.color = "red";
      return;
    }

    let book;
    if (isNumeric) {
      book = new LivreNumerique(title, author, year, size);
    } else {
      book = new LivrePapier(title, author, year, size);
    }
    const bookData = {
      title,
      author,
      year,
      isNumeric,
      size,
      id: book.id,
    };

    this.books.push(bookData);
    localStorage.setItem("books", JSON.stringify(this.books));
    if (
      !window.confirm(
        "Livre ajouté avec succès ! Voulez-vous en ajouter d'autre  ?"
      )
    ) {
      this.hideAllSections();
    }
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    document.getElementById("size").value = "";
    this.currentSection.style.display = "none";
  }

  displayBooks() {
    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    this.clearContainer();
    if (existingBooks.length > 0 || this.books.length > 0) {
      this.books = existingBooks.reverse();
      this.books.forEach((book) => {
        let newBook;
        if (book.isNumeric) {
          newBook = new LivreNumerique(
            book.title,
            book.author,
            book.year,
            book.size
          );
        } else {
          newBook = new LivrePapier(
            book.title,
            book.author,
            book.year,
            book.size
          );
        }
        newBook.addBookToList();
        this.checkUserForEmprunt(book);
      });
    } else {
      alert("Aucun livre trouvé dans la liste.");
    }
  }

  findBookByName() {
    const searchTerm = document.getElementById("search-term").value.trim();
    const resultsContainer = document.querySelector(".book-search-results");

    if (!searchTerm) {
      resultsContainer.innerHTML =
        "<p>Veuillez entrer un titre à rechercher.</p>";
      return;
    }
    this.clearContainer();

    const foundBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundBooks.length > 0) {
      foundBooks.forEach((book) => {
        let newBook;
        if (book.isNumeric) {
          newBook = new LivreNumerique(
            book.title,
            book.author,
            book.year,
            book.size
          );
        } else {
          newBook = new LivrePapier(
            book.title,
            book.author,
            book.year,
            book.size
          );
        }
        const bookElement = newBook.render();
        resultsContainer.appendChild(bookElement);
        this.checkUserForEmprunt(book); 
      });
    } else {
      alert("Aucun livre trouvé avec ce titre.");
    }
  }

  checkUserForEmprunt(book) {
    if (this.typeUser instanceof Membre) {
      const deleteButton = document.querySelector(".delete-button");
      if (deleteButton) {
        const empruntButton = document.createElement("button");
        empruntButton.classList.add("emprunt-button");
        empruntButton.textContent = "Emprunter";

        const dejaEmprunte = this.typeUser.livresEmpruntes.some(
          (livre) => livre.title === book.title && livre.author === book.author
        );

        if (dejaEmprunte) {
          empruntButton.disabled = true;
          empruntButton.textContent = "Déjà emprunté";
          empruntButton.classList.add("deja-emprunte");
        } else {
          empruntButton.addEventListener("click", () =>
            this.emprunterLivre(book)
          );
        }

        deleteButton.parentNode.replaceChild(empruntButton, deleteButton);
      }
    }
    if (this.typeUser instanceof Bibliothecaire) {
      this.deleteBookLists();
    }
  }

  emprunterLivre(book) {
    const livreEmprunte = {
      title: book.title,
      author: book.author,
      year: book.year,
      isNumeric: book.isNumeric,
      size: book.size,
      id: Date.now(),
    };

    this.typeUser.louerLivre(livreEmprunte);
    alert(`Vous avez emprunté "${book.title}" avec succès !`);

    this.displayBooks();
  }

  deleteBookByName() {
    const searchTerm = document.getElementById("delete-term").value.trim();
    const resultsContainer = document.getElementById("delete-results");

    if (!searchTerm) {
      resultsContainer.innerHTML =
        "<p>Veuillez entrer un titre à supprimer.</p>";
      return;
    }

    const foundBooks = this.books.filter(
      (book) =>
        book.title.trim().toLowerCase() === searchTerm.trim().toLowerCase()
    );
    if (foundBooks.length > 0) {
      if (
        confirm(`Êtes-vous sûr de vouloir supprimer le livre "${searchTerm}" ?`)
      ) {
        this.books = this.books.filter(
          (book) =>
            book.title.trim().toLowerCase() !== searchTerm.trim().toLowerCase()
        );
        localStorage.setItem("books", JSON.stringify(this.books));
        alert("Livre supprimé avec succès !");
        this.displayBooks();
      }
    } else {
      alert("Aucun livre trouvé avec ce titre.");
    }
  }

  deleteBookLists() {
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookTitle = button.parentElement.querySelector("h2").textContent;
        if (
          confirm(
            `Êtes-vous sûr de vouloir supprimer le livre "${bookTitle}" ?`
          )
        ) {
          this.books = this.books.filter((book) => book.title !== bookTitle);
          localStorage.setItem("books", JSON.stringify(this.books));
          alert("Livre supprimé avec succès !");
          this.displayBooks();
        }
      });
    });
  }

  leave() {
    alert("Au revoir !");
    window.location.href = "index.html";
  }

  clearContainer() {
    const bookListContainer = document.querySelector(".book-list");
    if (bookListContainer) {
      bookListContainer.innerHTML = "";
    }
  }
}

new HomeInterface();
