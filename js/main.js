
function setUserId() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.role === "Закупщик") {
        const userIdElement = document.querySelector('.user_id');
        userIdElement.innerHTML = `ЗакупщикID <br>#${currentUser.id}`;
    }
}

document.addEventListener("DOMContentLoaded", setUserId);

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    
    if (!currentUser || currentUser.role !== "Администратор") {
        const adminMenuItem = document.querySelector(".nav__menu .admin");
        if (adminMenuItem) {
            adminMenuItem.style.display = "none";
        }
    }

    const modal = document.getElementById("detailsModal");
    const closeButton = document.querySelector(".close-button");
    const infoButtons = document.querySelectorAll(".info-button");

    
    function openModal() {
        modal.style.display = "flex";
    }

    function closeModal() {
        if (modal) { 
            modal.style.display = "none";
        }
    }

    infoButtons.forEach(button => {
        button.addEventListener("click", openModal);
    });

    if (closeButton) { 
        closeButton.addEventListener("click", closeModal);
    }

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    
    document.getElementById("logoutButton").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
});