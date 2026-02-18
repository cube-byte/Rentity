export {};

const menuLinks = document.querySelectorAll<HTMLDivElement>(".menu-link");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {

        const item = link.parentElement as HTMLElement;

        // cerrar otros menús
        document.querySelectorAll<HTMLElement>(".menu-item").forEach(i => {
            if (i !== item) {
                i.classList.remove("active");
            }
        });

        item.classList.toggle("active");
    });
});