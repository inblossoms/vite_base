const { Random } = require("mockjs");
const mockJs = require("mockjs");

const userList = mockJs.mock({
  "data|12": [
    {
      name: "@name",
      ename: Random.first(),
      "id|+1": 1,
      time: "@time",
      date: "@date",
    },
  ],
});

// console.log(userList);

module.exports = [
  {
    method: "post",
    url: "/api/users",
    response: ({ body }) => {
      return {
        code: 200,
        msg: "success",
        data: userList,
      };
    },
  },
];
