document.addEventListener("DOMContentLoaded", function () {
    const jsonData = {
        "КатегорииТоваров": [
            { "КатегорияID": "1", "Категория": "Метал.добавки", "Вещества": [{ "Наименование": "Ферромарганец", "Поставщик": "ООО Металлург" }, { "Наименование": "Силикокальций", "Поставщик": "ООО Металлург" }] },
            { "КатегорияID": "2", "Категория": "Горючие вещества", "Вещества": [{ "Наименование": "Бензин", "Поставщик": "ИП Горючева" }, { "Наименование": "Керосин", "Поставщик": "ИП Горючева" }] },
            { "КатегорияID": "3", "Категория": "Окислители", "Вещества": [{ "Наименование": "Перекись водорода", "Поставщик": "ООО Химреактив" }, { "Наименование": "Нитрат аммония", "Поставщик": "ООО Химреактив" }] },
            { "КатегорияID": "4", "Категория": "Связующие вещества", "Вещества": [{ "Наименование": "Эпоксидная смола", "Поставщик": "ООО Полимер" }, { "Наименование": "Клей ПВА", "Поставщик": "ООО Полимер" }] },
            { "КатегорияID": "5", "Категория": "Конструкционные материалы", "Вещества": [{ "Наименование": "Арматура", "Поставщик": "ИП Стройматериалы" }, { "Наименование": "Металлопрофиль", "Поставщик": "ИП Стройматериалы" }] }
        ],
        
        data: [
            { ТоварID: 1, Наименование: 'Ферромарганец', КоличествоНаСкладе: '90 кг', КатегорияID: '1' },
            { ТоварID: 2, Наименование: 'Силикокальций', КоличествоНаСкладе: '45 кг', КатегорияID: '1' },
            { ТоварID: 3, Наименование: 'Бензин', КоличествоНаСкладе: '480 л', КатегорияID: '2' },
            { ТоварID: 4, Наименование: 'Керосин', КоличествоНаСкладе: '290 л', КатегорияID: '2' },
            { ТоварID: 5, Наименование: 'Перекись водорода', КоличествоНаСкладе: '190 л', КатегорияID: '3' },
            { ТоварID: 6, Наименование: 'Нитрат аммония', КоличествоНаСкладе: '95 кг', КатегорияID: '3' },
            { ТоварID: 7, Наименование: 'Эпоксидная смола', КоличествоНаСкладе: '48 л', КатегорияID: '4' },
            { ТоварID: 8, Наименование: 'Клей ПВА', КоличествоНаСкладе: '98 л', КатегорияID: '4' },
            { ТоварID: 9, Наименование: 'Арматура', КоличествоНаСкладе: '95 шт', КатегорияID: '5' },
            { ТоварID: 10, Наименование: 'Металлопрофиль', КоличествоНаСкладе: '190 шт', КатегорияID: '5' }
        ]
    };

    function populateForm() {
        const categorySelect = document.getElementById('categorySelect');
        const nameSelect = document.getElementById('nameSelect');
        const supplierSelect = document.getElementById('supplierSelect');

        jsonData.КатегорииТоваров.forEach(category => {
            const option = document.createElement('option');
            option.value = category.КатегорияID;
            option.textContent = category.Категория;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', function () {
            nameSelect.innerHTML = '';
            supplierSelect.innerHTML = '';
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
        });

        nameSelect.addEventListener('change', function () {
            const selectedSubstanceName = this.value;
            supplierSelect.innerHTML = '';

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

    populateForm();

    document.getElementById('addButton').addEventListener('click', function () {
        document.getElementById('formContainer-store').style.display = 'flex';
    });

    document.querySelector('.close-button').addEventListener('click', function () {
        document.getElementById('formContainer-store').style.display = 'none';
    });

    
    function loadProductsFromLocalStorage() {
        const productsList = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
        
        productsList.forEach(product => {
            addProductToTable(product);
        });
    }

    
    function addProductToTable(product) {
        const inventoryBody = document.getElementById('inventoryBody');

        const newRow = document.createElement('tr');

        const categoryCell = document.createElement('th');
        categoryCell.scope = 'row';
        categoryCell.textContent = product.category;

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const quantityCell = document.createElement('td');
        quantityCell.textContent = product.quantity;

        const idCell = document.createElement('td');
        idCell.textContent = product.id;

        newRow.appendChild(categoryCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(quantityCell);
        newRow.appendChild(idCell);

        inventoryBody.appendChild(newRow);
    }

    
    loadProductsFromLocalStorage();

    document.getElementById('productForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const categoryID = document.getElementById('categorySelect').value;
        const name = document.getElementById('nameSelect').value;

        
        const productData = jsonData.data.find(product => product.Наименование === name);
        
        if (!productData) {
            alert("Товар не найден в базе данных.");
            return;
        }

        
        const quantityInputValue = document.getElementById('quantityInput').value; 
        const unitInputValue = document.getElementById('unitSelect').value; 

        
        const newProduct = {
            id: productData.ТоварID,
            category: categoryID,
            name: productData.Наименование,
            quantity: `${quantityInputValue} ${unitInputValue}` 
        };

        
        saveProductToLocalStorage(newProduct);

        
        addProductToTable(newProduct);

        
        document.getElementById('formContainer-store').style.display = 'none';
    });

    function saveProductToLocalStorage(product) {
        let productsList = JSON.parse(localStorage.getItem("inventoryProducts")) || [];
        
        productsList.push(product);
        
        localStorage.setItem("inventoryProducts", JSON.stringify(productsList));
    }

    
});