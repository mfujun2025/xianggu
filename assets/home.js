/* 香菇.中国 - 首页文章分页渲染 */
(function () {
  var PER_PAGE = 12;
  var grid = document.getElementById("article-grid");
  var pager = document.getElementById("pagination");
  var counter = document.getElementById("article-count");
  if (!grid || !pager) return;

  var articles = (typeof SITE_ARTICLES !== "undefined") ? SITE_ARTICLES : [];

  function getPage() {
    var m = (window.location.search || "").match(/[?&]page=(\d+)/);
    var p = m ? parseInt(m[1], 10) : 1;
    if (isNaN(p) || p < 1) p = 1;
    return p;
  }

  function setPage(p) {
    var totalPages = Math.max(1, Math.ceil(articles.length / PER_PAGE));
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    var url = new URL(window.location.href);
    if (p === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", String(p));
    }
    window.history.replaceState({}, "", url.toString());
    render(p);
    window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
  }

  function badgeClass(tag) {
    if (tag === "行情") return "badge-hot";
    if (tag === "技术") return "badge-new";
    return "badge-mid";
  }

  function render(page) {
    var totalPages = Math.max(1, Math.ceil(articles.length / PER_PAGE));
    if (counter) {
      counter.textContent = "共 " + articles.length + " 篇 · 第 " + page + " / " + totalPages + " 页";
    }
    grid.innerHTML = "";
    var start = (page - 1) * PER_PAGE;
    var end = Math.min(start + PER_PAGE, articles.length);
    for (var i = start; i < end; i++) {
      var a = articles[i];
      var card = document.createElement("div");
      card.className = "article-card";
      card.innerHTML =
        "<div class='card-body'>" +
        "<div class='card-meta'>" + a.date + " <span class='badge " + badgeClass(a.tags[0]) + "'>" + a.tags[0] + "</span></div>" +
        "<h3><a href='/articles/" + a.slug + ".html'>" + a.title + "</a></h3>" +
        "<p class='card-excerpt'>" + a.excerpt + "</p></div>";
      grid.appendChild(card);
    }

    // 分页控件
    pager.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "pager-inner";

    var prev = document.createElement("button");
    prev.className = "pager-btn" + (page <= 1 ? " disabled" : "");
    prev.textContent = "上一页";
    prev.disabled = page <= 1;
    prev.onclick = function () { if (page > 1) setPage(page - 1); };
    wrap.appendChild(prev);

    var nums = document.createElement("span");
    nums.className = "pager-nums";
    var from = Math.max(1, page - 2);
    var to = Math.min(totalPages, page + 2);
    if (from > 1) {
      nums.appendChild(numBtn(1, page));
      if (from > 2) nums.appendChild(ellipsis());
    }
    for (var n = from; n <= to; n++) {
      nums.appendChild(numBtn(n, page));
    }
    if (to < totalPages) {
      if (to < totalPages - 1) nums.appendChild(ellipsis());
      nums.appendChild(numBtn(totalPages, page));
    }
    wrap.appendChild(nums);

    var next = document.createElement("button");
    next.className = "pager-btn" + (page >= totalPages ? " disabled" : "");
    next.textContent = "下一页";
    next.disabled = page >= totalPages;
    next.onclick = function () { if (page < totalPages) setPage(page + 1); };
    wrap.appendChild(next);

    pager.appendChild(wrap);
  }

  function numBtn(n, current) {
    var b = document.createElement("button");
    b.className = "pager-num" + (n === current ? " active" : "");
    b.textContent = String(n);
    b.onclick = function () { setPage(n); };
    return b;
  }

  function ellipsis() {
    var s = document.createElement("span");
    s.className = "pager-ellipsis";
    s.textContent = "…";
    return s;
  }

  render(getPage());
})();
