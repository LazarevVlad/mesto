const router = require("express").Router();
const path = require("path");
const userPath = path.join(__dirname, "../data/users.json");
const users = require(userPath);

function getUser(val) {
  return users.find((user) => {
    return user._id === val;
  });
}

router.get("/", (req, res, next) => {
  res.send(users);
  next();
});

router.get("/:_id", (req, res, next) => {
  const user = getUser(req.params._id);
  // console.log(req.params._id);
  // console.log(user);
  if (user) {
    res.send(user);
    return;
  }
  res.status(404);
  res.send({ message: "Нет пользователя с таким id" });
  next();
});
module.exports = router;
