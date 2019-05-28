// Book Class : Represent a Book

class Book {

  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}

// UI Class : Handle UI Tasks

class UI {

  static displayBooks(){
    //pretend that this a local storage

    const books = Store.getBooks();
    books.forEach(function(book, i, array){
      UI.addBookToList(book);
    });

  }

  static addBookToList(book){

    const list = document.querySelector("#book-list");
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sml delete">X</a></td>
    `;
    list.appendChild(row);

  }

  static showAlert(message, className){

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    const div = document.createElement('div');// the new element
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1500);

  }

  static emptyStack(){

    const table = document.querySelector(".table")
    const container = document.querySelector('.container');
    const span = document.createElement('span');
    span.className = "empty-stack";
    span.appendChild(document.createTextNode("Empty Stack"));
    container.appendChild(span);

  }

  static clearFields(){

    document.querySelector('#title').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#isbn').value = "";

  }

  static deleteBook(e_target){

    if(e_target.classList.contains("delete")){
      e_target.parentElement.parentElement.remove(); //simply remove it from the dom
    }
  }

}

// Store Class : Handles Storage

class Store { // dealing with cache

  static getBooks(){

    let books;

    if(localStorage.getItem("books") === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static removeBook(isbn){

    const books = Store.getBooks();

    books.forEach(function(book, i, array){
      if(book.isbn == isbn){
        books.splice(i, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

}

// Event : Check for books

const books = Store.getBooks();

if(books.length == 0){
  UI.emptyStack();
}

// Event : Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks());
// Event : Add a book

document.querySelector('#book-form').addEventListener('submit', (e) => {
  //prevent actual submit
  e.preventDefault(); // so that we can follow console.log 
  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Instatiate book

  if(title === '' || isbn === '' || author === ''){
    UI.showAlert("Please fill in all fields", "danger");
  }else{

    const book = new Book(title, author, isbn);

    //now we add the book to our UI (list) using static method addBookToList

    // add book to list (UI)
    UI.addBookToList(book);

    // add book to store (chache)
    Store.addBook(book);

    //show success message(alert)
    UI.showAlert("The Book has been added", "success");

    //clear input(fields)
    UI.clearFields();

    const span = document.querySelector('.empty-stack');
    span.remove();

  }

});

// Event ; Remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{

  //remove book from UI
  UI.deleteBook(e.target);

  // remove book from localStorage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert("The Book has been Deleted", "success");

  UI.emptyStack();

});
