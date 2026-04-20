(function ($) {
	"use strict";
	const sidebarBtn = document.querySelector('.sidebar-button');
	if (sidebarBtn) {
		sidebarBtn.addEventListener('click', () => {
			const mainMenu = document.querySelector('.main-menu');
			if (mainMenu) mainMenu.classList.toggle('show-menu');
		});
	}

	$('.sidebar-button').on("click", function () {
		$(this).toggleClass('active');
	});

	jQuery('.dropdown-icon').on('click', function () {
		jQuery(this).toggleClass('active').next('ul').slideToggle();
		jQuery(this).parent().siblings().children('ul').slideUp();
		jQuery(this).parent().siblings().children('.active').removeClass('active');
	});

	// sticky header
	window.addEventListener('scroll', function () {
		const header = document.querySelector('header.header-area');
		if (header) {
			header.classList.toggle("sticky", window.scrollY > 200);
		}
	});


	// Serch Btn
	$(".search-btn").on("click", function (e) {

		let parent = $(this).parent();

		parent.find(".search-input, .lang-card").toggleClass("active");

		e.stopPropagation();

	});
	$(document).on("click", function (e) {
		if (!$(e.target).closest(".search-input, .search-btn").length) {
			$(".search-input").removeClass("active");
		}
	});
	$(".serch-close").on("click", function (e) {
		$(".search-input").removeClass("active");
	});


	// img hover zoom in
	$(".product-img--main")
		// tile mouse actions
		.on("mouseover", function () {
			$(this)
				.children(".product-img--main__image")
				.css({ transform: "scale(" + $(this).attr("data-scale") + ")" });
		})
		.on("mouseout", function () {
			$(this)
				.children(".product-img--main__image")
				.css({ transform: "scale(1)" });
		})
		.on("mousemove", function (e) {
			$(this)
				.children(".product-img--main__image")
				.css({
					"transform-origin":
						((e.pageX - $(this).offset().left) / $(this).width()) * 100 +
						"% " +
						((e.pageY - $(this).offset().top) / $(this).height()) * 100 +
						"%",
				});
		})
		.each(function () {
			$(this)
				// add a image container
				.append('<div class="product-img--main__image"></div>')
				// set up a background image for each tile based on data-image attribute
				.children(".product-img--main__image")
				.css({ "background-image": "url(" + $(this).attr("data-image") + ")" });
		});


	//Cart Menu Quantity button toggle
	$(".qty-btn").on("click", function (e) {
		e.stopPropagation();
		// Toggle "active" class for the current quantity button and its related elements
		$(this).next(".quantity-area").toggleClass("active");

		// Remove "active" class from other quantity buttons and related elements
		$(".quantity-area")
			.not($(this).next(".quantity-area"))
			.removeClass("active");
	});
	$(document).on("click", function (e) {
		if (!$(e.target).closest(".quantity-area").length) {
			// Remove "active" class from all quantity buttons and related elements
			$(".quantity-area").removeClass("active");
		}
	});
	//Quantity
	$(".quantity__minus").on("click", function (e) {
		e.preventDefault();
		var input = $(this).siblings(".quantity__input");
		var value = parseInt(input.val(),10);
		if (value > 1) {
			value--;
		}
		input.val(value.toString().padStart(2, "0"));
	});
	$(".quantity__plus").on("click", function (e) {
		e.preventDefault();
		var input = $(this).siblings(".quantity__input");
		var value = parseInt(input.val(),10);
		value++;
		input.val(value.toString().padStart(2, "0"));
	});
	// Payment Method
	$(function () {
		$(".choose-payment-method ul li").on("click", function () {
			$(".choose-payment-method ul li").removeClass("active"); // Remove active class from all list items
			if ($(this).hasClass("stripe")) {
				$("#StripePayment").show();
				$("#OfflinePayment").hide();
				$(this).addClass("active"); // Add active class to the clicked list item
			} else if ($(this).hasClass("paypal")) {
				$("#OfflinePayment").hide();
				$("#StripePayment").hide();
				$(this).addClass("active"); // Add active class to the clicked list item
			} else if ($(this).hasClass("offline")) {
				$("#OfflinePayment").show();
				$("#StripePayment").hide();
				$(this).addClass("active"); // Add active class to the clicked list item
			} else {
				$("#StripePayment").hide();
				$("#OfflinePayment").hide();
			}
		});
	});


	var swiper = new Swiper(".banner-swiper-slide", {
		slidesPerView: 1,
		speed: 2500,
		spaceBetween: 30,
		loop: true,
		effect: "fade", // Use the fade effect
		fadeEffect: {
			crossFade: true, // Enable cross-fade transition
		},
		autoplay: {
			delay: 3500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: ".next-1",
			prevEl: ".prev-1",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 1,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 1,
			},
		}

	});
	var swiper = new Swiper(".feedback-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination",
			type: "fraction",
		},
		navigation: {
			nextEl: ".feedback-slider-next",
			prevEl: ".feedback-slider-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 3,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 3,
			},
		}

	});
	var swiper = new Swiper(".team-swiper-slider", {
		slidesPerView: 1,
		speed: 1200,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2000, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination2",
			type: "fraction",
		},
		navigation: {
			nextEl: ".team-btn-next",
			prevEl: ".team-btn-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4,
			},
		}

	});
	var swiper = new Swiper(".gallery-slider", {
		speed: 1500,
		spaceBetween: 0,
		autoplay: {
			delay: 2500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},

		breakpoints: {
			280: {
				slidesPerView: 2,
			},
			386: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 5,
			},
			1400: {
				slidesPerView: 5,
			},
		},
	});
	var swiper = new Swiper(".product-image-slider", {
		speed: 1500,
		spaceBetween: 0,
		navigation: {
			nextEl: ".product-next",
			prevEl: ".product-prev",
		},
	});
	var swiper = new Swiper(".related-product-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination",
			type: "fraction",
		},
		navigation: {
			nextEl: ".feedback-slider-next",
			prevEl: ".feedback-slider-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4,
			},
		}

	});
	var swiper = new Swiper(".product-section-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination3",
			type: "fraction",
		},
		navigation: {
			nextEl: ".product-btn-next",
			prevEl: ".product-btn-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4, 
			},
		}

	});
	var swiper = new Swiper(".skin-care-product-swiper", {
		slidesPerView: 1,
		speed: 1200,
		spaceBetween: 30,
		loop: true,
		 autoplay: {
		 	delay: 2000, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		 },
		pagination: {
			el: ".progress-pagination",
			type: "progressbar",
		},
		navigation: {
			nextEl: ".next-1",
			prevEl: ".prev-1",
		},
		scrollbar: {
			el: ".swiper-scrollbar",
			hide: true,
		  },

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4,
			},
		}

	});
	var swiper = new Swiper(".offer-section-swiper", {
		slidesPerView: 1,
		speed: 1200,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2000, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".progress-pagination2",
			type: "progressbar",
		},
		navigation: {
			nextEl: ".next-1",
			prevEl: ".prev-1",
		},
		scrollbar: {
			el: ".swiper-scrollbar",
			hide: true,
		  },

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4,
			},
		}

	});
	var swiper = new Swiper(".feedback-slider", {
		slidesPerView: 1,
		speed: 1300,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".progress-pagination3",
			type: "progressbar",
		},
		navigation: {
			nextEl: ".next-1",
			prevEl: ".prev-1",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 3,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 3,
			},
		}

	});
	var swiper = new Swiper(".skin-protection-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: ".next-1",
			prevEl: ".prev-1",
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 2,
			},
		}

	});
	var swiper = new Swiper(".nail-banner-swiper-slide", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 1500,
        effect: "fade", // Use the fade effect
		fadeEffect: {
			crossFade: true, // Enable cross-fade transition
		},
        autoplay: {
			delay: 3500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
        pagination: {
            el: ".swiper-pagination1",
            clickable: true,
        },
        fadeEffect: {
            crossFade: true,
        },
    });
	var swiper = new Swiper(".nail-offer-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination4",
			type: "fraction",
		},
		navigation: {
			nextEl: ".offer-slider-next",
			prevEl: ".offer-slider-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4, 
			},
		}

	});
	var swiper = new Swiper(".nail-customer-review-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination4",
			type: "fraction",
		},
		navigation: {
			nextEl: ".process-slider-next",
			prevEl: ".process-slider-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 2, 
			},
		}

	});

	var swiper = new Swiper(".gift-card-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		loop: true,
		autoplay: {
			delay: 2300, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},
		pagination: {
			el: ".fractional-pagination",
			type: "fraction",
		},
		navigation: {
			nextEl: ".gift-slider-next",
			prevEl: ".gift-slider-prev",
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4, 
			},
		}

	});
	// Treatment Slider
	var swiper = new Swiper(".treatment-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 25,
		// autoplay: {
		// 	delay: 2500, // Autoplay duration in milliseconds
		// 	disableOnInteraction: false,
		// },
		navigation: {
			nextEl: ".treatment-slider-next",
			prevEl: ".treatment-slider-prev",
		},
		breakpoints: {
		  280: {
			slidesPerView: 1,
		  },
		  386: {
			slidesPerView: 1,
		  },
		  576: {
			slidesPerView: 1,
			spaceBetween: 15,
		  },
		  768: {
			slidesPerView: 2,
		  },
		  992: {
			slidesPerView: 2.7,
		  },
		  1200: {
			slidesPerView: 3.5,
			spaceBetween: 15,
		  },
		  1400: {
			slidesPerView: 3.7,
		  },
		},
	});
	// Beauty Testimonial Slider
	var swiper = new Swiper(".beauty-testimonial-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 25,
		// autoplay: {
		// 	delay: 2500, // Autoplay duration in milliseconds
		// 	disableOnInteraction: false,
		// },
		navigation: {
			nextEl: ".beauty-testimonial-next",
			prevEl: ".beauty-testimonial-prev",
		},
		pagination: {
			el: ".fractional-pagination4",
			type: "fraction",
		},
		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 1,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 1,
			},
			992: {
				slidesPerView: 1.5,
			},
			1200: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 2,
			},
		},
	});
	var swiper = new Swiper(".about-step-slider", {
		slidesPerView: 1,
		speed: 1500,
		spaceBetween: 30,
		// autoplay: {
		// 	delay: 2300, // Autoplay duration in milliseconds
		// 	disableOnInteraction: false,
		// },
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		},

		breakpoints: {
			280: {
				slidesPerView: 1,
			},
			386: {
				slidesPerView: 1,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 15,
			},
			992: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 15,
			},
			1400: {
				slidesPerView: 4, 
			},
		}
	});
	var swiper = new Swiper(".right-sidebar-insta-slider", {
		speed: 1500,
		spaceBetween: 0,
		autoplay: {
			delay: 2500, // Autoplay duration in milliseconds
			disableOnInteraction: false,
		},

		breakpoints: {
			280: {
				slidesPerView: 2,
			},
			386: {
				slidesPerView: 2,
			},
			576: {
				slidesPerView: 3,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 4,
			},
			1400: {
				slidesPerView: 4,
			},
		},
	});

	// Beauty Testimonial Slider
	const sliders = document.querySelectorAll('.used-product-slider');
	sliders.forEach((slider) => {
		const nextBtn = slider.parentElement.querySelector('.used-product-slider-next');
		const prevBtn = slider.parentElement.querySelector('.used-product-slider-prev');

		const swiper = new Swiper(slider, {
			slidesPerView: 1,
			speed: 1500,
			spaceBetween: 10,
			loop: true,
			autoplay: false,
			navigation: {
				nextEl: nextBtn,
				prevEl: prevBtn,
			},
		});
		nextBtn.addEventListener('click', () => {
			swiper.slideNext();
		});

		prevBtn.addEventListener('click', () => {
			swiper.slidePrev();
		});
	});

	$('select').niceSelect();


	$('.services-list li').on('click', function() {
		$(this).toggleClass('selected');
	});

	  // Spa Offer Banner
	const buttons = document.querySelectorAll(".spa-sm-img-list .single-item");
	const backgrounds = document.querySelectorAll(".spa-banner-img-group .single-banner-bg");

	let currentIndex = 0;
	let autoPlayInterval;

	// Check if elements exist before proceeding
	if (buttons.length > 0 && backgrounds.length > 0) {

		// Function to remove active classes
		function removeActiveClasses() {
			buttons.forEach(button => button.querySelector('.banner-sm-img').classList.remove('active'));
			backgrounds.forEach(bg => bg.style.opacity = 0);
		}

		// Function to change background
		function changeBackground(index) {
			removeActiveClasses();
			backgrounds[index].style.opacity = 1;
			buttons[index].querySelector('.banner-sm-img').classList.add('active');
			currentIndex = index;
		}

		// Autoplay function
		function autoPlayBackgrounds() {
			autoPlayInterval = setInterval(() => {
				currentIndex = (currentIndex + 1) % backgrounds.length;
				changeBackground(currentIndex);
			}, 2500); // Change every 2.5 seconds
		}

		// Start autoplay on page load
		autoPlayBackgrounds();

		// Pause autoplay on hover and change background on click
		buttons.forEach((button, index) => {
			const bannerImg = button.querySelector('.banner-sm-img');

			// Mouseover: stop autoplay and change background
			button.onmouseover = function () {
				clearInterval(autoPlayInterval);
				changeBackground(index);
			};

			// Mouseout: restart autoplay
			button.onmouseout = function () {
				autoPlayBackgrounds();
			};
		});

	}
	  
	// Video Popup

	$('.video-player').fancybox({
		buttons: [
			"close"
		],
		loop: false,
		protect: true
	});

	//wow js 
	jQuery(window).on('load', function () {
		new WOW().init();
		window.wow = new WOW({
			boxClass: 'wow',
			animateClass: 'animated',
			offset: 0,
			mobile: true,
			live: true,
			offset: 80
		})
		window.wow.init();
	});

	$(document).ready(function() {
		if ($("#container1").length) {
			$("#container1").twentytwenty();
		}
	});


	jQuery('.expand-btn').on('click', function () {
		var $serviceContent = jQuery(this).closest('tr').find('.service-content');
		
		// Toggle active state and slide the content
		jQuery(this).toggleClass('active');
		$serviceContent.slideToggle();
	
		// Close other rows
		jQuery('.expand-btn').not(this).removeClass('active');
		jQuery('.service-content').not($serviceContent).slideUp();
	});
	//Facial treatment card Hide show
	$(document).ready(function() {
		// When the .inculded-icon is clicked
		$('.inculded-icon').on('click', function(e) {
			e.stopPropagation(); // Prevent propagation to the document
	
			// Hide all other cards' content and show icons
			$('.facial-treatment-card .inculded-content').slideUp();
			$('.facial-treatment-card .inculded-icon').show();
	
			// Hide the clicked icon and show the clicked content
			$(this).hide(); // Hide the included icon for the current card
			$(this).next('.inculded-content').slideDown(); // Show the included content for the current card
		});
	
		// When clicking outside both .inculded-icon and .inculded-content
		$(document).on('click', function(e) {
			// Check if the click is outside the .inculded-icon and .inculded-content
			if (!$(e.target).closest('.inculded-content').length) {
				// Hide all included content and show all icons
				$('.facial-treatment-card .inculded-content').slideUp();
				$('.facial-treatment-card .inculded-icon').show();
			}
		});
	});

	// sidebar
	$('.right-sidebar-button').on("click", function () {
		$('.right-sidebar-menu').addClass('show-right-menu');
	});
	$('.right-sidebar-close-btn').on("click", function () {
		$('.right-sidebar-menu').removeClass('show-right-menu');
	});

	// sidebar
	$(".skin-care-banner-section .play-icon").on("click", function (e) {
		e.stopPropagation();
		$(".video-wrapper").toggleClass("slide");
	});

	if ($('input[name="inOut"]').length > 0) {
		$('input[name="inOut"]').daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			minYear: 2024,
			maxYear: 2025,
			timePicker: true, // Enable time picker
			timePicker24Hour: true, // Use 24-hour format for time picker
			startDate: moment(), // Set current date and time as the default value
			locale: {
				format: 'DD-MMM-YYYY HH:mm'
			}
		}, function (start, end, label) {
			var years = moment().diff(start, 'years');
		});
	}
	
	
}(jQuery));