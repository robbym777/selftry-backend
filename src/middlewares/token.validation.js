// const axios = require("axios");
const jwt = require("jsonwebtoken");

const tokenValidation = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      const token = authorization.slice(7, authorization.length);
      jwt.verify(token, process.env.SECRET_KEY, (err) => {
        if (err) {
          res.sendStatus(401);
        } else {
          next();
        }
      });
      //   const result = await axios.get(``);
      //   if (result.data.status === "Token Valid") {
      //     next();
      //   } else {
      //     res.sendStatus(401);
      //   }
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = tokenValidation;
