AOS.init({
  duration: 800,
  easing: "slide",
  once: false,
});

jQuery(document).ready(function ($) {
  "use strict";

  var siteMenuClone = function () {
    $(".js-clone-nav").each(function () {
      var $this = $(this);
      $this
        .clone()
        .attr("class", "site-nav-wrap")
        .appendTo(".site-mobile-menu-body");
    });

    setTimeout(function () {
      var counter = 0;
      $(".site-mobile-menu .has-children").each(function () {
        var $this = $(this);

        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find(".arrow-collapse").attr({
          "data-toggle": "collapse",
          "data-target": "#collapseItem" + counter,
        });

        $this.find("> ul").attr({
          class: "collapse",
          id: "collapseItem" + counter,
        });

        counter++;
      });
    }, 1000);

    $("body").on("click", ".arrow-collapse", function (e) {
      var $this = $(this);
      if ($this.closest("li").find(".collapse").hasClass("show")) {
        $this.removeClass("active");
      } else {
        $this.addClass("active");
      }
      e.preventDefault();
    });

    $(window).resize(function () {
      var $this = $(this),
        w = $this.width();

      if (w > 768) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });

    $("body").on("click", ".js-menu-toggle", function (e) {
      var $this = $(this);
      e.preventDefault();

      if ($("body").hasClass("offcanvas-menu")) {
        $("body").removeClass("offcanvas-menu");
        $this.removeClass("active");
      } else {
        $("body").addClass("offcanvas-menu");
        $this.addClass("active");
      }
    });

    // click outisde offcanvas
    $(document).mouseup(function (e) {
      var container = $(".site-mobile-menu");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });
  };
  siteMenuClone();

  /* Personal JS animation smoothening */

  // Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  $(window).on("load", function () {
    function fade() {
      var animation_height = $(window).innerHeight() * 0.05;
      var ratio = Math.round((1 / animation_height) * 10000) / 10000;

      $(".disappear").each(function () {
        var windowBottom = $(window).scrollTop() + $(window).innerHeight();

        var visibilityWindow = {
          min: windowBottom - windowBottom / (Math.log(windowBottom) - 0.5),
          max: windowBottom,
        };
        var objectTop = $(this).offset().top;

        if (
          objectTop > visibilityWindow.min &&
          objectTop < visibilityWindow.max
        ) {
          if (
            objectTop > visibilityWindow.min + animation_height &&
            objectTop < visibilityWindow.max - animation_height
          ) {
            // Fully visible
            $(this).css({
              transition: "opacity 0.1s linear",
              opacity: 1,
            });
          } else {
            // Fading
            $(this).css({
              transition: "opacity 0.25s linear",
              opacity: (windowBottom - objectTop) * ratio,
            });
          }
        } else {
          // Not visible
          $(this).css("opacity", 0);
        }
      });
    }
    $(".disappear").css("opacity", 0);
    fade();
    $(window).scroll(function () {
      fade();
    });
  });

  var siteCarousel = function () {
    if ($(".nonloop-block-13").length > 0) {
      $(".nonloop-block-13").owlCarousel({
        center: false,
        items: 1,
        loop: true,
        stagePadding: 0,
        margin: 20,
        smartSpeed: 1000,
        autoplay: true,
        nav: true,
        dots: true,
        responsive: {
          600: {
            margin: 20,
            nav: true,
            items: 2,
          },
          1000: {
            margin: 20,
            stagePadding: 0,
            nav: true,
            items: 3,
          },
        },
      });
      $(".custom-next").click(function (e) {
        e.preventDefault();
        $(".nonloop-block-13").trigger("next.owl.carousel");
      });
      $(".custom-prev").click(function (e) {
        e.preventDefault();
        $(".nonloop-block-13").trigger("prev.owl.carousel");
      });
    }

    $(".slide-one-item").owlCarousel({
      center: false,
      items: 1,
      loop: true,
      stagePadding: 0,
      margin: 0,
      smartSpeed: 1500,
      autoplay: true,
      pauseOnHover: false,
      dots: true,
      nav: true,
      navText: [
        '<span class="icon-keyboard_arrow_left">',
        '<span class="icon-keyboard_arrow_right">',
      ],
    });

    if ($(".owl-all").length > 0) {
      $(".owl-all").owlCarousel({
        center: false,
        items: 1,
        loop: false,
        stagePadding: 0,
        margin: 0,
        autoplay: false,
        nav: false,
        dots: true,
        touchDrag: true,
        mouseDrag: true,
        smartSpeed: 1000,
        navText: [
          '<span class="icon-arrow_back">',
          '<span class="icon-arrow_forward">',
        ],
        responsive: {
          768: {
            margin: 30,
            nav: false,
            responsiveRefreshRate: 10,
            items: 1,
          },
          992: {
            margin: 30,
            stagePadding: 0,
            nav: false,
            responsiveRefreshRate: 10,
            touchDrag: false,
            mouseDrag: false,
            items: 3,
          },
          1200: {
            margin: 30,
            stagePadding: 0,
            nav: false,
            responsiveRefreshRate: 10,
            touchDrag: false,
            mouseDrag: false,
            items: 3,
          },
        },
      });
    }
  };
  siteCarousel();

  var siteSticky = function () {
    $(".js-sticky-header").sticky({ topSpacing: 0 });
  };
  siteSticky();

  // navigation
  var OnePageNavigation = function () {
    var navToggler = $(".site-menu-toggle");

    $("body").on(
      "click",
      ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a[href^='#']",
      function (e) {
        e.preventDefault();

        var hash = this.hash;

        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top - 50,
          },
          600,
          "easeInOutExpo",
          function () {
            // window.location.hash = hash;
          }
        );
      }
    );
  };
  OnePageNavigation();

  var siteScroll = function () {
    $(window).scroll(function () {
      var st = $(this).scrollTop();

      if (st > 100) {
        $(".js-sticky-header").addClass("shrink");
      } else {
        $(".js-sticky-header").removeClass("shrink");
      }
    });
  };
  siteScroll();

  // Stellar
  $(window).stellar({
    horizontalScrolling: false,
    responsive: true,
  });

  var counter = function () {
    $("#about-section").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("ftco-animated")
        ) {
          var comma_separator_number_step =
            $.animateNumber.numberStepFactories.separator(",");
          $(".number > span").each(function () {
            var $this = $(this),
              num = $this.data("number");
            $this.animateNumber(
              {
                number: num,
                numberStep: comma_separator_number_step,
              },
              7000
            );
          });
        }
      },
      { offset: "95%" }
    );
  };
  counter();

  var forms = function () {
    // Forms.
    var $form = $("form");

    // Auto-resizing textareas.
    $form.find("textarea").each(function () {
      var $this = $(this),
        $wrapper = $('<div class="textarea-wrapper"></div>'),
        $submits = $this.find('input[type="submit"]');

      $this
        .wrap($wrapper)
        .attr("rows", 1)
        .css("overflow", "hidden")
        .css("resize", "none")
        .on("keydown", function (event) {
          if (event.keyCode == 13 && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();

            $(this).blur();
          }
        })
        .on("blur focus", function () {
          $this.val($.trim($this.val()));
        })
        .on("input blur focus --init", function () {
          $wrapper.css("height", $this.height());

          $this
            .css("height", "auto")
            .css("height", $this.prop("scrollHeight") + "px");
        })
        .on("keyup", function (event) {
          if (event.keyCode == 9) $this.select();
        })
        .triggerHandler("--init");
    });
  };
  forms();

  // Math

  // randomize array elements using the Durstenfeld shuffle algorithm.
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // Animations with GSAP

  var flickerLetters = function (el, i, stagger, uniqTLs, masterTL) {
    var mySplitText = Splitting({ target: el, by: "chars", whitespace: true });
    var shuffleCharArray = shuffleArray(mySplitText[0].chars);
    shuffleCharArray.forEach(function (elem, index) {
      if (elem.innerHTML === "") {
        elem.innerHTML = " ";
      }
      gsap.set(elem, { className: "text-animation-welcome" });
      var flipTL = gsap.timeline();
      var tl = gsap.timeline();
      tl.set(elem, { className: "text-animation-welcome state-1" })
        .set(elem, { delay: 0.1, className: "text-animation-welcome state-2" })
        .set(elem, { delay: 0.1, className: "text-animation-welcome state-3" });
      flipTL.add(tl, index * stagger);
      uniqTLs[i].add(flipTL, 0);
    });
    masterTL.add(uniqTLs[i]);
  };

  var portraitAnimation = function () {
    var masterTL = gsap.timeline({ repeat: -1, repeatDelay: 1, delay: 1 });
    var uniqTLs = [];
    var cycleThrough = document.getElementsByClassName("typed-trait");
    var portraits = document.getElementsByClassName("portrait-image");
    for (var i = 0; i < cycleThrough.length; i++) {
      uniqTLs[i] = gsap.timeline({
        repeat: 1,
        repeatDelay: 1.5,
        yoyo: true,
        onStart: function (i) {
          portraits[i].classList.add("active");
        },
        onStartParams: [i],
        onComplete: function (i) {
          portraits[i].classList.remove("active");
        },
        onCompleteParams: [i],
      });
      flickerLetters(cycleThrough[i], i, 0.125, uniqTLs, masterTL);
    }
  };

  var devCoverAnimation = function () {
    gsap.set(".dev-cover-title", { opacity: 1 });
    var masterTL = gsap.timeline({
      onComplete: function () {
        gsap.fromTo(
          ".dev-intro",
          0.75,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, delay: -0.125, ease: Power1.easeInOut }
        );
        gsap.fromTo(
          ".intro-button",
          0.5,
          { opacity: 0 },
          { opacity: 1, delay: 0.5, ease: Power2.easeInOut }
        );
      },
    });
    var uniqTLs = [];
    var elements = document.getElementsByClassName("dev-cover-title");
    for (var i = 0; i < elements.length; i++) {
      uniqTLs[i] = gsap.timeline();
      flickerLetters(elements[i], i, 0.125, uniqTLs, masterTL);
    }
  };

  var homeCoverAnimation = function () {
    var masterTL = gsap.timeline({
        onComplete: function () {
          gsap.fromTo(
            ".portrait-wrapper",
            0.6,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, ease: Power1.easeInOut }
          );
          gsap.fromTo(
            ".intro-button",
            1,
            { opacity: 0 },
            { opacity: 1, delay: 0, ease: Power2.easeInOut }
          );
          gsap.set(".typed-traits-wrapper", { opacity: 1 });
          portraitAnimation();
        },
      }),
      uniqTLs = [],
      elements = document.getElementsByClassName("home-cover-title");
    gsap.set(".home-cover-title", { opacity: 1 });
    for (var i = 0; i < elements.length; i++) {
      uniqTLs[i] = gsap.timeline();
      flickerLetters(elements[i], i, 0.125, uniqTLs, masterTL);
    }
  };

  var animateCover = function () {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    switch (page) {
      case "webdev.html":
        devCoverAnimation();
        break;
      case "music.html":
        break;
      default:
        homeCoverAnimation();
        break;
    }
  };

  var headerNavAnimation = function () {
    var activeNav = document.getElementById("active-navitem");
    var header = document.getElementById("current-page-title");
    var siblings = activeNav.parentElement.children;
    var leftOfActive = Array.prototype.filter.call(siblings, function (el, i) {
      return i < Array.prototype.indexOf.call(siblings, activeNav);
    });
    var splitNav = Splitting({
      target: activeNav,
      by: "chars",
      whitespace: true,
    })[0];
    var splitHeader = Splitting({
      target: header,
      by: "chars",
      whitespace: true,
    })[0];

    moveNavToHeader();

    function moveNavToHeader() {
      var hasSpace = false;
      var headerTL = gsap.timeline();
      var activeNavTL = gsap.timeline({
        onStart: function () {
          animateCover();
        },
        onComplete: function () {},
      });
      var otherNavTL = gsap.timeline({
        onComplete: function () {
          // Move parent item over splitted childs
          gsap.set(activeNav, { opacity: 0 });
          gsap.set(activeNav, {
            x:
              header.getBoundingClientRect().left -
              activeNav.getBoundingClientRect().left,
          });
        },
      });
      // Move individual letters to new position
      for (var i = 0; i < splitNav.chars.length; i++) {
        // Add pink dot to header whitespace
        if (splitNav.chars[i].innerHTML === " ") {
          hasSpace = true;
          splitHeader.chars[i].style.color = "#e31b6d";
          splitHeader.chars[i].style.opacity = 0;
          splitHeader.chars[i].innerHTML = ".";
        }
        // If header has no whitespace, add to end of header
        if (!hasSpace && i === splitNav.chars.length - 1) {
          var dot = document.createElement("span");
          dot.innerHTML = ".";
          dot.style.color = "#e31b6d";
          dot.style.opacity = 0;
          splitHeader.chars[i + 1] = dot;
          splitHeader.el.append(dot);
        }
        var tl = gsap.timeline();
        var left =
          splitHeader.chars[i].getBoundingClientRect().left -
          splitNav.chars[i].getBoundingClientRect().left +
          2;
        gsap.set(splitNav.chars[i], { fontWeight: "normal" });
        // Text animation
        tl.to(splitNav.chars[i], 0.3, {
          color: "#444649",
          y: 100,
          ease: Power2.easeInOut,
        });
        tl.to(splitNav.chars[i], 0.6, {
          color: "#444649",
          x: left,
          delay: -0.15,
          ease: Power2.easeInOut,
        });
        tl.to(splitNav.chars[i], 0.3, {
          color: "white",
          scale: 1.5,
          y: 0,
          opacity: 0,
          fontWeight: "bold",
          delay: -0.15,
          ease: Power2.easeInOut,
        });
        activeNavTL.add(tl, i * 0.1);
      }
      //Move prior siblings to new position
      // if (leftOfActive.length > 0) {
      otherNavTL.to(leftOfActive.reverse(), 1, {
        x:
          activeNav.offsetWidth +
          parseFloat(gsap.getProperty(activeNav, "margin-right")),
        stagger: 0.3,
        delay: 0.1,
        ease: Power2.easyInOut,
      });
      // }

      gsap.set(header, { opacity: 1 });
      gsap.set(splitHeader.chars, { y: 50, opacity: 0 });
      headerTL.to(splitHeader.chars, 0.15, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        delay: 0.6,
        ease: Bounce,
      });
    }

    var navLinks = document.getElementsByClassName("nav-link");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        var container = $(".site-mobile-menu");
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
        if (e.target.href) resetNav(e.target.href);
      });
    }

    function resetNav(href) {
      var navTL = gsap.timeline({
        onComplete: function () {
          gsap.fromTo(
            ".content",
            0.8,
            { opacity: 1 },
            { opacity: 0, ease: Power2.easeInOut }
          );
          gsap.fromTo(
            "#outta-space",
            0.8,
            { opacity: 1 },
            { opacity: 0, ease: Power2.easeInOut }
          );
        },
      });
      var tl = gsap.timeline({
        onComplete: function () {
          window.location = href;
        },
      });
      var headerTL = gsap.timeline();

      // Animate prior nav items to old position
      if (leftOfActive.length > 0) {
        navTL.to(leftOfActive.reverse(), 0.4, {
          x: 0,
          stagger: 0.15,
          ease: Power2.easyInOut,
        });
      }
      // Animate header text
      gsap.set(activeNav, { opacity: 1, x: 0 });
      headerTL.to(splitHeader.chars, 0.4, { opacity: 0, stagger: 0.125 });
      tl.to(splitNav.chars, 0.4, {
        opacity: 1,
        scale: 1,
        x: 0,
        fontWeight: 400,
        stagger: 0.125,
        ease: Power2.easeInOut,
      });
    }
  };
  headerNavAnimation();
});
