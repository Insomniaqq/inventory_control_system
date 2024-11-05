const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    if (currentUser.role === "Закупщик") {
        window.location.href = "store.html";
    } else if (currentUser.role === "Поставщик") {
        window.location.href = "suppliers-store.html";
    } else if (currentUser.role === "Администратор") {
        window.location.href = "admin.html";
    }
}

document.getElementById("button").addEventListener("click", function() {
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    messageDiv.textContent = '';

    if (!login || !password) {
        messageDiv.textContent = "Пожалуйста, заполните все поля.";
        return;
    }

    const usersData = {
        buyers: [
            { id: 1, login: "dmitriy123", password: "1234", role: "Закупщик" },
            { id: 2, login: "ivan123", password: "12345", role: "Закупщик" },
            { id: 3, login: "olga123", password: "passOlga1", role: "Закупщик" },
        ],
        suppliers: [
            { id: 4, login: "metalurg123", password: "metpass123", role: "Поставщик" },
            { id: 5, login: "gorychieva123", password: "gorpass123", role: "Поставщик" },
            { id: 6, login: "chemreactive123", password: "chemsecure1", role: "Поставщик" },
            { id: 7, login: "polymer123", password: "polypass789", role: "Поставщик" },
            { id: 8, login: "stroy123", password: "stroysecure2", role: "Поставщик" },
        ],
        admin: { id: 10, login: "admin", password: "admin1234", role: "Администратор" }
    };

    function saveUserSession(id, role) {
        localStorage.setItem("currentUser", JSON.stringify({ id, login, role }));
    }

    function redirectUser(role) {
        if (role === "Закупщик") {
            window.location.href = "store.html";
        } else if (role === "Поставщик") {
            window.location.href = "suppliers-store.html";
        } else if (role === "Администратор") {
            window.location.href = "admin.html";
        }
    }

    let authenticated = false;

    // Проверка на роль Закупщика
    for (let buyer of usersData.buyers) {
        if (buyer.login === login && buyer.password === password) {
            authenticated = true;
            saveUserSession(buyer.id, buyer.role);
            redirectUser(buyer.role);
            break;
        }
    }

    // Проверка на роль Поставщика
    if (!authenticated) {
        for (let supplier of usersData.suppliers) {
            if (supplier.login === login && supplier.password === password) {
                authenticated = true;
                saveUserSession(supplier.id, supplier.role);
                redirectUser(supplier.role);
                break;
            }
        }
    }

    // Проверка на роль Администратора
    if (!authenticated && usersData.admin.login === login && usersData.admin.password === password) {
        authenticated = true;
        saveUserSession(usersData.admin.id, usersData.admin.role);
        redirectUser(usersData.admin.role);
    }

    // Сообщение об ошибке при неправильных данных
    if (!authenticated) {
        messageDiv.textContent = "Неправильный логин или пароль. Попробуйте снова.";
    }
});

// Запрет ввода пробелов в поля логина и пароля
document.getElementById("login").addEventListener("input", function() {
    this.value = this.value.replace(/\s/g, ''); // Удаляет пробелы
});

document.getElementById("password").addEventListener("input", function() {
    this.value = this.value.replace(/\s/g, ''); // Удаляет пробелы
});

document.getElementById("logoutButton").addEventListener("click", function(event) {
    event.preventDefault(); 

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
});