import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("BookDatabase", function () {

  async function deployFixture() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const BookDatabase = await hre.ethers.getContractFactory("BookDatabase");
    const bookDatabase = await BookDatabase.deploy();

    return { bookDatabase, owner, otherAccount };
  }

  it("Should count == 0", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

      const count = await bookDatabase.count();

      expect(count).eq(0);
  });

  it("Should add Book", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

      await bookDatabase.addBook({title:"Livro 1", year: 2019});

      const count = await bookDatabase.count();

      expect(count).eq(1);
  });

  it("Should edit Book", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

      await bookDatabase.addBook({title:"Livro 1", year: 2019});

      await bookDatabase.editBook(1, {title: "", year: 2018});

      const bookYear = (await bookDatabase.books(1)).year;

      expect(bookYear).eq(2018);
  });

  it("Should remove Book", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

      await bookDatabase.addBook({title:"Livro 1", year: 2019});

      await bookDatabase.removeBook(1);

      const count = await bookDatabase.count();

      expect(count).eq(0);
  });

  it("Should NOT remove Book", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

      const instance = bookDatabase.connect(otherAccount);

      await expect(instance.removeBook(1))
            .to
            .be
            .revertedWith("Voce nao possui permissao para acessar essa funcionalidade");
  });
});
