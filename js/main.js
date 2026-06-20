/* ============================================================
   HRS-201 Human Rights — Shared site behavior
   ============================================================ */

// ---------- Sidebar mobile toggle ----------
function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.querySelector(".menu-btn");
  let backdrop = document.querySelector(".sidebar-backdrop");

  if (!backdrop && sidebar) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  }

  function openSidebar() {
    sidebar.classList.add("open");
    backdrop.classList.add("show");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeSidebar);

  // Close sidebar on link click (mobile)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 880) closeSidebar();
    });
  });
}

// ---------- Accordion (Short / Long Questions) ----------
function initAccordion() {
  document.querySelectorAll(".qa-header").forEach((header) => {
    header.addEventListener("click", () => {
      const block = header.closest(".qa-block");
      block.classList.toggle("open");
    });
  });

  const expandBtn = document.querySelector(".expand-all-btn");
  if (expandBtn) {
    expandBtn.addEventListener("click", () => {
      const blocks = document.querySelectorAll(".qa-block:not([style*='display: none'])");
      const visibleBlocks = Array.from(document.querySelectorAll(".qa-block")).filter(
        (b) => b.style.display !== "none"
      );
      const allOpen = visibleBlocks.every((b) => b.classList.contains("open"));
      visibleBlocks.forEach((b) => {
        if (allOpen) b.classList.remove("open");
        else b.classList.add("open");
      });
      expandBtn.textContent = allOpen ? "Expand all" : "Collapse all";
    });
  }
}

// ---------- Search + Filter (Questions & MCQs) ----------
function initSearchFilter() {
  const searchBox = document.querySelector(".search-box");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll("[data-topic]");
  const resultsCount = document.querySelector(".results-count");

  let activeFilter = "all";

  function applyFilters() {
    const query = searchBox ? searchBox.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    items.forEach((item) => {
      const topic = item.getAttribute("data-topic") || "all";
      const text = item.textContent.toLowerCase();
      const matchesFilter = activeFilter === "all" || topic === activeFilter;
      const matchesSearch = query === "" || text.includes(query);

      if (matchesFilter && matchesSearch) {
        item.style.display = "";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} of ${items.length}`;
    }
  }

  if (searchBox) searchBox.addEventListener("input", applyFilters);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  if (items.length) applyFilters();
}

// ---------- MCQ interactivity ----------
function initMCQs() {
  let score = 0;
  let answered = 0;
  const scoreNum = document.querySelector(".score-num");
  const scoreTotal = document.querySelector(".score-total");

  document.querySelectorAll(".mcq-card").forEach((card) => {
    const options = card.querySelectorAll(".mcq-option");
    const feedback = card.querySelector(".mcq-feedback");

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        if (card.classList.contains("answered")) return;
        card.classList.add("answered");
        answered++;

        const isCorrect = opt.getAttribute("data-correct") === "true";
        options.forEach((o) => o.classList.add("disabled"));

        if (isCorrect) {
          opt.classList.add("correct");
          score++;
          if (feedback) {
            feedback.textContent = "Correct! " + (feedback.getAttribute("data-explain") || "");
            feedback.classList.add("show", "correct-fb");
          }
        } else {
          opt.classList.add("wrong");
          const correctOpt = card.querySelector('[data-correct="true"]');
          if (correctOpt) correctOpt.classList.add("correct");
          if (feedback) {
            feedback.textContent = "Incorrect. " + (feedback.getAttribute("data-explain") || "");
            feedback.classList.add("show", "wrong-fb");
          }
        }

        if (scoreNum) scoreNum.textContent = score;
        if (scoreTotal) scoreTotal.textContent = answered;
      });
    });
  });
}

// ---------- Init on load ----------
document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initAccordion();
  initSearchFilter();
  initMCQs();
});
