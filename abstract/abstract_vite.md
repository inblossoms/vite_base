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

7. vite 是一个只支持cjs规范的工具，为什么node端在读vite.config.js文件时可以认识ejs？

   - 因为vite他在读取vite.config.js的时候会率先通过node去解析文件语法, 如果发现你是esmodule规范会直接将esmodule规范进行替换变成commonjs规范；

8. 浏览为什么可以识别 .vue 文件？

   - vite 会将文件事先转换成字符串，浏览器回根据设置的 "Content-Type" 来对 .vue 文件解析。
   - 关于 .vue 文件，vite 会调用底层方法：vue.createElement() ，在 ast 语法分析的基础上构建原生dom。

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

## vite.config.js 

1. vite.config.js 语法提示

   - 导入 `import { defineConfig } from "vite";` ，通过 defineConfig 将配置参数进行包裹：`export default defineConfig ({ ... })`。

   - 通过类型标注的方式：

     ```js
     /** @type import("vite").UserConfig */
     const viteConfig = {
       optimizeDeps: {
     		exclude: []
       }
     }
     
     export default viteConfig;
     ```

2. 生产和开发环境的区分：

   - defineConfig() 可以接收一个函数，而函数的参数 `commad` 中可以拿到我们运行的一个参数，vite 通过我们运行指令所带参数来辨别是生产还是开发环境；

     ```js
     // vite.config.js
     export default defineConfig(({ command }) => {
       console.log(command)
       return envResolver[command]();
     });
     ```

   - 模块化构建，分别构建不同状态、环境下的配置文件：

     - `vite.base.config`、`vite.dev.config`、`vite.prod.config`;

     - 构建完整的配置文件：

       ```js
       import { defineConfig } from "vite";
       import viteBaseConfig from "./vite.base.config";
       import viteProdConfig from "./vite.prod.config";
       import viteDevConfig from "./vite.dev.config";
       
       const envResolver = {
         build: () => Object.assign({}, viteBaseConfig, viteProdConfig),
         serve: () => Object.assign({}, viteBaseConfig, viteDevConfig),
       };
       
       export default defineConfig(({ command }) => {
         return envResolver[command]();
       });
       ```


## vite 环境变量配置

- vite 对于 .env 的环境配置文件内置了 dotenv 的三方库。
- dotenv 会自动读取 .env 文件，去解析文件中所对应的变量并将其注入到 process 对象下。（但是，vite 考虑到和其他配置的一些冲突问题，所以不会直接注入到 process 对象下。）由于新配置可能会被配置 envDir文件，这将会导致我们在导入config文件时，对导入的env产生冲突。

- 涉及 vite.config.js 中的一些配置：

  - root
  - envDir：用来配置当前环境变量的文件地址

- vite 对 .env 的处理方式：vite 给我们提供了一些补偿措施，可以通过调用vite的loadEnv来手动确认env文件；

  - process.cwd：process上的一个方法，返回当前node进程的工作目录

    ```js
    // vite.config.js
    import {loadEnv} from "vite"
    
    export default defineConfig(({command, mode}) => {
      // 第二个参数：当前env文件所在的目录（可以将当前地址以字符串的形式贴到参数位置），第三个参数时 .env 的文件名,默认值就是 '.env'
      const env = loadEnv(mode, process.cwd(), '.env')
      return envResolver[command]();
    });
    ```

- **服务端对** 环境变量的使用：

  - .env: 所有环境都需要用到的环境变量
  - .env.development: 开发环境需要用到的环境变量(默认情况下vite将我们的开发环境取名为development) 
  - .env.production: 生产环境需要用到的环境变量(默认情况下vite将我们的生产环境取名为production)

- vite 在对 env 文件是如何判别使用哪种环境的文件的？

  - 我们在执行启动命令时会将mode设置为参数传递进来：`pnpm dev --mode production`

- 在调用 loadenv 的时候，vite 会执行如下程序：

  - 找到工程目录下的 .env 文件不解释，并解析其中的环境变量 并放进一个对象里

  - 会将传进来的 mode 变量的值进行拼接: `.env[mode] => .env.development`, 根据我们提供的目录去取对应的配置文件并进行解析, 并放进一个对象。

  - 我们可以理解为：

    ```js
     const baseEnvConfig = 读取.env的配置
     const modeEnvConfig = 读取env相关配置
     const lastEnvConfig = { ...baseEnvConfig, ...modeEnvConfig }
    ```

- **客户端对** 环境变量的使用：如果是客户端, vite会将对应的环境变量注入到 import.meta.env 里去；https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
  - 在访问 import.meta.env，为了防止我们将隐私性的变量直接送进import.meta.env中vite对参数做了拦截（默认值显示以 VITE_ 开头的参数），如果配置的环境变量不是以 VITE_ 开头的, 他就不会将配置文件中的参数注入到客户端中去, 如果我们需要更改这个前缀, 可以去使用envPrefix配置
  - 关于 envPrefix：https://cn.vitejs.dev/config/shared-options.html#envprefix

##　vite对于css的支持：

- vite 底层会对 css 文件存在天然地支持：

  1. vite在读取到main.js中引用到了Index.css，会直接去使用 fs 模块读取 index.css 中文件内容做字符串的转化；

  2. 创建一个style标签的同时, 将转化成字符串的 index.css 文件内容 copy 进style标签里；

  3. vite 会将 style 标签插入到 index.html 的 head 中，该 css 文件中的内容直接替换为 js 脚本(方便热更新或者css模块化), 同时设置 Content-Type 为 js 脚本从而让浏览器以 js 脚本的形式来执行该css后缀的文件，从而使得样式生效；

- vite 对于 css 的模块化构建:

  - 思考一个问题：在早期的 js 中，我们为了避免命名冲突问题产生了多种方法，其中模块化方法成为了现在最佳的方式。vite 在关于 css 文件的处理同样做到了这一点：
    - 由于我们无法避免引入的文件是否会存在命名冲突问题而导致样式覆盖问题，vite 关于 css 文件的模块化构建随着产生：**css module**。

  - 什么是 css module?

    1. 我们要知道 vite 对于文件的处理是依赖于 node 环境的，当我们的样式文件以 `style.module.css` 的方式来命名时，则会触发 vite 关于 css 模块化构建。（module是一种约定, 代表着 css 的模块化开启）；

    2. vite 会将解析到的 css 类名（其他样式选择器类似）进行替换，以 **类名 + hash值** 的方式来避免命名冲突的问题，并映射成键值对对象 { style: "_style_i22st_1" }

    3. 通过类名替换后的内容，此时 css 文件依旧是一个字符串；
    4. 接下来就是 vite 对 css 文件的处理过程了。

## css 配置流程篇：

### module options：

- `localsConvention: "camelCaseOnly"`,  	// 修改生成的配置对象的 key 的展示形式 (驼峰  或者 中划线形式)。

- `scopeBehaviour: "local"`,     // 配置当前的模块化行为是模块化还是全局化 (有hash就是开启了模块化的一个标志, 因为他可以保证产生不同的hash值来控制我们的样式类名不被覆盖)。

- *`generateScopedName: "[name]_[local]_[hash:5]"`,     // https://github.com/webpack/loader-utils#interpolatename。

- `hashPrefix: "hello"`,     // 生成 hash 会根据样式 **类名 + 一些其他的字符串**(文件名 + 文件内部随机生成一个字符串) 进行生成, 如果想要生成 hash 更加复杂,可以配置 **hashPrefix** 参数。

  -  `hashPrefix`：该配置的这个字符串会参与到最终的 hash 生成（字符串的不同决定了 hash 值得不同）。

-  `globalModulePaths: ["./componentB.module.css"]`,     //  所指路劲不参与到 css 模块化的解析规则。

  ```js
  modules: {
    localsConvention: "camelCaseOnly",
    scopeBehaviour: "local",
    generateScopedName: "[name]_[local]_[hash:5]",
    // generateScopedName: (name, filename, css) => {
    //     // name -> 代表的是你此刻css文件中的类名
    //     // filename -> 是你当前css文件的绝对路径
    //     // css -> 给的就是你当前样式
    //     console.log("name", name, "filename", filename, "css", css); // 这一行会输出在哪？？？ 输出在node
    //     // 配置成函数以后, 返回值就决定了他最终显示的类型
    //     return `${name}_${Math.random().toString(36).substr(3, 8) }`;
    // }
    hashPrefix: "inblossoms",
    globalModulePaths: ["./src/css/box.module.less"],
  },
  ```


### preprocessorOptions options：

> **option address** ：https://cn.vitejs.dev/config/shared-options.html#css-preprocessoroptions
>
> - css 的预处理器：scss、**less**、stylus； 
>
> 🌈 出于 less 本身是由 JavaScript 编写的，简化了配置的设置发杂度，我们下面就以 less 为例，其他处理器等同。

**参数类型**： `Record<string, object>`，key（预处理器） + config（用户配置参数） 的形式。

1. 安装 `pnpm i less -D` less 环境，不介意安装全局环境只需在项目安装该依赖即可；
2. 测试 less 的执行环境：`npx lessc filename.less`  ；

```js
preprocessorOptions: {
  less: { 
    // 整个的配置对象都会最终给到less的执行参数（全局参数）中去
  },
},
```

3. 此时我们已经可以在项目中使用 less 预处理器了。

**处理器配置参数：**

1. `math`：存在四种设置参数 

   Less 重新构建了数学选项，提供了以前的 strictMath 设置(始终需要括号)和默认设置(在所有情况下都执行数学)之间的一个特性。

   接下来，我们来看一下不同参数产生的结果：

   ```css
   // .less 样式文件
   .container {
     width: 200px / 2;
     height: (200px / 2) ;
   }
   
   // 配置文件
   ...
   preprocessorOptions: {
     less: { 
       math: ""
     },
   },
   
   ```

   当 `math：""` 取默认值时，这里我们执行 `npx lessc filename.less` 来查看编译结果：

   ```css
   .container {
     width: 200px / 2; 							// math 在默认情况下不会处理这种方式
     height: 100px;
   }
   ```

   当 `math："always"` 时，这里我们执行 `npx lessc filename.less` 来查看编译结果：

   ```css
   .container {
     width: 100px;   
     height: 100px;
   }
   ```

   当我们取其他值时，可以在官网查看示例  https://lesscss.org/usage/#less-options-math。

2. `globalVars`：全局变量的引用，声明将被放置在基本的 Less 文件的顶部，这意味着它可以被使用，但是如果在样式文件中定义了这个变量，它就会被覆盖。

   在使用该参数前，我们来看一下日常工作中走进了哪些误区：

   - 大多数人在使用全部变量通常是这样的：

   ```css
   // global_params.less
   @mainColor: red;
   @mainFont: 16px;
   ```

   - 在多个不同的地方进行多次的文件导入，进而使用全局参数:

   ```css
   // a.less
   @import url("./global_params.less");
   // b.less
   @import url("./global_params.less");
   ```

   - **多次的导入为我们的工作带来了不必要的麻烦，也增加了代码的冗余**，其实在 less 早些版本我们就可以通过指令 `npx lessc ----math="always" filename.less` 来添加全局变量来为我们提供便捷。

   接下来，我们在配置项中来使用该参数：

   - 这样我们依旧可以按照 less 语法规范来继续使用全局变量，同时又不需要重复的引用

   ```cs
   preprocessorOptions: {
     less: {
       globalVars: {
         mainBackColor: "#008c8c50",
         mainFont: "18px",
       },
     },
   },
   ```

### devSourcemap：

🌈 类似于 js 中 source map，该配置的开启同样为 css 提供了语法错误的定位能力。默认为：`false`

### postcss：

vite 生态对 postcss 天生就有着友好的支持。它主要为 css 提供兼容性的工作，允许使用 js 插件做样式的转换。对于 css 的关系类似于 babel 和 javascript 的关系；postcss 接收一个 css 文件并提供 api，通过对文件建立相应的 ast 来分析、修改规则，使得其可以被多个插件利用做更多的事情。

中文文档： https://github.com/postcss/postcss/blob/HEAD/docs/README-cn.md

#### postcss 的前世今生：

首先我们先来了解一下 postcss 是做什么的。我们来想一个场景：有一天你和你的外国朋友一同到了一个陌生的环境，遇到一位说着一口方言的司机问你去哪？这时路边的行人为你做了翻译，而你又翻译给了你的朋友。而整个对话过程就类似 postcss 的工作流程，使得 css 文件最后执行不会出现无法识别的情况。

大多数人对 postcss 存在着一个误区：就是他们会认为 postcss 和 预处理器是类似的，但事实上 postcss 是建立在预处理器编译之后的基础上工作的，怎个工作流程会涉及很多的转换、编译、再处理。所以业内也就产生了一个新的说法，**postcss 是后处理器**。

**postcss 的使用：**

1. 安装依赖 `pnpm i postcss-cli postcss postcss-preset-env -D`
2. 创建描述文件 `postcss.config.js`





















