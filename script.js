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

// Search bar (pedoman page)
(() => {
	const searchInput = document.getElementById("pedoman-search");
	const clearBtn = document.getElementById("search-clear");
	const resultsEl = document.getElementById("search-results");
	const mdContent = document.getElementById("md-content");
	if (!searchInput || !mdContent || !resultsEl) return;

	const MAX_RESULTS = 3;
	let debounceTimer;
	let activeIndex = -1;
	let searchIndex = [];

	function buildIndex() {
		searchIndex = [];
		const headings = mdContent.querySelectorAll("h1, h2, h3, h4");
		headings.forEach((heading) => {
			let node = heading.nextElementSibling;
			let bodyText = "";
			while (node && !/^H[1-4]$/.test(node.tagName)) {
				bodyText += " " + node.textContent;
				node = node.nextElementSibling;
			}
			searchIndex.push({
				id: heading.id,
				level: heading.tagName.toLowerCase(),
				title: heading.textContent.trim(),
				body: bodyText.trim().replace(/\s+/g, " "),
				element: heading,
			});
		});
	}

	if (mdContent.children.length > 0) {
		buildIndex();
	} else {
		document.addEventListener("md-rendered", buildIndex, { once: true });
	}

	function escapeRegex(s) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	function escapeHtml(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	function highlightQuery(text, query) {
		const esc = escapeRegex(query);
		return escapeHtml(text).replace(new RegExp(`(${esc})`, "gi"),
			'<mark class="search-highlight">$1</mark>');
	}

	function getPreview(body, query, maxLen) {
		const esc = escapeRegex(query);
		const rx = new RegExp(esc, "i");
		const m = rx.exec(body);
		if (!m) {
			const t = body.slice(0, maxLen);
			return escapeHtml(t) + (body.length > maxLen ? "..." : "");
		}
		const half = maxLen / 2;
		let s = Math.max(0, m.index - half);
		let e = Math.min(body.length, m.index + m[0].length + half);
		let preview = "";
		if (s > 0) preview += "...";
		preview += body.slice(s, e);
		if (e < body.length) preview += "...";
		return highlightQuery(preview, query);
	}

	function renderResults(results, query) {
		resultsEl.innerHTML = "";
		if (results.length === 0) {
			const msg = document.createElement("div");
			msg.className = "search-no-results";
			msg.textContent = `Tidak ditemukan: "${query}"`;
			resultsEl.appendChild(msg);
			resultsEl.hidden = false;
			return;
		}
		results.forEach((r, i) => {
			const item = document.createElement("div");
			item.className = "search-result-item" + (i === activeIndex ? " active" : "");
			item.innerHTML = `<div class="search-result-heading"><span class="heading-level">${r.level}</span>${highlightQuery(r.title, query)}</div><div class="search-result-preview">${getPreview(r.body, query, 120)}</div>`;
			item.addEventListener("click", () => {
				r.element.scrollIntoView({ behavior: "smooth", block: "start" });
				closeResults();
				searchInput.blur();
			});
			item.addEventListener("mouseenter", () => {
				activeIndex = i;
				updateActive(resultsEl);
			});
			resultsEl.appendChild(item);
		});
		resultsEl.hidden = false;
	}

	function updateActive(container) {
		container.querySelectorAll(".search-result-item").forEach((el, i) => {
			el.classList.toggle("active", i === activeIndex);
		});
	}

	function closeResults() {
		resultsEl.hidden = true;
		resultsEl.innerHTML = "";
		activeIndex = -1;
	}

	function performSearch(query) {
		if (!query || !query.trim()) {
			closeResults();
			clearBtn.hidden = true;
			return;
		}
		clearBtn.hidden = false;
		const q = query.trim();
		const esc = escapeRegex(q);
		const rx = new RegExp(esc, "i");
		const matches = searchIndex
			.filter(item => rx.test(item.title) || rx.test(item.body))
			.slice(0, MAX_RESULTS);
		activeIndex = 0;
		renderResults(matches, q);
	}

	searchInput.addEventListener("input", () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => performSearch(searchInput.value), 200);
	});

	searchInput.addEventListener("keydown", (e) => {
		const items = resultsEl.querySelectorAll(".search-result-item");
		const count = items.length;
		if (count === 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % count;
			updateActive(resultsEl);
			items[activeIndex]?.scrollIntoView({ block: "nearest" });
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + count) % count;
			updateActive(resultsEl);
		} else if (e.key === "Enter" && activeIndex >= 0) {
			e.preventDefault();
			items[activeIndex]?.click();
		} else if (e.key === "Escape") {
			closeResults();
			searchInput.blur();
		}
	});

	clearBtn.addEventListener("click", () => {
		searchInput.value = "";
		closeResults();
		clearBtn.hidden = true;
		searchInput.focus();
	});

	document.addEventListener("click", (e) => {
		if (!resultsEl.hidden &&
			!e.target.closest("#topbar-search") &&
			!e.target.closest("#search-results")) {
			closeResults();
		}
	});
})();
// Slides (reveal.js) — triggers only on the /sosialisasi page
(() => {
	if (typeof Reveal === "undefined") return;

	Reveal.initialize({
		embedded: true, // Fill container, NOT full viewport (topbar stays visible)
		hash: true, // URL tracks slide index: #/5
		slideNumber: true, // Show "3 / 20" format
		transition: "slide", // Animation between slides
		transitionSpeed: "default",
		width: "100%", // Use parent container width
		height: "100%", // Use parent container height
		margin: 0,
		center: true,
		controls: true, // Show navigation arrows
		controlsTutorial: false,
		progress: true, // Show progress bar
		keyboard: true, // Arrow key navigation
		touch: true, // Touch swipe
		autoSlide: 0, // Disable auto-advance
		autoSlideStoppable: false,
		mouseWheel: false, // Disable scroll-to-slide
		hideAddressBar: true,
		previewLinks: false,
		viewDistance: 3, // Preload 3 slides ahead
	});
})();

// Slide toolbar: fullscreen + table of contents
(() => {
	const btnFs = document.getElementById("btn-fullscreen");
	const btnToc = document.getElementById("btn-toc");
	const tocPanel = document.getElementById("toc-panel");
	const tocList = document.getElementById("toc-list");
	const tocClose = document.getElementById("toc-close");
	const backdrop = tocPanel?.querySelector(".toc-panel-backdrop");

	if (!btnFs && !btnToc) return;

	// --- Fullscreen toggle ---
	const fsEnter = document.getElementById("fs-enter");
	const fsExit = document.getElementById("fs-exit");

	if (btnFs) {
		const updateFsIcon = () => {
			const isFs = !!document.fullscreenElement;
			if (fsEnter) fsEnter.style.display = isFs ? "none" : "";
			if (fsExit) fsExit.style.display = isFs ? "" : "none";
		};

		btnFs.addEventListener("click", () => {
			if (document.fullscreenElement) {
				document.exitFullscreen().catch(() => {});
			} else {
				document.documentElement.requestFullscreen().catch(() => {});
			}
		});

		document.addEventListener("fullscreenchange", updateFsIcon);
		updateFsIcon();
	}

	// --- Table of contents ---
	if (btnToc && tocPanel && tocList) {
		const slides = document.querySelectorAll(".reveal .slides > section");

		const tocItems = Array.from(slides).map((section, i) => {
			const h2 = section.querySelector("h2");
			let title = h2 ? h2.textContent.trim().replace(/\s+/g, " ") : null;
			if (!title) {
				title =
					i === 0
						? "Pembukaan"
						: i === slides.length - 1
							? "Penutup"
							: "Slide " + (i + 1);
			}
			return { index: i, title };
		});

		const renderToc = () => {
			const currentIdx =
				typeof Reveal !== "undefined" ? Reveal.getIndices().h : 0;

			while (tocList.firstChild) tocList.removeChild(tocList.firstChild);
			tocItems.forEach((item) => {
				const btn = document.createElement("button");
				btn.className =
					"toc-item" + (item.index === currentIdx ? " active" : "");
				const numSpan = document.createElement("span");
				numSpan.className = "toc-item-num";
				numSpan.textContent = String(item.index + 1);
				const titleSpan = document.createElement("span");
				titleSpan.textContent = item.title;
				btn.appendChild(numSpan);
				btn.appendChild(titleSpan);
				btn.addEventListener("click", () => {
					if (typeof Reveal !== "undefined") {
						Reveal.slide(item.index);
					}
					tocPanel.style.display = "none";
				});
				tocList.appendChild(btn);
			});
		};

		const openToc = () => {
			renderToc();
			tocPanel.style.display = "flex";
		};

		btnToc.addEventListener("click", openToc);

		const closeToc = () => {
			tocPanel.style.display = "none";
		};

		tocClose.addEventListener("click", closeToc);
		if (backdrop) {
			backdrop.addEventListener("click", closeToc);
		}

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && tocPanel.style.display !== "none") {
				closeToc();
			}
		});

		if (typeof Reveal !== "undefined") {
			Reveal.on("slidechanged", () => {
				if (tocPanel.style.display !== "none") {
					renderToc();
				}
			});
		}
	}
})();
