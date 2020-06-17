const router = require("express").Router();
const fs = require("fs").promises;
const path = require("path");

const cardsPath = path.join(__dirname, "../data/cards.json");
// const cards = require(cardsPath);
const cards = async () =>
  JSON.parse(await fs.readFile(cardsPath, { encoding: "utf-8" }));

router.get("/", async (req, res, next) => {
  try {
    res.send(await cards());
    next();
  } catch (err) {
    res.status(500).send({ message: "Что-то пошло не так" });
  }
});
module.exports = router;
