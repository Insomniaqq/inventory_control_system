document.addEventListener("DOMContentLoaded", function () {
    
    function loadCurrentUser() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            console.error("Данные текущего пользователя недоступны.");
            return null; 
        }
        return currentUser; 
    }

    const currentUser = loadCurrentUser(); 

    
    function loadActiveOrders() {
        const ordersContainer = document.querySelector('.buyers-list');
        ordersContainer.innerHTML = ''; 

        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        if (orders.length === 0) {
            ordersContainer.style.display = 'none'; 
            return;
        }

        ordersContainer.style.display = 'block';

        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('buyer-item');
            
            orderItem.innerHTML = `
                <div class="item">ЗакупщикID: <span>${currentUser ? currentUser.id : "Не указано"}</span></div>
                <div class="item">ЗаказID: <span>${order.orderID}</span></div>
                <div class="item">Дата: <span>${order.date}</span></div>
                <div class="item">Статус: <span>${order.status}</span></div>
                <button class="info-button item">Информация</button>
                <button class="delete-button item" data-order-id="${order.orderID}">Отменить</button>`; 
            
            orderItem.querySelector('.info-button').addEventListener('click', function() {
                showOrderDetails(order);
            });

            orderItem.querySelector('.delete-button').addEventListener('click', function(event) {
                const orderID = event.target.getAttribute('data-order-id'); 
                deleteOrder(orderID); 
            });

            ordersContainer.appendChild(orderItem);
        });
    }

    
    function showOrderDetails(order) {
        if (!currentUser) {
            console.error("Данные текущего пользователя недоступны.");
            return; 
        }

        document.getElementById('detailId').textContent = order.orderID;
        document.getElementById('detailClientName').textContent = currentUser.name || "Не указано"; 
        document.getElementById('detailPhone').textContent = currentUser.phone || "Не указано"; 
        document.getElementById('detailEmail').textContent = currentUser.email || "Не указано"; 

        const addressParts = order.address.split(', ');
        document.getElementById('detailCity').textContent = addressParts[0] || 'Не указано'; 
        document.getElementById('detailStreet').textContent = addressParts[1] || 'Не указано'; 
        document.getElementById('detailHouse').textContent = addressParts[2] || 'Не указано'; 

        
        document.getElementById('detailCategory').textContent = order.category || "Не указано"; 
        document.getElementById('detailName').textContent = order.name || "Не указано"; 
        document.getElementById('detailQuantity').textContent = order.quantity || "Не указано"; 

        const modal = document.getElementById("detailsModal");
        modal.style.display = "block";

        modal.querySelector('.close-button').onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    
    function deleteOrder(orderID) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        
        orders = orders.filter(order => order.orderID !== orderID);
        
        localStorage.setItem('orders', JSON.stringify(orders)); 
        loadActiveOrders(); 
    }

    
    const clearButton = document.querySelector('.add-button');
    if (clearButton) { 
        clearButton.addEventListener('click', function () {
            if (confirm("Вы уверены, что хотите удалить все активные заказы?")) {
                localStorage.removeItem('orders');
                const ordersContainer = document.querySelector('.buyers-list');
                ordersContainer.innerHTML = '';
                ordersContainer.style.display = 'none'; 
            }
        });
    }

    loadActiveOrders(); 

    
    if (!currentUser || currentUser.role !== "Администратор") {
        const adminMenuItem = document.querySelector(".nav__menu .admin");
        if (adminMenuItem) {
            adminMenuItem.style.display = "none";
        }
    }
});