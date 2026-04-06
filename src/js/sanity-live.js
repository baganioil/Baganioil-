(function () {
  'use strict';

  var PROJECT_ID = 'c7mgn6k7';
  var DATASET = 'production';
  var API_VER = '2024-01-01';

  function sanityFetch(query) {
    var url = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v' + API_VER + '/data/query/' + DATASET + '?query=' + encodeURIComponent(query);
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.result; });
  }

  function reInitWow() {
    if (typeof WOW !== 'undefined') new WOW({ offset: 0 }).init();
  }

  // ── NEWS LISTING ────────────────────────────────────────────────────────────
  function initNews() {
    var grid = document.getElementById('sanity-news-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="col-12 text-center py-5"><p style="color:#aaa">Loading articles...</p></div>';

    sanityFetch('*[_type == "article"] | order(date desc) { "slug": slug.current, title, date, "image": image.asset->url, excerpt }')
      .then(function (articles) {
        if (!articles || !articles.length) {
          grid.innerHTML = '<div class="col-12 text-center py-5"><p style="color:#888">No articles published yet.</p></div>';
          return;
        }
        grid.innerHTML = articles.map(function (a, i) {
          var delay = (i % 3) * 0.2;
          var img = a.image || '/images/post-1.jpg';
          var href = '/news/article/?s=' + encodeURIComponent(a.slug);
          return '<div class="col-lg-4 col-md-6">' +
            '<div class="post-item wow fadeInUp" data-wow-delay="' + delay + 's">' +
              '<div class="post-featured-image"><figure>' +
                '<a href="' + href + '" class="image-anime" data-cursor-text="View">' +
                  '<img src="' + img + '" alt="' + (a.title || '') + '">' +
                '</a>' +
              '</figure></div>' +
              '<div class="post-item-body">' +
                '<div class="post-item-content">' +
                  (a.date ? '<p class="post-date">' + a.date + '</p>' : '') +
                  '<h2><a href="' + href + '">' + (a.title || 'Untitled') + '</a></h2>' +
                  (a.excerpt ? '<p class="post-excerpt">' + a.excerpt + '</p>' : '') +
                '</div>' +
                '<div class="post-readmore-btn"><a href="' + href + '">Read more</a></div>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        reInitWow();
      })
      .catch(function () {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p style="color:#888">Could not load articles.</p></div>';
      });
  }

  // ── NEWS ARTICLE (single, client-side) ─────────────────────────────────────
  function initNewsArticle() {
    var container = document.getElementById('sanity-article');
    if (!container) return;

    var slug = new URLSearchParams(window.location.search).get('s');
    if (!slug) {
      container.innerHTML = '<p style="text-align:center;padding:60px 0;color:#888">Article not found.</p>';
      return;
    }

    container.innerHTML = '<div style="text-align:center;padding:80px 0"><p style="color:#aaa">Loading article...</p></div>';

    sanityFetch('*[_type == "article" && slug.current == "' + slug.replace(/"/g, '') + '"][0] { title, date, "image": image.asset->url, excerpt, tags, body }')
      .then(function (article) {
        if (!article) {
          container.innerHTML = '<p style="text-align:center;padding:60px 0;color:#888">Article not found.</p>';
          return;
        }

        document.title = (article.title || 'Article') + ' | Bagani Oil';

        var bodyHtml = '';
        if (article.body && Array.isArray(article.body)) {
          bodyHtml = article.body.map(function (block) {
            if (block._type !== 'block' || !block.children) return '';
            var text = block.children.map(function (c) {
              var t = (c.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              if (c.marks && c.marks.indexOf('strong') > -1) t = '<strong>' + t + '</strong>';
              if (c.marks && c.marks.indexOf('em') > -1) t = '<em>' + t + '</em>';
              return t;
            }).join('');
            switch (block.style) {
              case 'h1': return '<h1>' + text + '</h1>';
              case 'h2': return '<h2>' + text + '</h2>';
              case 'h3': return '<h3>' + text + '</h3>';
              case 'blockquote': return '<blockquote><p>' + text + '</p></blockquote>';
              default: return text ? '<p class="wow fadeInUp">' + text + '</p>' : '';
            }
          }).join('');
        }

        var tagsHtml = '';
        if (article.tags && article.tags.length) {
          tagsHtml = '<div class="post-tag-links"><div class="post-tags wow fadeInUp"><span class="tag-links">Tags: ' +
            article.tags.map(function (t) { return '<a href="#">' + t + '</a>'; }).join('') +
            '</span></div></div>';
        }

        container.innerHTML =
          (article.image ? '<div class="post-image"><figure class="image-anime reveal"><img src="' + article.image + '" alt="' + (article.title || '') + '"></figure></div>' : '') +
          '<div class="post-content"><div class="post-entry">' +
            '<h1 class="wow fadeInUp">' + (article.title || '') + '</h1>' +
            (article.date ? '<p class="post-date wow fadeInUp">' + article.date + '</p>' : '') +
            (article.excerpt ? '<p class="wow fadeInUp"><strong>' + article.excerpt + '</strong></p>' : '') +
            bodyHtml +
          '</div>' + tagsHtml + '</div>';

        reInitWow();
      })
      .catch(function () {
        container.innerHTML = '<p style="text-align:center;padding:60px 0;color:#888">Could not load article.</p>';
      });
  }

  // ── PRODUCTS ───────────────────────────────────────────────────────────────
  function initProducts() {
    var grid = document.querySelector('.project-item-boxes');
    if (!grid) return;

    sanityFetch('*[_type == "product"] | order(line asc, name asc) { "slug": slug.current, name, line, category, spec, shortDesc, "image": image.asset->url }')
      .then(function (products) {
        if (!products || !products.length) return;

        grid.innerHTML = products.map(function (p, i) {
          return '<div class="col-lg-4 col-md-6 project-item-box ' + (p.category || '') + '">' +
            '<div class="product-card wow fadeInUp" data-wow-delay="' + ((i % 3) * 0.2) + 's">' +
              '<div class="product-image"><a href="/products/' + p.slug + '/">' +
                '<img src="' + (p.image || '') + '" alt="Bagani ' + p.name + '">' +
              '</a></div>' +
              '<div class="product-body">' +
                '<span class="product-line">' + (p.line || '') + '</span>' +
                '<h3>' + p.name + '</h3>' +
                '<p class="product-spec">' + (p.spec || '') + '</p>' +
                '<p class="product-desc">' + (p.shortDesc || '') + '</p>' +
              '</div>' +
              '<div class="product-footer">' +
                '<a href="/products/' + p.slug + '/">View Details <i class="fa-solid fa-arrow-right"></i></a>' +
              '</div>' +
            '</div></div>';
        }).join('');

        if (typeof $ !== 'undefined' && $.fn && $.fn.isotope) {
          setTimeout(function () {
            var $g = $(grid).isotope({ itemSelector: '.project-item-box', layoutMode: 'fitRows' });
            $('.product-categories ul li a').off('click.sanity').on('click.sanity', function (e) {
              e.preventDefault();
              $g.isotope({ filter: $(this).attr('data-filter') });
              $('.product-categories ul li a').removeClass('active-btn');
              $(this).addClass('active-btn');
            });
          }, 150);
        }

        reInitWow();
      });
  }

  // ── FAQs ───────────────────────────────────────────────────────────────────
  function initFaqs() {
    var acc1 = document.getElementById('faqaccordion1');
    var acc2 = document.getElementById('faqaccordion2');
    if (!acc1 && !acc2) return;

    sanityFetch('*[_type == "faq"] | order(order asc) { question, answer, category }')
      .then(function (faqs) {
        if (!faqs) return;

        var general = faqs.filter(function (f) { return f.category === 'general'; });
        var other = faqs.filter(function (f) { return f.category === 'product' || f.category === 'dealer'; });

        function buildAccordion(items, prefix, parentId) {
          if (!items.length) return '<p style="color:#888;padding:20px 0">No questions yet.</p>';
          return items.map(function (f, i) {
            return '<div class="accordion-item wow fadeInUp"' + (i > 0 ? ' data-wow-delay="' + (i * 0.2) + 's"' : '') + '>' +
              '<h2 class="accordion-header" id="heading' + prefix + (i + 1) + '">' +
                '<button class="accordion-button ' + (i > 0 ? 'collapsed' : '') + '" type="button" ' +
                  'data-bs-toggle="collapse" data-bs-target="#collapse' + prefix + (i + 1) + '" ' +
                  'aria-expanded="' + (i === 0 ? 'true' : 'false') + '">' +
                  f.question +
                '</button></h2>' +
              '<div id="collapse' + prefix + (i + 1) + '" class="accordion-collapse collapse ' + (i === 0 ? 'show' : '') + '" ' +
                'data-bs-parent="#' + parentId + '">' +
                '<div class="accordion-body"><p>' + f.answer + '</p></div>' +
              '</div></div>';
          }).join('');
        }

        if (acc1) acc1.innerHTML = buildAccordion(general, 'G', 'faqaccordion1');
        if (acc2) acc2.innerHTML = buildAccordion(other, 'P', 'faqaccordion2');
        reInitWow();
      });
  }

  // ── STORES ─────────────────────────────────────────────────────────────────
  function initStores() {
    if (!document.getElementById('store-map')) return;

    sanityFetch('*[_type == "store"] | order(city asc) { "slug": slug.current, name, address, city, phone, lat, lng }')
      .then(function (stores) {
        if (!stores || !stores.length) return;

        var label = document.querySelector('.section-label');
        if (label) label.textContent = stores.length + ' Stores Found';

        var tbody = document.querySelector('.product-specs-table tbody');
        if (tbody) {
          tbody.innerHTML = stores.map(function (s) {
            return '<tr>' +
              '<td><strong>' + s.name + '</strong></td>' +
              '<td>' + (s.address || '') + '</td>' +
              '<td>' + (s.city || '') + '</td>' +
              '<td style="white-space:nowrap">' + (s.phone ? '<a href="tel:' + s.phone + '">' + s.phone + '</a>' : '—') + '</td>' +
            '</tr>';
          }).join('');
        }

        // Refresh map markers if exposed globally
        if (typeof window.baganiRefreshMap === 'function') {
          window.baganiRefreshMap(stores);
        }
      });
  }

  // ── DISPATCH ───────────────────────────────────────────────────────────────
  var page = document.body.getAttribute('data-page');
  if (page === 'news') initNews();
  else if (page === 'news-article') initNewsArticle();
  else if (page === 'products') initProducts();
  else if (page === 'faqs') initFaqs();
  else if (page === 'stores') initStores();

})();
