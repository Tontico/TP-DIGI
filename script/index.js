import Livre from "./livre.js";

class HomeInterface {
  constructor() {
    this.books = JSON.parse(localStorage.getItem("books")) || [];
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const listItems = document.getElementsByTagName("li");
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].addEventListener("click", (event) => {
        for (let j = 0; j < listItems.length; j++) {
          listItems[j].classList.remove("selected");
        }
        listItems[i].classList.add(`selected`);

        this.handleAddHtml(i + 1);
      });
    }
  }

  handleAddHtml(index) {
    switch (index) {
      case 1:
        this.addBooks();
        break;
      case 2:
        this.displayBooks();
        break;
      case 3:
        this.findBookByName();
        break;
      case 4:
        this.deleteBookByName();
        break;
      case 5:
        this.leave();
        break;
      default:
        return false;
    }
  }

  addBooks() {
    const title = prompt("Entrez le titre du livre :");
    if (!title) {
      alert("Le titre du livre ne peut pas être vide.");
      return;
    }

    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    const duplicateBook = existingBooks.find(
      (book) => book.title.trim().toLowerCase() === title.trim().toLowerCase()
    );

    if (duplicateBook) {
      alert(`Un livre intitulé "${title}" existe déjà dans la bibliothèque.`);
      return;
    }
    const author = prompt("Entrez l'auteur du livre :");
    if (!author) {
      alert("L'auteur du livre ne peut pas être vide.");
      return;
    }
    const year = prompt("Entrez l'année de publication :");
    if (!year) {
      alert("L'année de publication ne peut pas être vide.");
      return;
    }

    const book = new Livre(title, author, year);
    this.books.push(book);
    localStorage.setItem("books", JSON.stringify(this.books));
    if (window.confirm("Livre ajouté avec succès ! Voulez-vous l'afficher ?")) {
      this.displayBooks();
    }
  }

  displayBooks() {
    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    this.clearContainer();
    if (existingBooks.length > 0 || this.books.length > 0) {
      this.books = existingBooks.reverse();
      return this.books.forEach((book) => {
        const newBook = new Livre(book.title, book.author, book.year);
        newBook.addBookToList();
      });
    } else {
      alert("Aucun livre trouvé dans la liste.");
    }
  }

  findBookByName() {
    const searchTerm = prompt("Entrez le titre du livre à rechercher :");
    if (!searchTerm) {
      alert("Veuillez entrer un titre.");
      return;
    }
    this.clearContainer();

    const foundBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundBooks.length > 0) {
      foundBooks.forEach((book) => {
        const newBook = new Livre(book.title, book.author, book.year);
        newBook.addBookToList();
      });
    } else {
      alert("Aucun livre trouvé avec ce titre.");
    }
  }

  deleteBookByName() {
    const searchTerm = prompt("Entrez le titre du livre à supprimer :");
    if (!searchTerm) {
      alert("Veuillez entrer un titre.");
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

  leave() {
    if (confirm("Voulez-vous vraiment quitter l'application ?")) {
      alert("Au revoir !");
      window.location.href = "index.html";
    }
  }

  clearContainer() {
    const bookListContainer = document.querySelector(".book-list");
    if (bookListContainer) {
      bookListContainer.innerHTML = "";
    }
  }
}

new HomeInterface();
