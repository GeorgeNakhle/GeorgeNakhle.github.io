const menuToggle = document.querySelector("#menuToggle");
const aside = document.querySelector("aside");

menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("isActive");
    aside.classList.toggle("isActive");
})