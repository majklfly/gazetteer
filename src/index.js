import { firstRender, updateRender } from "./js/renderOptions";

const latitude = localStorage.getItem("latitude");

latitude ? updateRender() : firstRender();