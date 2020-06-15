const router = require("express").Router();
const path = require("path");
const cardsPath = path.join(__dirname, "../data/cards.json");
const cards = require(cardsPath);

router.get("/", (req, res, next) => {
  res.send(cards);
  next();
});
module.exports = router;
