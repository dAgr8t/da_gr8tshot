/* =============================================================
   js/contact.js   (Contact page only)
   1. Fills in your email, phone, address and Instagram from data/site.js
   2. FAQ: opens and closes the answers smoothly
   3. Quote form: pre-fills from the link, checks the fields, then
      sends the request
   4. Fades sections in as they scroll into view

   HOW THE FORM SENDS
   - If data/site.js has  formAction: "https://formspree.io/f/xxxx"
     the request is sent straight to that service (Formspree works
     well) and a thank-you message appears on the page.
   - If formAction is empty, the form opens the visitor's email app
     with the request filled in, addressed to the email in site.js.
   Links can pre-fill the form, for example:
     contact.html?service=videography&occasion=Wedding
   service values: photography, videography, both, events, unsure
   ============================================================= */
(function () {
  var SITE = window.SITE || {};
  var page = document.querySelector('main.ct');
  if (!page) return;
  var still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  function $(id) { return document.getElementById(id); }

  /* ---- 1. Contact details ---- */
  var mail = $('ct-email'), tel = $('ct-phone'), addr = $('ct-address'), igRow = $('ct-ig-row'), ig = $('ct-ig');
  if (SITE.email) { mail.textContent = SITE.email; mail.href = 'mailto:' + SITE.email; } else { mail.closest('li').hidden = true; }
  if (SITE.phone) { tel.textContent = SITE.phone; tel.href = 'tel:' + SITE.phone.replace(/[^\d+]/g, ''); } else { tel.closest('li').hidden = true; }
  if (SITE.address) { addr.textContent = SITE.address; } else { addr.closest('li').hidden = true; }
  if (SITE.instagram && SITE.instagram !== '#') { ig.href = SITE.instagram; igRow.hidden = false; }

  /* ---- 2. FAQ ---- */
  var qs = page.querySelectorAll('.ct-q');
  if (qs.length) page.classList.add('ct-js');                // answers start closed (first one stays open)
  qs.forEach(function (q) {
    var btn = q.querySelector('.ct-qbtn');
    btn.addEventListener('click', function () {
      var open = !q.classList.contains('open');
      q.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });

  /* ---- 4. Scroll-in (skipped for reduced motion) ---- */
  if (!still && 'IntersectionObserver' in window) {
    page.classList.add('ct-js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    page.querySelectorAll('.ct-reveal').forEach(function (el) { io.observe(el); });
  } else {
    page.querySelectorAll('.ct-reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- 3. Quote form ---- */
  var form = $('ct-form');
  if (!form) return;
  var f = form.elements;
  var status = $('ct-status'), done = $('ct-done'), submit = form.querySelector('.ct-submit');

  // Date picker: no dates in the past
  f.date.min = new Date().toISOString().slice(0, 10);

  // Pre-fill from the link: contact.html?service=videography&occasion=Wedding
  var q = new URLSearchParams(location.search);
  var svcMap = { photography: 'photography', photo: 'photography', videography: 'videography', video: 'videography',
                 both: 'both', combined: 'both', 'photo-video': 'both', events: 'events', event: 'events', unsure: 'unsure' };
  var sv = svcMap[(q.get('service') || '').toLowerCase()];
  if (sv) f.service.value = sv;
  var oc = (q.get('occasion') || '').toLowerCase();
  [].forEach.call(f.occasion.options, function (o) { if (oc && o.text.toLowerCase() === oc) f.occasion.value = o.value || o.text; });

  var RULES = [
    { el: f.name,    err: 'ct-name-err',    test: function (v) { return v.trim().length > 1; },                         msg: 'Please tell us your name.' },
    { el: f.email,   err: 'ct-mail-err',    test: function (v) { return /^\S+@\S+\.\S+$/.test(v.trim()); },              msg: 'Please enter a valid email so we can reply.' },
    { el: f.service, err: 'ct-service-err', test: function (v) { return v !== ''; },                                     msg: 'Please choose a service.' },
    { el: f.message, err: 'ct-msg-err',     test: function (v) { return v.trim().length > 9; },                          msg: 'Please tell us a little about your plans.' }
  ];

  function mark(rule, ok) {
    rule.el.closest('.ct-field').classList.toggle('invalid', !ok);
    $(rule.err).textContent = ok ? '' : rule.msg;
    rule.el.setAttribute('aria-invalid', !ok);
  }
  RULES.forEach(function (r) {                               // clear an error as soon as the field is fixed
    var again = function () { if (r.el.closest('.ct-field').classList.contains('invalid')) mark(r, r.test(r.el.value)); };
    r.el.addEventListener('input', again);
    r.el.addEventListener('change', again);
  });

  function label(sel) { return sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; }
  function say(text, bad) { status.textContent = text; status.classList.toggle('bad', !!bad); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    say('');

    var bad = null;
    RULES.forEach(function (r) { var ok = r.test(r.el.value); mark(r, ok); if (!ok && !bad) bad = r.el; });
    if (bad) { bad.focus(); return; }
    if (f.website.value) { showDone(); return; }              // the spam trap was filled in: pretend it worked, send nothing

    var data = {
      name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(),
      service: label(f.service), occasion: f.occasion.value ? label(f.occasion) : '',
      date: f.date.value, location: f.location.value.trim(), budget: f.budget.value.trim(), message: f.message.value.trim()
    };

    if (SITE.formAction) {
      submit.disabled = true;
      say('Sending your request…');
      data._subject = 'New quote request from ' + data.name;
      fetch(SITE.formAction, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('bad'); showDone(data.name); })
        .catch(function () {
          submit.disabled = false;
          say('Sorry, that did not go through.' + (SITE.email ? ' Please try again, or email us at ' + SITE.email + '.' : ' Please try again.'), true);
        });
    } else {
      // No form service set up: open the visitor's email app with the request filled in
      var lines = ['Name: ' + data.name, 'Email: ' + data.email];
      if (data.phone) lines.push('Phone: ' + data.phone);
      lines.push('Service: ' + data.service);
      if (data.occasion) lines.push('Occasion: ' + data.occasion);
      if (data.date) lines.push('Date: ' + data.date);
      if (data.location) lines.push('Location: ' + data.location);
      if (data.budget) lines.push('Budget: ' + data.budget);
      lines.push('', data.message);
      var url = 'mailto:' + (SITE.email || '') + '?subject=' + encodeURIComponent('Quote request from ' + data.name) + '&body=' + encodeURIComponent(lines.join('\n'));
      var a = document.createElement('a');
      a.href = url; a.style.display = 'none';
      document.body.appendChild(a); a.click(); a.remove();
      say('Your email app should open with your request ready to send. If it does not, email us at ' + (SITE.email || 'the address above') + '.');
    }
  });

  function showDone(name) {
    $('ct-done-title').textContent = name ? 'Thank you, ' + name.split(' ')[0] : 'Thank you';
    form.hidden = true;
    done.hidden = false;
    done.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
  }
  $('ct-again').addEventListener('click', function () {
    form.reset();
    RULES.forEach(function (r) { mark(r, true); });
    submit.disabled = false;
    say('');
    done.hidden = true;
    form.hidden = false;
    f.name.focus();
  });
})();
