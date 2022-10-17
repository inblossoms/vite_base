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
