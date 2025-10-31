import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    // Btn click event
    addHandlerClick(handler)
    {
        this._parentElement.addEventListener("click", function(e){
            const btn = e.target.closest(".btn--inline");
            if(!btn) return;

            const gotoPage = +btn.dataset.goto;

            handler(gotoPage);
        });
    }
    _generateMarkup()
    {
        const curPage = this._data.page;

        // Here, this._data = model.state.search passed from controller module.
        const numPages = Math.ceil(this._data.results.length / this._data.resultPerPage);

        // 1) Page 1, and there are OTHER pages
        if(curPage === 1 && numPages > 1)
        {
            // Next Btn
            return this._generateMarkupBtnNext(curPage);
        }
        
        // 3) Last Page
        if(curPage === numPages && numPages > 1)
        {
            // Prev Btn
            return this._generateMarkupBtnPrev(curPage);
        }

        // 4) Other Pages
        if(curPage < numPages)
        {
           return `
                ${this._generateMarkupBtnPrev(curPage)}
                ${this._generateMarkupBtnNext(curPage)}
            `;
        }
                
        // 2) Page 1, and there is NO other pages
        return "";
    }

    _generateMarkupBtnPrev(curPage)
    {
        return `
            <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            `;
    }

    _generateMarkupBtnNext(curPage)
    {
        return `
            <button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="#icon-arrow-right"></use>
                </svg>
            </button>
            `;
    }
}

export default new PaginationView();