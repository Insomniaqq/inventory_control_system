document.addEventListener("DOMContentLoaded", function () {
    const jsonData = {
      "КатегорииТоваров": [
        { "КатегорияID": "1", "Категория": "Метал.добавки", "Вещества": [{ "Наименование": "Ферромарганец", "Поставщик": "ООО Металлург" }, { "Наименование": "Силикокальций", "Поставщик": "ООО Металлург" }] },
        { "КатегорияID": "2", "Категория": "Горючие вещества", "Вещества": [{ "Наименование": "Бензин", "Поставщик": "ИП Горючева" }, { "Наименование": "Керосин", "Поставщик": "ИП Горючева" }] },
        { "КатегорияID": "3", "Категория": "Окислители", "Вещества": [{ "Наименование": "Перекись водорода", "Поставщик": "ООО Химреактив" }, { "Наименование": "Нитрат аммония", "Поставщик": "ООО Химреактив" }] },
        { "КатегорияID": "4", "Категория": "Связующие вещества", "Вещества": [{ "Наименование": "Эпоксидная смола", "Поставщик": "ООО Полимер" }, { "Наименование": "Клей ПВА", "Поставщик": "ООО Полимер" }] },
        { "КатегорияID": "5", "Категория": "Конструкционные материалы",  "Вещества": [{ "Наименование": "Арматура", "Поставщик": "ИП Стройматериалы"}, {"Наименование": "Металлопрофиль", "Поставщик": "ИП Стройматериалы"}] }
      ],
    };
  
    const formContainer = document.getElementById("formContainer");
    const closeButton = document.querySelector(".close-button");
    const createButton = document.getElementById("createButton");
    const tableBody = document.querySelector(".table tbody"); 
    const cityInput = document.querySelector('.adress input[placeholder="Город"]');
    const streetInput = document.querySelector('.adress input[placeholder="Улица"]');
    const houseInput = document.querySelector('.adress input[placeholder="Дом"]');

    
    function preventInvalidCharacters(event) {
        const invalidChars = /[@#$%^&*]/; 
        if (invalidChars.test(event.key)) {
            event.preventDefault(); 
        }
    }

    
    cityInput.addEventListener('keydown', function(event) {
        
        if (event.key.length === 1 && /\d/.test(event.key)) {
            event.preventDefault();
        }
        preventInvalidCharacters(event); 
    });

    streetInput.addEventListener('keydown', function(event) {
        preventInvalidCharacters(event); 
    });

    houseInput.addEventListener('keydown', function(event) {
        preventInvalidCharacters(event); 
    });

    createButton.addEventListener("click", function () {
      formContainer.style.display = 'flex'; 
      populateForm(); 
    });
  
    closeButton.addEventListener("click", function () {
      formContainer.style.display = 'none'; 
    });
  
    function populateForm() {
      const categorySelect = document.querySelector('.category select');
      const nameSelect = document.querySelector('.name select');
      const supplierSelect = document.querySelector('.man select');
  
      categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
      nameSelect.innerHTML = '<option value="">Выберите наименование</option>';
      supplierSelect.innerHTML = '<option value="">Выберите поставщика</option>';
  
      jsonData.КатегорииТоваров.forEach(category => {
        const option = document.createElement('option');
        option.value = category.КатегорияID;
        option.textContent = category.Категория;
        categorySelect.appendChild(option);
      });
  
      categorySelect.addEventListener('change', function () {
        nameSelect.innerHTML = '<option value="">Выберите наименование</option>'; 
        supplierSelect.innerHTML = '<option value="">Выберите поставщика</option>'; 
  
        const selectedCategoryId = this.value;
  
        jsonData.КатегорииТоваров.forEach(category => {
          if (category.КатегорияID === selectedCategoryId) {
            category.Вещества.forEach(substance => {
              const option = document.createElement('option');
              option.textContent = substance.Наименование;
              option.value = substance.Наименование;
              nameSelect.appendChild(option);
            });
          }
        });
  
        if (nameSelect.options.length > 1) {
          nameSelect.selectedIndex = 1; 
          nameSelect.dispatchEvent(new Event('change')); 
        }
      });
  
      nameSelect.addEventListener('change', function () {
        const selectedSubstanceName = this.value;
        supplierSelect.innerHTML = '<option value="">Выберите поставщика</option>'; 
  
        jsonData.КатегорииТоваров.forEach(category => {
          category.Вещества.forEach(substance => {
            if (substance.Наименование === selectedSubstanceName) {
              const supplierOption = document.createElement('option');
              supplierOption.textContent = substance.Поставщик;
              supplierOption.value = substance.Поставщик;
              supplierSelect.appendChild(supplierOption);
            }
          });
        });
      });
    }
    
    function generateOrderID() {
      return 'ORD-' + Math.floor(Math.random() * 1000000); 
    }
    
    document.querySelector(".submit-button").addEventListener("click", function (event) {
      event.preventDefault();
  
      const categoryID = document.querySelector('.category select').value;
      const name = document.querySelector('.name select').value;
      const quantityInput = document.querySelector('.amount input[type="number"]').value;
      const unit = document.querySelector('.amount select').value;
  
      const addressCity = document.querySelector('.adress input[placeholder="Город"]').value;
      const addressStreet = document.querySelector('.adress input[placeholder="Улица"]').value;
      const addressHouse = document.querySelector('.adress input[placeholder="Дом"]').value;
  
      if (!categoryID || !name || !quantityInput || !unit || !addressCity || !addressStreet || !addressHouse) {
        alert("Пожалуйста, заполните все поля.");
        return; 
      }

      const basePricePerUnit = Math.floor(Math.random() * 1000) + 100; 
      const totalPrice = basePricePerUnit * quantityInput; 
      
      
      const orderID = generateOrderID();

    
      const orderData = {
        orderID: orderID,
        category: jsonData.КатегорииТоваров.find(cat => cat.КатегорияID === categoryID).Категория,
        name: name,
        supplier: document.querySelector('.man select').value,
        quantity: `${quantityInput} ${unit}`,
        totalPrice: totalPrice,
        address: `${addressCity}, ${addressStreet}, ${addressHouse}`,
        date: new Date().toLocaleDateString('ru-RU'), 
        status: 'Ожидание' 
    };

      
      saveOrderToLocalStorage(orderData);

      
      addRowToTable(orderData);
      
      formContainer.style.display = 'none'; 
    });

    function saveOrderToLocalStorage(order) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    function addRowToTable(order) {
        const newRow = tableBody.insertRow(); 
        newRow.insertCell(0).textContent = order.category; 
        newRow.insertCell(1).textContent = order.name; 
        newRow.insertCell(2).textContent = order.supplier; 
        newRow.insertCell(3).textContent = order.quantity; 
        newRow.insertCell(4).textContent = order.totalPrice; 
        newRow.insertCell(5).textContent = order.orderID; 
    }

  
    loadOrdersFromLocalStorage();

    function loadOrdersFromLocalStorage() {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        orders.forEach(order => {
            addRowToTable(order);
        });
    }
});