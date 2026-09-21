/* One enquiry form, shared by every call to action on the site.
 *
 * The markup is injected rather than pasted into six pages, so there is a
 * single copy to change. Netlify discovers the form from __forms.html at
 * build time, which is why that file exists and why the names must match.
 *
 * Buttons declare what they are about with data-form="<value>"; the select
 * is set to that value when the dialog opens, so a sponsor never has to tell
 * us what they already told us by clicking. */
(function () {
  var INTERESTS = [
    ['company',     'My company — applying for capital'],
    ['investing',   'Investing alongside 4IR'],
    ['sponsorship', 'Sponsoring an investor salon'],
    ['studios',     'Studios — marketing and positioning'],
    ['other',       'Something else']
  ];

  var TITLES = {
    company:     'Tell us what you are building.',
    investing:   'Tell us your thesis.',
    sponsorship: 'Tell us which room.',
    studios:     'Tell us what you need built.',
    other:       'Tell us what you need.'
  };

  var dlg;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'enquiry';
    dlg.innerHTML =
      '<div class="enquiry-inner" data-body>' +
        '<div class="enquiry-head">' +
          '<div><span class="eyebrow">Get in touch</span>' +
          '<h2 data-title>Tell us what you need.</h2></div>' +
          '<button class="enquiry-close" type="button" data-close aria-label="Close">&#215;</button>' +
        '</div>' +
        '<form name="enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form-el>' +
          '<input type="hidden" name="form-name" value="enquiry">' +
          '<p class="hp"><label>Leave this empty <input name="bot-field"></label></p>' +
          '<label><span class="lab">I am getting in touch about</span>' +
            '<select name="interest" data-interest required>' +
              INTERESTS.map(function (i) {
                return '<option value="' + i[0] + '">' + i[1] + '</option>';
              }).join('') +
            '</select></label>' +
          '<div class="row">' +
            '<label><span class="lab">Your name</span><input name="name" required autocomplete="name"></label>' +
            '<label><span class="lab">Email</span><input type="email" name="email" required autocomplete="email"></label>' +
          '</div>' +
          '<div class="row">' +
            '<label><span class="lab">Company or firm</span><input name="company"></label>' +
            '<label><span class="lab">Website</span><input name="website" placeholder="optional"></label>' +
          '</div>' +
          '<label><span class="lab">Anything we should know</span>' +
            '<textarea name="message" rows="4" required placeholder="A few sentences is plenty."></textarea></label>' +
          '<div class="actions" style="margin-top:6px">' +
            '<button class="btn btn-solid" type="submit">Send to 4IR &#8599;</button>' +
          '</div>' +
          '<p class="note">Goes straight to Joe. We read everything and reply either way.</p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(dlg);

    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
    dlg.querySelector('[data-form-el]').addEventListener('submit', send);
  }

  function open(interest) {
    if (!dlg) build();
    var sel = dlg.querySelector('[data-interest]');
    if (sel && interest) sel.value = interest;
    var h = dlg.querySelector('[data-title]');
    if (h) h.textContent = TITLES[interest] || TITLES.other;
    dlg.showModal();
  }

  function send(e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      dlg.querySelector('[data-body]').innerHTML =
        '<div class="enquiry-done"><h3>Thank you.</h3>' +
        '<p>That is with Joe. You will hear back either way.</p>' +
        '<div class="actions" style="justify-content:center">' +
        '<button class="btn btn-line" type="button" data-close>Close</button></div></div>';
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Send to 4IR ↗';
      var n = form.querySelector('.note');
      n.textContent = 'That did not send. Email joe@4irg.com directly and we will pick it up.';
      n.style.color = '#A55D3B';
    });
  }

  // Anything with data-form opens the dialog; so does any leftover mailto to
  // Joe, so a CTA added later still lands in the form rather than a mail app.
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-form], a[href^="mailto:joe@4irg.com"]');
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-form') || 'other');
  });
})();
