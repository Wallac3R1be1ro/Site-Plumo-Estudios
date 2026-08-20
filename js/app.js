(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){ document.documentElement.classList.add('reduced-motion'); }

  var root = document.documentElement;
  var ticking = false;

  function update(){
    ticking = false;
    if(reduceMotion) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));
    root.style.setProperty('--progress', progress.toFixed(4));
  }

  function requestTick(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }

  window.addEventListener('scroll', requestTick, {passive:true});

  window.addEventListener('mousemove', function(e){
    if(reduceMotion) return;
    var mx = (e.clientX / window.innerWidth - 0.5) * 40;
    var my = (e.clientY / window.innerHeight - 0.5) * 20;
    root.style.setProperty('--mx', mx.toFixed(1) + 'px');
    root.style.setProperty('--my', my.toFixed(1) + 'px');
  }, {passive:true});

  update();

  // scroll-reveal for cards / checkpoints / inventory slots
  var revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.2});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }
})();