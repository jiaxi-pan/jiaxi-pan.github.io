// Comment explorer for the AI illustration study. Numbers are Table 1 of the study.
(function () {
  var root = document.getElementById('explorer');
  if (!root) return;
  var LEVELS = [
    { name: 'Appreciative', def: 'The basic level, where audiences express admiration, enjoyment, or other positive reactions to the content.' },
    { name: 'Discursive', def: 'A deeper level in which audiences extend the content through observations, opinions, or discussion.' },
    { name: 'Instrumental', def: 'A more action-oriented level in which audiences aim to achieve a practical purpose, such as seeking information or resources, offering suggestions, or directing others to the content.' },
    { name: 'Participatory', def: 'The highest level, with audiences contributing creative content and becoming active participants in the community around the original post.' }
  ];
  var ROWS = [
    { n: 'Praise', l: 0, x: 43.20, i: 86.54, d: 'General positive responses expressing that they look good or appreciation for sharing, sometimes briefly mentioning aspects like color or composition.' },
    { n: 'Aesthetic and Content Discussion', l: 1, x: 18.07, i: 4.83, d: 'More detailed discussion of the style, techniques, or content, including preferences or votes for specific works.' },
    { n: 'Industry, Social, and Emotional Discussion', l: 1, x: 4.13, i: 1.38, d: 'Discussions of the industry, broader social issues, or the deeper emotional and psychological effects of the work.' },
    { n: 'AI Identification and Confusion', l: 1, x: 3.01, i: 1.04, d: 'Asking whether the images were AI-generated, showing uncertainty or unawareness about their AI origin, or expressing surprise at what AI can achieve.' },
    { n: 'AI Use (Negative)', l: 1, x: 1.20, i: 1.61, d: 'Expressing criticism of or opposition to the use of AI in the artwork.' },
    { n: 'AI Use (Positive)', l: 1, x: 0.69, i: 0.23, d: 'Expressing approval of or appreciation for the use of AI in the artwork.' },
    { n: 'Access Request', l: 2, x: 8.35, i: 0.52, d: 'Asking for the original image, requesting permission for non-commercial use, or indicating an intention to use the image.' },
    { n: 'Social Sharing', l: 2, x: 7.31, i: 1.50, d: 'Tagging friends to share the post and invite them to view or engage with it.' },
    { n: 'Production Inquiry', l: 2, x: 6.20, i: 1.21, d: 'Tool, Process and Prompt combined: asking which AI tools were used, how the works were created, or for the instructions used to generate similar images.' },
    { n: 'Application and Suggestions', l: 2, x: 4.56, i: 1.09, d: 'Suggestions for improvement or further development, ideas for applying the illustrations in other contexts, or requests for collaboration.' },
    { n: 'Follow-up Creation', l: 3, x: 3.27, i: 0.06, key: true, d: 'Sharing hand-drawn versions or works inspired by the original artwork, or new images created using similar prompts.' }
  ];
  var MAX = 90; // shared scale so bars compare across every row and level
  var level = 'all';

  function fmt(v) { return v.toFixed(2) + '%'; }
  function total(l, key) { return ROWS.filter(function (r) { return r.l === l; }).reduce(function (s, r) { return s + r[key]; }, 0); }
  function bar(v, cls) { return '<span class="ex-bar ' + cls + '" style="width:' + Math.max(v / MAX * 100, 0.6) + '%"></span>'; }
  function row(r, i) {
    return '<button class="ex-row' + (r.key ? ' key' : '') + '" type="button" data-i="' + i + '" aria-expanded="false">' +
      '<span class="ex-name">' + r.n + '</span>' +
      '<span class="ex-track">' + bar(r.x, 'x') + '<b>' + fmt(r.x) + '</b></span>' +
      '<span class="ex-track">' + bar(r.i, 'i') + '<b>' + fmt(r.i) + '</b></span></button>';
  }
  function closeDetail() {
    var open = root.querySelector('.ex-detail');
    if (open) open.parentNode.removeChild(open);
    [].forEach.call(root.querySelectorAll('.ex-row'), function (o) { o.setAttribute('aria-expanded', 'false'); });
  }
  function render() {
    var tabs = '<button type="button" data-l="all" aria-pressed="' + (level === 'all') + '">All levels</button>' +
      LEVELS.map(function (L, i) { return '<button type="button" data-l="' + i + '" aria-pressed="' + (String(level) === String(i)) + '">' + L.name + '</button>'; }).join('');
    var body = '';
    LEVELS.forEach(function (L, li) {
      if (level !== 'all' && Number(level) !== li) return;
      body += '<div class="ex-level"><span>' + L.name + '</span><span>' + fmt(total(li, 'x')) + ' on Xiaohongshu, ' + fmt(total(li, 'i')) + ' on Instagram</span></div>';
      ROWS.forEach(function (r, i) { if (r.l === li) body += row(r, i); });
    });
    root.innerHTML = '<div class="ex-tabs" role="group" aria-label="Filter by engagement level">' + tabs + '</div>' +
      '<div class="ex-legend"><span><i class="x"></i>Xiaohongshu</span><span><i class="i"></i>Instagram</span><span class="ex-note">Share of sorted comments on each platform. Select a row for its definition.</span></div>' +
      (level === 'all' ? '' : '<p class="ex-leveldef">' + LEVELS[level].name + ' Engagement: ' + LEVELS[level].def + '</p>') +
      '<div class="ex-rows">' + body + '</div>';
    [].forEach.call(root.querySelectorAll('.ex-tabs button'), function (b) {
      b.addEventListener('click', function () { level = b.getAttribute('data-l'); render(); root.querySelector('.ex-tabs button[aria-pressed="true"]').focus(); });
    });
    [].forEach.call(root.querySelectorAll('.ex-row'), function (b) {
      b.addEventListener('click', function () {
        var wasOpen = b.getAttribute('aria-expanded') === 'true';
        closeDetail();
        if (wasOpen) return;
        var r = ROWS[b.getAttribute('data-i')];
        var p = document.createElement('p');
        p.className = 'ex-detail';
        p.textContent = r.d;
        b.parentNode.insertBefore(p, b.nextSibling);
        b.setAttribute('aria-expanded', 'true');
      });
    });
  }
  render();
})();
