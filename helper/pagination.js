const perPage = 5;
const limit = 7;
module.exports = {
  perPage,
  limit,
  init(page, total) {
    this.totalPage = Math.ceil(total / this.perPage);
    this.page = parseInt(page);
    if (page < 1) this.page = 1;
    else if (page > this.totalPage) this.page = this.totalPage;

    this.drop = (this.page - 1) * this.perPage;
    if(this.drop<0) this.drop = 0;
  },
  html() {
    this.startPage = this.page - Math.floor(this.limit / 2);
    this.endPage = this.page + Math.floor(this.limit / 2);
    if (this.startPage < 1) {
      this.startPage = 1;
      this.endPage = this.limit;
    } else if (this.endPage > this.totalPage) {
      this.endPage = this.totalPage;
      this.startPage = this.totalPage - this.limit + 1;
    }

    if (this.totalPage < this.limit) {
      this.startPage = 1;
      this.endPage = this.totalPage;
    }

    if (this.totalPage <= 1) return ``;

    let previous = `<li class="page-item ${
      this.page - this.limit >= 1 ? "" : "disabled"
    }"><a class="page-link" href="?page=${
      this.page - this.limit >= 1 ? this.page - this.limit : "1"
    }">Previous</a></li>`;

    let next = `<li class="page-item ${
      this.page + this.limit >= this.totalPage ? "disabled" : ""
    }"><a class="page-link" href="?page=${
      this.page + this.limit >= this.totalPage
        ? this.totalPage
        : this.page + this.limit
    }">Next</a></li>`;

    let listPage = "";
    for (let i = this.startPage; i <= this.endPage; i++) {
      listPage += `<li class="page-item ${
        i == this.page ? "active" : ""
      }"><a class="page-link" href="?page=${i}">${i}</a></li>`;
    }

    return `<div class="d-flex justify-content-center">
              <ul class="pagination">
                ${previous}
                ${listPage}
                ${next}
              </ul>
            </div>`;
  }
};

//  div.d-flex.justify-content-center
// ul.pagination
//  -for(let i = pagination.startPage; i <= pagination.endPage; i++){
//    if i == pagination.startPage
//      li.page-item.disabled
//        a.page-link(href='#') Previous
//    li.page-item(class=pagination.page==i?'active':'')
//      a.page-link(href='?page='+i)=i
//    if i == pagination.endPage
//     li.page-item
//        a.page-link(href='#') Next
//  -}
