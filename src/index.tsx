import "./styles/main.scss";

import * as ReactDOM from "react-dom";
import { SlotsApp } from "./SlotsApp";

const appContainer = document.createElement("section");
appContainer.setAttribute("class", "app-container");

document.body.appendChild(appContainer);

ReactDOM.render(<SlotsApp />, appContainer);
