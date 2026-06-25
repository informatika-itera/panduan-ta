const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const CONTENT = path.join(ROOT, "content");
const TEMPLATES = path.join(SRC, "templates");

// --- Read source files ---
const md = fs.readFileSync(path.join(CONTENT, "Pedoman_TA_IF.md"), "utf8");
const changelogMd = fs.readFileSync(path.join(CONTENT, "changelog.md"), "utf8");
const baseTemplate = fs.readFileSync(path.join(TEMPLATES, "base.html"), "utf8");
const styles = fs.readFileSync(path.join(SRC, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(SRC, "script.js"), "utf8");
const slidesContent = fs.readFileSync(path.join(SRC, "slides.html"), "utf8");
const revealThemeCss = fs.readFileSync(
	path.join(SRC, "reveal-theme.css"),
	"utf8",
);

// Read reveal.js vendor files
const revealCss = fs.readFileSync(
	path.join(ROOT, "vendor/reveal.js/reveal.css"),
	"utf8",
);
const revealJs = fs.readFileSync(
	path.join(ROOT, "vendor/reveal.js/reveal.js"),
	"utf8",
);

// --- Extract TOC from markdown ---
function extractToc(md) {
	const lines = md.split("\n");
	const toc = [];
	for (const line of lines) {
		const m = line.match(/^(#{1,4})\s+(.+)/);
		if (m) {
			const level = m[1].length;
			const text = m[2].trim();
			const id = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");
			toc.push({ level, text, id });
		}
	}
	return toc;
}

const toc = extractToc(md);
const tocHtml = toc
	.map((item) => {
		return `<li class="toc-level-${item.level}"><a href="#${item.id}" data-level="${item.level}">${item.text}</a></li>`;
	})
	.join("\n");

// --- Assemble page from base template ---
function assemblePage(title, bodyContent, extraHead = "") {
	const activeTitle = title;
	return baseTemplate
		.replace(/\{\{TITLE\}\}/g, title)
		.replace(/\{\{EXTRA_HEAD\}\}/g, extraHead)
		.replace(/\{\{ACTIVE_HOME\}\}/g, activeTitle === "Beranda" ? "active" : "")
		.replace(
			/\{\{ACTIVE_PEDOMAN\}\}/g,
			activeTitle === "Pedoman" ? "active" : "",
		)
		.replace(
			/\{\{ACTIVE_SOSIALISASI\}\}/g,
			activeTitle === "Sosialisasi" ? "active" : "",
		)
		.replace(
			/\{\{ACTIVE_FORMULIR\}\}/g,
			activeTitle === "Formulir" ? "active" : "",
		)
		.replace(
			/\{\{ACTIVE_CHANGELOG\}\}/g,
			activeTitle === "Changelog" ? "active" : "",
		)
		.replace(/\{\{BODY\}\}/g, "\n" + bodyContent);
}

// --- Read page templates ---
const indexTemplate = fs.readFileSync(
	path.join(TEMPLATES, "index.html"),
	"utf8",
);
const pedomanTemplate = fs.readFileSync(
	path.join(TEMPLATES, "pedoman.html"),
	"utf8",
);
const changelogTemplate = fs.readFileSync(
	path.join(TEMPLATES, "changelog.html"),
	"utf8",
);
const formulirTemplate = fs.readFileSync(
	path.join(TEMPLATES, "formulir.html"),
	"utf8",
);

// === INDEX PAGE ===
const indexHtml = assemblePage("Beranda", indexTemplate);

// === PEDOMAN PAGE ===
const pedomanBody = pedomanTemplate
	.replace(/\{\{TOC_HTML\}\}/g, tocHtml)
	.replace(/\{\{MD_CONTENT\}\}/g, JSON.stringify(md));
const pedomanHtml = assemblePage("Pedoman", pedomanBody);

// === SOSIALISASI PAGE ===
const sosialisasiExtraHead =
	'<link rel="stylesheet" href="vendor/reveal.js/reveal.css">\n' +
	'<link rel="stylesheet" href="reveal-theme.css">';
const sosialisasiBody =
	slidesContent + '\n<script src="vendor/reveal.js/reveal.js"></script>';
const sosialisasiHtml = assemblePage(
	"Sosialisasi",
	sosialisasiBody,
	sosialisasiExtraHead,
);

// === FORMULIR PAGE ===
const formulirHtml = assemblePage("Formulir", formulirTemplate);

// === CHANGELOG PAGE ===
const changelogBody = changelogTemplate.replace(
	/\{\{CHANGELOG_CONTENT\}\}/g,
	JSON.stringify(changelogMd),
);
const changelogHtml = assemblePage("Changelog", changelogBody);

// === WRITE OUTPUT FILES ===
fs.writeFileSync(path.join(ROOT, "index.html"), indexHtml.replace(/\n$/, ""));
fs.writeFileSync(
	path.join(ROOT, "pedoman.html"),
	pedomanHtml.replace(/\n$/, ""),
);
fs.writeFileSync(
	path.join(ROOT, "sosialisasi.html"),
	sosialisasiHtml.replace(/\n$/, ""),
);
fs.writeFileSync(
	path.join(ROOT, "formulir.html"),
	formulirHtml.replace(/\n$/, ""),
);
fs.writeFileSync(
	path.join(ROOT, "changelog.html"),
	changelogHtml.replace(/\n$/, ""),
);
fs.writeFileSync(path.join(ROOT, "styles.css"), styles);
fs.writeFileSync(path.join(ROOT, "script.js"), script);

// Write reveal.js vendor files
const vendorOutDir = path.join(ROOT, "vendor", "reveal.js");
fs.mkdirSync(vendorOutDir, { recursive: true });
fs.writeFileSync(path.join(vendorOutDir, "reveal.css"), revealCss);
fs.writeFileSync(path.join(vendorOutDir, "reveal.js"), revealJs);

// Write reveal theme to root
fs.writeFileSync(path.join(ROOT, "reveal-theme.css"), revealThemeCss);

console.log("Build complete! Files generated:");
console.log("  - index.html");
console.log("  - pedoman.html");
console.log("  - sosialisasi.html");
console.log("  - formulir.html");
console.log("  - changelog.html");
console.log("  - styles.css");
console.log("  - script.js");
console.log("  - reveal-theme.css");
console.log("  - vendor/reveal.js/reveal.css");
console.log("  - vendor/reveal.js/reveal.js");
