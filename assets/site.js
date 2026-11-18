// Full-size image view, study page contents and back-to-top. The site works without this file.
(function () {
  // full-size images: each one is a plain link, this opens it in place
  var zooms = [].slice.call(document.querySelectorAll('a.zoom'));
  if (zooms.length && window.HTMLDialogElement) {
    var box = document.createElement('dialog');
    box.className = 'lightbox';
    box.setAttribute('aria-label', 'Full-size image');
    box.innerHTML = '<button class="lb-btn lb-close" type="button">Close</button>' +
      '<button class="lb-btn lb-prev" type="button">Previous</button><button class="lb-btn lb-next" type="button">Next</button>' +
      '<div class="lb-inner"><img alt=""><p></p></div>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('p'), at = 0;
    var show = function (i) {
      at = (i + zooms.length) % zooms.length;
      img.src = zooms[at].getAttribute('href');
      img.alt = zooms[at].querySelector('img').alt;
      cap.textContent = zooms[at].getAttribute('data-caption') || '';
    };
    zooms.forEach(function (a, i) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); show(i); box.showModal(); });
    });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lb-prev').addEventListener('click', function () { show(at - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(at + 1); });
    if (zooms.length < 2) { box.querySelector('.lb-prev').hidden = true; box.querySelector('.lb-next').hidden = true; }
    box.addEventListener('click', function (ev) { if (ev.target === box || ev.target.className === 'lb-inner') box.close(); });
    box.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') show(at + 1);
      if (ev.key === 'ArrowLeft') show(at - 1);
    });
    box.addEventListener('close', function () { img.removeAttribute('src'); zooms[at].focus(); });
  }

  // study page contents: always open on wide screens, marks the section being read
  var toc = document.querySelector('details.toc');
  if (toc) {
    var wide = window.matchMedia('(min-width: 1281px)');
    var setOpen = function () { if (wide.matches) toc.open = true; };
    setOpen();
    wide.addEventListener('change', setOpen);
    toc.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A' && !wide.matches) toc.open = false;
    });
    if (window.IntersectionObserver) {
      var links = {};
      [].forEach.call(toc.querySelectorAll('a'), function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var seen = new IntersectionObserver(function (items) {
        items.forEach(function (it) {
          if (!it.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          links[it.target.id].setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '0px 0px -80% 0px' });
      Object.keys(links).forEach(function (id) { var h = document.getElementById(id); if (h) seen.observe(h); });
    }
  }

  // back to top on long pages
  if (document.documentElement.scrollHeight > window.innerHeight * 3) {
    var top = document.createElement('a');
    top.className = 'totop';
    top.href = '#content';
    top.textContent = '↑ Top';
    document.body.appendChild(top);
    var check = function () { top.classList.toggle('on', window.scrollY > window.innerHeight); };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }
})();
