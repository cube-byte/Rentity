var menuLinks = document.querySelectorAll(".menu-link");
menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        var item = link.parentElement;
        // cerrar otros menús
        document.querySelectorAll(".menu-item").forEach(function (i) {
            if (i !== item) {
                i.classList.remove("active");
            }
        });
        item.classList.toggle("active");
    });
});
