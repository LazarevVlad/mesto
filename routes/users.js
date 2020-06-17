const router = require("express").Router();
const fs = require("fs").promises;
const path = require("path");

const userPath = path.join(__dirname, "../data/users.json");
// const users = require(userPath);
const users = async () =>
  JSON.parse(await fs.readFile(userPath, { encoding: "utf-8" }));

const getUser = async (val) => (await users()).find((user) => user._id === val);

router.get("/", async (req, res, next) => {
  res.send(await users());
  next();
});

router.get("/:id", async (req, res, next) => {
  const user = await getUser(req.params.id);
  if (user) {
    res.send(user);
    return;
  }
  res.status(404);
  res.send({ message: "Нет пользователя с таким id" });
  next();
});
module.exports = router;
