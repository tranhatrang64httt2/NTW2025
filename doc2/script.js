// script.js - JavaScript chính cho ứng dụng quản lý giao dịch

// Global variables
let transactions = [];
let currentPage = 1;
let pageSize = 10;
let sortField = '';
let sortOrder = 'asc';
let searchTerm = '';
let selectedRows = [];
let editingId = null;

// Initialize application
$(document).ready(function() {
    // Load data from data.js if available, otherwise use default data
    (typeof transactionData !== 'undefined') 
        transactions = [...transactionData];
    renderTable();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Modal controls
    $('#addBtn').click(() => openModal());
    $('.close, #cancelBtn').click(() => closeModal());
    $('#saveBtn').click(() => saveTransaction());
    
    // Search and pagination
    $('#searchInput').on('input', handleSearch);
    $('#pageSize').change(handlePageSizeChange);
    
    // Table interactions
    $('#selectAll').change(handleSelectAll);
    $(document).on('click', '.row-checkbox', handleRowSelect);
    $(document).on('click', '.btn-edit', handleEdit);
    $(document).on('click', '.btn-delete', handleDelete);
    $(document).on('click', 'th[data-sort]', handleSort);
    
    // Bulk operations
    $('#deleteSelectedBtn').click(handleBulkDelete);
    $('#exportBtn').click(handleExport);
    
    // Form validation
    $('#customerName, #employeeName, #amount').on('blur', validateField);
    
    // Modal click outside to close
    $(window).click(function(event) {
        if (event.target.id === 'transactionModal') {
            closeModal();
        }
    });
}

// Render table with current data
function renderTable() {
    const filteredData = getFilteredData();
    const paginatedData = getPaginatedData(filteredData);
    
    const tbody = $('#transactionTableBody');
    tbody.empty();
    
    if (paginatedData.length === 0) {
        tbody.append('<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>');
        return;
    }
    
    paginatedData.forEach(transaction => {
        const row = `
            <tr data-id="${transaction.id}">
                <td>
                    <input type="checkbox" class="checkbox row-checkbox" value="${transaction.id}">
                    <div class="action-buttons">
                        <button class="btn-small btn-view" title="Xem">👁</button>
                        <button class="btn-small btn-edit" title="Sửa">✏</button>
                        <button class="btn-small btn-delete" title="Xóa">🗑</button>
                    </div>
                </td>
                <td>${transaction.id}</td>
                <td>${transaction.customer}</td>
                <td>${transaction.employee}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.date}</td>
            </tr>
        `;
        tbody.append(row);
    });
    
    updatePagination(filteredData.length);
    updateSelectAllState();
}

// Update pagination controls
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginationContainer = $('#paginationButtons');
    paginationContainer.empty();
    
    // Previous button
    if (currentPage > 1) {
        paginationContainer.append(`<button onclick="changePage(${currentPage - 1})">‹</button>`);
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationContainer.append(`<button class="${activeClass}" onclick="changePage(${i})">${i}</button>`);
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationContainer.append(`<button onclick="changePage(${currentPage + 1})">›</button>`);
    }
    
    $('#currentPageInfo').text(currentPage);
    $('#totalResults').text(totalPages);
}

// Data filtering and sorting functions
function getFilteredData() {
    if (!searchTerm) return getSortedData();
    
    return getSortedData().filter(transaction => 
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm)
    );
}

function getSortedData() {
    if (!sortField) return [...transactions];
    
    return [...transactions].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

function getPaginatedData(data) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
}

// Event handlers
function handleSearch() {
    searchTerm = $('#searchInput').val();
    currentPage = 1;
    renderTable();
}

function handlePageSizeChange() {
    pageSize = parseInt($('#pageSize').val());
    currentPage = 1;
    renderTable();
}

function handleSort(event) {
    const field = $(event.target).data('sort');
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'asc';
    }
    renderTable();
}

function handleSelectAll() {
    const isChecked = $('#selectAll').is(':checked');
    $('.row-checkbox').prop('checked', isChecked);
    updateSelectedRows();
}

function handleRowSelect() {
    updateSelectedRows();
    updateSelectAllState();
}

function updateSelectedRows() {
    selectedRows = $('.row-checkbox:checked').map(function() {
        return parseInt($(this).val());
    }).get();
}

function updateSelectAllState() {
    const totalCheckboxes = $('.row-checkbox').length;
    const checkedCheckboxes = $('.row-checkbox:checked').length;
    
    $('#selectAll').prop('checked', totalCheckboxes > 0 && checkedCheckboxes === totalCheckboxes);
}

function changePage(page) {
    currentPage = page;
    renderTable();
}

// Modal functions
function openModal(transaction = null) {
    editingId = transaction ? transaction.id : null;
    
    if (transaction) {
        $('#modalTitle').text('Sửa giao dịch');
        $('#saveBtn').text('Cập nhật');
        $('#customerName').val(transaction.customer);
        $('#employeeName').val(transaction.employee);
        $('#amount').val(transaction.amount);
    } else {
        $('#modalTitle').text('Thêm giao dịch');
        $('#saveBtn').text('Thêm');
        $('#transactionForm')[0].reset();
    }
    
    clearValidationErrors();
    $('#transactionModal').show();
}

function closeModal() {
    $('#transactionModal').hide();
    $('#transactionForm')[0].reset();
    clearValidationErrors();
    editingId = null;
}

function saveTransaction() {
    if (!validateForm()) return;
    
    const formData = {
        customer: $('#customerName').val().trim(),
        employee: $('#employeeName').val().trim(),
        amount: parseInt($('#amount').val()),
        date: new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    if (editingId) {
        // Update existing transaction
        const index = transactions.findIndex(t => t.id === editingId);
        if (index !== -1) {
            transactions[index] = { ...transactions[index], ...formData };
            showAlert('Cập nhật giao dịch thành công!', 'success');
        }
    } else {
        // Add new transaction
        const newId = Math.max(...transactions.map(t => t.id)) + 1;
        transactions.push({ id: newId, ...formData });
        showAlert('Thêm giao dịch thành công!', 'success');
    }
    
    closeModal();
    renderTable();
}

// Validation functions
function validateForm() {
    let isValid = true;
    
    isValid = validateField($('#customerName')) && isValid;
    isValid = validateField($('#employeeName')) && isValid;
    isValid = validateField($('#amount')) && isValid;
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.attr('name');
    const value = field.val().trim();
    let errorMessage = '';
    
    if (!value) {
        errorMessage = 'Trường này không được để trống';
    } else if (fieldName === 'customerName' && value.length > 30) {
        errorMessage = 'Tên khách hàng không được quá 30 ký tự';
    } else if (fieldName === 'employeeName' && value.length > 30) {
        errorMessage = 'Tên nhân viên không được quá 30 ký tự';
    } else if (fieldName === 'amount' && (isNaN(value) || parseInt(value) <= 0)) {
        errorMessage = 'Số tiền phải là số dương';
    }
    
    const errorElement = $(`#${fieldName.replace('Name', '')}Error`);
    if (errorMessage) {
        errorElement.text(errorMessage).show();
        field.css('border-color', '#dc3545');
        return false;
    } else {
        errorElement.hide();
        field.css('border-color', '#ddd');
        return true;
    }
}

function clearValidationErrors() {
    $('.error-message').hide();
    $('input').css('border-color', '#ddd');
}

// CRUD operations
function handleEdit(event) {
    const row = $(event.target).closest('tr');
    const id = parseInt(row.data('id'));
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction) {
        openModal(transaction);
    }
}

function handleDelete(event) {
    const row = $(event.target).closest('tr');
    const id = parseInt(row.data('id'));
    
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
        transactions = transactions.filter(t => t.id !== id);
        showAlert('Xóa giao dịch thành công!', 'success');
        renderTable();
    }
}

function handleBulkDelete() {
    if (selectedRows.length === 0) {
        showAlert('Vui lòng chọn ít nhất một giao dịch để xóa', 'error');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.length} giao dịch đã chọn?`)) {
        transactions = transactions.filter(t => !selectedRows.includes(t.id));
        selectedRows = [];
        showAlert(`Đã xóa giao dịch thành công!`, 'success');
        renderTable();
    }
}

function handleExport() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'giao_dich.csv');
    showAlert('Xuất file thành công!', 'success');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function showAlert(message, type) {
    const alertElement = type === 'success' ? $('#successAlert') : $('#errorAlert');
    alertElement.text(message).show();
    
    setTimeout(() => {
        alertElement.hide();
    }, 3000);
}

function generateCSV() {
    const headers = ['ID', 'Khách hàng', 'Nhân viên', 'Số tiền', 'Ngày mua'];
    const rows = transactions.map(t => [
        t.id,
        t.customer,
        t.employee,
        t.amount,
        t.date
    ]);
    
    const csvArray = [headers, ...rows];
    return csvArray.map(row => row.join(',')).join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}