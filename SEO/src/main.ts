/**
 * 优化：
 * 		1. 如果在生产环境非常臃肿，可以考虑控制导入。对依赖文件进行解构优化，便于构建工具进行 tree shaking 优化。
 * 		2. vite 关于按需导入使用的是 js 原生自持的方式。通常情况下：只会在利用路由的情况下使用。
 */
import { forEach } from "lodash";
import("./temp").then((data) => {
  console.log("vite import:", data);
});

let User = ["zhangsna", "lisi", "wangwu", "zhaoliu"];

forEach(User, (u) => {
  console.log(u);
});
