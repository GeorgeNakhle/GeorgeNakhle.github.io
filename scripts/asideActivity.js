const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".sidebarListItem > a");

function asideActivity() {
    var scrollPosition = window.scrollY + 80;

    sections.forEach(section => {
        if (scrollPosition >= section.offsetTop) {
            links.forEach(link => {
                link.classList.remove("activeSidebarListItem");
                if (section.getAttribute("id") === link.getAttribute("href").substring(1)) {
                    link.classList.add("activeSidebarListItem");
                }
            });
        }
    });
}

["load", "scroll"].forEach(e => 
    window.addEventListener(e, asideActivity)
);

// Source: https://permaslug.com/add-a-class-based-on-scroll-position-with-javascript/