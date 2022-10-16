import { add } from "./js/tools";
import "./js/wind_svg";
import "./js/images.js";
import "./js/box.js";
import "./css/index.css";
// import { name } from "@assets/json/user.json";
// import "./js/request";

const count = add(2, 3);
console.log("add : ", count);

fetch("api/users", {
  method: "post",
})
  .then((data) => {
    console.log("data", data);
  })
  .catch((error) => {
    console.log("error", error);
  });

/**
 * 优化：
 * 		1. 如果在生产环境非常臃肿，可以考虑控制导入。对依赖文件进行结垢优化，便于构建工具进行 tree shaking 优化。
 */
