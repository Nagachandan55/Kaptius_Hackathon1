function updateTables() {
    const incomeTable = document.getElementById('incomeTable').getElementsByTagName('tbody')[0];
    const expenditureTable = document.getElementById('expenditureTable').getElementsByTagName('tbody')[0];
    const totalInput = document.getElementById('Total');

    // Retrieve filter values for income and expenditure
    const incomeStartDate = document.getElementById('incomeStartDate').value ? new Date(document.getElementById('incomeStartDate').value) : null;
    const incomeEndDate = document.getElementById('incomeEndDate').value ? new Date(document.getElementById('incomeEndDate').value) : null;
    const expenditureStartDate = document.getElementById('expenditureStartDate').value ? new Date(document.getElementById('expenditureStartDate').value) : null;
    const expenditureEndDate = document.getElementById('expenditureEndDate').value ? new Date(document.getElementById('expenditureEndDate').value) : null;

    // Retrieve income and expenditure entries from localStorage
    const entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Filter and display income and expenditure entries
    const incomes = entries.filter(entry => entry.type === 'income');
    const expenditures = entries.filter(entry => entry.type === 'expenditure');

    // Apply date filter to income entries if dates are provided
    const filteredIncomes = incomes.filter(entry => {
        const entryDate = new Date(entry.date);
        return (!incomeStartDate || entryDate >= incomeStartDate) && (!incomeEndDate || entryDate <= incomeEndDate);
    });

    // Apply date filter to expenditure entries if dates are provided
    const filteredExpenditures = expenditures.filter(entry => {
        const entryDate = new Date(entry.date);
        return (!expenditureStartDate || entryDate >= expenditureStartDate) && (!expenditureEndDate || entryDate <= expenditureEndDate);
    });

    // Calculate total amount from unfiltered data
    let totalAmount = 0;
    incomes.forEach(entry => totalAmount += entry.amount);
    expenditures.forEach(entry => totalAmount -= entry.amount);

    // Function to populate a table with entries
    function populateTable(tableBody, entries) {
        tableBody.innerHTML = ''; // Clear existing rows
        entries.forEach(entry => {
            const row = document.createElement('tr');
            row.className = entry.type === 'income' ? 'income' : 'expenditure';
            row.innerHTML = `
                <td>${entry.description}</td>
                <td>${entry.date}</td>
                <td>${entry.amount}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Populate income and expenditure tables with filtered data
    populateTable(incomeTable, filteredIncomes);
    populateTable(expenditureTable, filteredExpenditures);

    // Update total amount input field
    totalInput.value = totalAmount.toFixed(2); // Format to 2 decimal places

    // Update border color based on total amount
    updateBorderColor(totalAmount);
}

function updateBorderColor(totalAmount) {
    const totalInput = document.getElementById('Total');

    if (totalAmount < 50000) {
        totalInput.style.borderColor = 'red';
    } else if (totalAmount >= 50000 && totalAmount <= 60000) {
        totalInput.style.borderColor = 'yellow';
    } else if (totalAmount > 60000) {
        totalInput.style.borderColor = 'green';
    }
}

function clearFilter(type) {
    if (type === 'income') {
        document.getElementById('incomeStartDate').value = '';
        document.getElementById('incomeEndDate').value = '';
    } else if (type === 'expenditure') {
        document.getElementById('expenditureStartDate').value = '';
        document.getElementById('expenditureEndDate').value = '';
    }
    updateTables();
}

window.onload = updateTables;