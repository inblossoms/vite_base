import { add } from "./js/tools";
// import "./js/request";
import "./js/images.js";
import "./js/box.js";
import "./css/index.css";
import { name } from "@assets/json/user.json";

const count = add(2, 3);
console.log("add : ", count);

console.log("JSON_File:", name);

/**
 * 优化：
 * 		1. 如果在生产环境非常臃肿，可以考虑控制导入。对依赖文件进行结垢优化，便于构建工具进行 tree shaking 优化。
 */
