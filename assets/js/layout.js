/**
 * Mathematics Hub - Shared Layout (Sidebar)
 * Injects sidebar navigation into pages.
 */

const sidebarHTML = (rootPath) => `
<div id="sidebar-overlay" class="sidebar-overlay"></div>
<aside id="main-sidebar" class="sidebar">
    <div class="sidebar-header">
        <div class="logo-area">
            <ion-icon name="shapes-outline" style="font-size: 1.8rem; color: var(--accent-color);"></ion-icon>
            <span style="font-weight: 700; font-size: 1.2rem; letter-spacing: -0.5px;">MathHub</span>
        </div>
        <button id="sidebar-close" class="sidebar-toggle-btn mobile-only">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    </div>

    <nav class="sidebar-nav">
        <ul>
            <li>
                <a href="${rootPath}index.html" class="nav-link" data-page="home">
                    <ion-icon name="grid-outline"></ion-icon>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="nav-divider">Ferramentas</li>
            <li>
                <a href="${rootPath}apps/media-calculator/index.html" class="nav-link" data-page="media-calculator">
                    <ion-icon name="school-outline"></ion-icon>
                    <span>Média Escolar</span>
                </a>
            </li>
            <li>
                <a href="${rootPath}apps/currency-converter/index.html" class="nav-link" data-page="currency-converter">
                    <ion-icon name="cash-outline"></ion-icon>
                    <span>Conversor Moedas</span>
                </a>
            </li>
            <li>
                <a href="${rootPath}apps/basic-calculator/index.html" class="nav-link" data-page="basic-calculator">
                    <ion-icon name="calculator-outline"></ion-icon>
                    <span>Calculadora</span>
                </a>
            </li>
        </ul>
    </nav>

    <div class="sidebar-footer">
        <p>Desenvolvido por</p>
        <a href="https://github.com/vitoriapguimaraes" target="_blank" rel="noopener noreferrer">
            <ion-icon name="logo-github"></ion-icon> vitoriapguimaraes
        </a>
    </div>
</aside>

<button id="sidebar-open" class="sidebar-toggle-btn floating-toggle">
    <ion-icon name="menu-outline"></ion-icon>
</button>
`;

function initLayout() {
  // 1. Determine relative path to root
  // If we are in /apps/xxx/index.html, we are 2 levels deep -> ../../
  // If we are in /index.html, we are 0 levels deep -> ./
  const path = window.location.pathname;
  let rootPath = "./";

  if (path.includes("/apps/")) {
    rootPath = "../../";
  }

  // 2. Inject CSS for layout structure if not already handled by style.css (we will update style.css)

  // 3. Inject HTML
  document.body.insertAdjacentHTML("afterbegin", sidebarHTML(rootPath));
  document.body.classList.add("with-sidebar"); // Trigger layout shift

  // 4. Highlight active link
  const currentFile = path.split("/").pop() || "index.html";
  const currentFolder = path.split("/").slice(-2, -1)[0]; // e.g., 'media-calculator'

  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const page = link.getAttribute("data-page");
    if (
      currentFolder === page ||
      (page === "home" && currentFolder !== "apps" && !path.includes("/apps/"))
    ) {
      link.classList.add("active");
    }
  });

  // 5. Build Toggle Logic
  const sidebar = document.getElementById("main-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("sidebar-open");
  const closeBtn = document.getElementById("sidebar-close");

  function toggleSidebar() {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
  }

  openBtn.addEventListener("click", toggleSidebar);
  closeBtn.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLayout);
} else {
  initLayout();
}
