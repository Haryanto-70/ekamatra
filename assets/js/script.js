document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('.main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = form.nama.value.trim();
      var alat = form.alat.value;
      var pesan = form.pesan.value.trim();
      var text = 'Halo PT Ekamatra Mandiri Sejahtera, saya ' + nama +
        ' ingin bertanya/menyewa alat: ' + alat +
        (pesan ? ('. Catatan: ' + pesan) : '');
      var url = 'https://wa.me/6282113496520?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
