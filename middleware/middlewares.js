exports.cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
};

exports.setDefaultHeaders = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  next();
};
