const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const isAdmin = require("../middleware/isAdmin");
const { getPaginatedResults } = require("../config/utils");
const { ERROR_500 } = require("../config/message");
router.get("/", async (req, res) => {
  try {
    let { perPage, page, sort, search } = req.query;
    const results = await getPaginatedResults({
      model: "JobContract",
      page: page ?? 1,
      perPage: perPage ?? 10,
      sort,
    });
    res.send(results);
  } catch (e) {
    res.status(500).send({ message: [ERROR_500] });
  }
});

module.exports = router;
