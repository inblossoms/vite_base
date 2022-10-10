# Vite

## vite

1. 什么是构建工具？构建工具就是，帮我们追踪文件内容的一系列变化，辅助项目构建并自动进行解析、编译到最终可以被兼容并使用的工具；

2. 相对于 webpack 的优势？在大型项目中，由于需要处理的Javascript代码呈指数级的增长，也就导致了webpack在初始化构建时会带来时间上迟钝的反馈效果，因此极大的影响了开发者的开发效率和体验感；这主要和webpack 的工作流程有关。

3. webpack 的工作流程：会在执行的开始时，就通过入口文件将所有的依赖等数据进行解析构建，直到所有信息构建完毕。

4. webpack 是否可以改动像 vite 一样？不可以， webpack是一个支持多模块化的工具,他一开始必须要统一模块化代码, 所以意味着他需要将所有的依赖全部读一遍，而vite只支持ejs模块化机制，违背了webpackl的理念；

   ```js
   // webpack 怎样对多模块进行解析的？
   (funciton (modules){
   	funciton webpack_require(){}
     // 入口是index.js
     // 通过webpack的配置文件得来的: webpack.config.js ./src/index.js
   	modules[entry](webpack_require)
   })(
   {
     "./src/index.js": (webpack_require) => {
           const lodash = webpack_require("lodash");
           const Vue = webpack_require("vue");
       }
   }
   )
   ```

5. create vite 和 vite 的关系：create vite内置了vite，它是内置于node_module内的指令配置 ；

6. 为什么vite不支持非绝对相对路径得访问，去提前加载node_module中的内容？

   - 由于vite支持的是ejs，而ejs需要在浏览器环境才能运行，并不能像cjs一样运行在服务端，这将导致如果去加载node_module中内容则需要大量时间去建立关系图谱；

## vite 预加载机制

- vite 首先会按照用户自定义的入口文件中所引用的依赖调用esbuild (对js语法进行处理的库)，将各种规范的代码转换成ejs规范。然后将转换后的代码放置在当前目录下的 node_modules/.vite/deps 文件中，同时对ejs规范的各个模块进行统一集成，按照用户自定义的出口进行文件输出。

  ```js
  // a.js
  export default function a(){}
  
  // index.js  entry
  export {default as a} form "./a.js"
  // 上一行等同于：
  import a form "./a.js"
  export const a = a
  
  // vite 对模块进行统一集成，重写
  function a (){}
  ```

- 在处理过程中当查询到有非绝对或相对路径的引用，vite 会尝试进行路劲补充：

  ```js
  // a.js 
  import _ from "/node_modules/.vite/loadsh";
  
  // ------ 不妨碍loadsh中引用了其他三方
  // 此时vite 就会尝试进行路径补充，我们可以在控制台看到：
  import __vite__cjsImport0_loadsh from "node_modules/.vite/deps/loadsh.js?v=ebe57916"
  ```

  - **Tip:** 找寻依赖的过程是自当前目录依次向上查找的过程, 直到搜寻到根目录或者搜寻到对应依赖为止 /user/node_modules/lodash, ../

- 预构建的过程是在开发环境中执行的，vite 对于生产环境会使用rollup去打包；

- 解决的问题：

  1. 不同的三方包会有不同的导出格式，这个在路径处理的问题上同时得到了解决；
  2. 对路径的处理上直接使用了 ./vite/deps，方便了路径的重写；
  3. 网络多包传输的性能问题(也是原生esmodule规范不敢支持node_modules的原因之一), 有了依赖预构建以后无论有多少的额外export 和import, vite都会尽可能的将他们进行集成最后只生成一个或者几个模块；
