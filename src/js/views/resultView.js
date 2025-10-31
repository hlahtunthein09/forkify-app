// import icons from "url:../../img/icons.svg";
// import { icons } from "../config.js";

import icons from "url:../../../public/icons.svg";
import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = "No recipe found for your query! Please try again 😅";
    _message = "";

    _generateMarkup()
        {
            // console.log("this._data: ", this._data);
            return this._data.map(result => previewView.render(result, false)).join();
        }
}

export default new ResultsView();