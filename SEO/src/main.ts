/**
 * 优化：
 * 		1. 如果在生产环境非常臃肿，可以考虑控制导入。对依赖文件进行解构优化，便于构建工具进行 tree shaking 优化。
 */
import { forEach } from "lodash";

let User = ["zhangsna", "lisi", "wangwu", "zhaoliu"];

forEach(User, (u) => {
  console.log(u);
});
