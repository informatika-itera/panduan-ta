// Theme
(() => {
	const saved = localStorage.getItem("theme") || "light";
	document.documentElement.setAttribute("data-theme", saved);

	document.getElementById("theme-toggle")?.addEventListener("click", () => {
		const current = document.documentElement.getAttribute("data-theme");
		const next = current === "light" ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", next);
		localStorage.setItem("theme", next);
	});
})();

// Sidebar toggle (pedoman page)
(() => {
	const sidebar = document.getElementById("sidebar");
	const toggle = document.getElementById("sidebar-toggle");
	const close = document.getElementById("sidebar-close");
	const overlay = document.getElementById("sidebar-overlay");

	if (toggle) {
		toggle.addEventListener("click", () => sidebar.classList.add("open"));
	}
	if (close) {
		close.addEventListener("click", () => sidebar.classList.remove("open"));
	}
	if (overlay) {
		overlay.addEventListener("click", () => sidebar.classList.remove("open"));
	}

	// Active ToC tracking
	const tocLinks = document.querySelectorAll(".toc a");
	const headings = [];
	tocLinks.forEach((link) => {
		const id = link.getAttribute("href").slice(1);
		const el = document.getElementById(id);
		if (el) headings.push({ el, link });
	});

	if (headings.length > 0) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						tocLinks.forEach((l) => l.classList.remove("active"));
						const match = headings.find((h) => h.el === entry.target);
						if (match) match.link.classList.add("active");
					}
				});
			},
			{ rootMargin: "-80px 0px -60% 0px", threshold: 0 },
		);

		headings.forEach((h) => observer.observe(h.el));
	}

	// Close sidebar on link click (mobile)
	tocLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (window.innerWidth <= 900) sidebar.classList.remove("open");
		});
	});
})();

// Slides navigation
(() => {
	const wrapper = document.getElementById("slides-wrapper");
	if (!wrapper) return;

	const slides = wrapper.querySelectorAll(".slide");
	const counter = document.getElementById("slide-counter");
	const prevBtn = document.getElementById("slide-prev");
	const nextBtn = document.getElementById("slide-next");
	const dotsContainer = document.getElementById("slide-dots");
	let current = 0;
	const total = slides.length;

	// Create dots
	const dots = [];
	slides.forEach((_, i) => {
		const dot = document.createElement("div");
		dot.className = "slide-dot" + (i === 0 ? " active" : "");
		dot.addEventListener("click", () => goTo(i));
		dotsContainer.appendChild(dot);
		dots.push(dot);
	});

	function goTo(idx, animate = true) {
		if (idx < 0 || idx >= total) return;
		const oldIdx = current;
		if (idx === oldIdx && animate) return;

		if (animate) {
			const goingForward = idx > oldIdx;

			if (goingForward) {
				// Old slide: exit to the LEFT
				slides[oldIdx].classList.remove("active");
				slides[oldIdx].classList.add("prev");

				// New slide: enter from the RIGHT (default CSS position)
				slides[idx].classList.remove("prev");
				slides[idx].classList.add("active");
			} else {
				// Going backward
				// Old slide: exit to the RIGHT
				slides[oldIdx].classList.remove("active", "prev");

				// New slide: position offscreen left first, force reflow, animate center
				slides[idx].classList.add("prev");
				void slides[idx].offsetWidth;
				slides[idx].classList.remove("prev");
				slides[idx].classList.add("active");
			}
		} else {
			// No animation (initial render)
			slides.forEach((s, i) => {
				s.classList.remove("active", "prev");
				if (i === idx) s.classList.add("active");
			});
		}

		current = idx;

		// Update counter
		counter.textContent = current + 1 + " / " + total;
		prevBtn.disabled = current === 0;
		nextBtn.disabled = current === total - 1;

		// Update dots
		dots.forEach((d, i) => {
			d.classList.toggle("active", i === current);
		});
	}

	prevBtn.addEventListener("click", () => goTo(current - 1));
	nextBtn.addEventListener("click", () => goTo(current + 1));

	// Keyboard navigation
	document.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
		if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
	});

	// Touch swipe
	let touchStartX = 0;
	wrapper.addEventListener("touchstart", (e) => {
		touchStartX = e.touches[0].clientX;
	});
	wrapper.addEventListener("touchend", (e) => {
		const diff = touchStartX - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) {
			diff > 0 ? goTo(current + 1) : goTo(current - 1);
		}
	});

	goTo(0, false);
})();
