// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BookDatabase {

    struct Book {
        string title;
        uint16 year;
    }

    uint32 private nextId = 0;
    mapping(uint32 => Book) public books;
    address private immutable owner;
    uint256 public count;

    constructor() {
        owner = msg.sender;
    }

    function addBook(Book memory newBook) public {
        nextId++;
        books[nextId] = newBook;

        count++;
    }

    function editBook(uint32 id, Book memory newBook) public {
        Book memory oldBook = books[id];

        if(!compare(oldBook.title, newBook.title) && !compare(newBook.title, "")) {
            books[id].title = newBook.title;
        }

        if(oldBook.year != newBook.year && newBook.year > 0) {
            books[id].year = newBook.year;
        }
    }

    function removeBook(uint32 id) public onlyAdmin {
       if(books[id].year > 0) {
            delete books[id];
            count--;
       }
    }


    function compare(string memory s1, string memory s2) private pure returns(bool) {
        bytes memory arr1 = bytes(s1);
        bytes memory arr2 = bytes(s2);
        
        return arr1.length == arr2.length && keccak256(arr1) == keccak256(arr2);
    }

    modifier onlyAdmin() {
        require(owner == msg.sender, "Voce nao possui permissao para acessar essa funcionalidade");
        _;
    }


}