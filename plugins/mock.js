const fs = require("fs");
const path = require("path");

module.exports = function (options) {
  return {
    configureServer(server) {
      let mockData = getMockRes();

      server.middlewares.use((req, res, next) => {
        // console.log("req:", req.url);
        const matchItem = mockData.find((mockDerc) => mockDerc.url === req.url);

        if (matchItem) {
          const responseData = matchItem.response(req);
          console.log("response:", responseData);

          res.setHeader("Content-Type", "application/json");

          res.end(JSON.stringify(responseData));
        } else {
          next();
        }
      });
    },
  };
};

function getMockRes() {
  const mockStat = fs.statSync("mock");
  const isDirectory = mockStat.isDirectory();
  let mockData;
  if (isDirectory)
    mockData = require(path.resolve(process.cwd(), "mock/index.js"));

  console.log("getMockRes:", mockData);
  return mockData;
}
