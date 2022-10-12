import box from "../css/box.module.less";

const oBox = document.createElement("div");

oBox.className = box.container;
oBox.textContent = "--ospan--";

document.body.appendChild(oBox);
