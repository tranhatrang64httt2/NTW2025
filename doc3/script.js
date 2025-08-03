// script.js - JavaScript chính cho ứng dụng quản lý nhân viên

// Global variables
let employees = [];
let currentPage = 1;
let pageSize = 10;
let searchTerm = '';
let editingId = null;

// Initialize application
$(document).ready(function() {
    // Load data from data.js if available, otherwise use default data
    if (typeof employeeData !== 'undefined') {
        employees = [...employeeData];
    }
    renderTable();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Modal controls
    $('#addBtn').click(() => openModal());
    $('.close, #cancelBtn').click(() => closeModal());
    $('#saveBtn').click(() => saveEmployee());
    
    // Search
    $('#searchInput').on('input', handleSearch);
    
    // Table interactions
    $(document).on('click', '.btn-edit', handleEdit);
    $(document).on('click', '.btn-delete', handleDelete);
    
    // Form validation with real-time character counting
    $('#employeeName').on('input', function() {
        updateCharacterCount(this, 'nameCount', 15);
        validateField(this);
    });
    
    $('#employeeSurname').on('input', function() {
        updateCharacterCount(this, 'surnameCount', 20);
        validateField(this);
    });
    
    $('#employeeAddress').on('input', function() {
        updateCharacterCount(this, 'addressCount', 50);
        validateField(this);
    });
    
    $('#employeeStatus').on('change', function() {
        validateField(this);
    });
    
    // Modal click outside to close
    $(window).click(function(event) {
        if (event.target.id === 'employeeModal') {
            closeModal();
        }
    });
}

// Update character count display
function updateCharacterCount(input, countId, maxLength) {
    const currentLength = $(input).val().length;
    const countElement = $('#' + countId);
    
    countElement.text(`${currentLength}/${maxLength} ký tự`);
    
    // Update styling based on character count
    countElement.removeClass('warning error');
    if (currentLength > maxLength * 0.8) {
        countElement.addClass('warning');
    }
    if (currentLength >= maxLength) {
        countElement.addClass('error');
    }
}

// Validate individual field
function validateField(field) {
    const $field = $(field);
    const fieldName = $field.attr('name');
    const value = $field.val().trim();
    let errorMessage = '';
    let errorElementId = '';
    
    // Determine field limits and error element
    let maxLength = 0;
    let fieldDisplayName = '';
    
    switch(fieldName) {
        case 'employeeName':
            maxLength = 15;
            fieldDisplayName = 'Tên';
            errorElementId = 'nameError';
            break;
        case 'employeeSurname':
            maxLength = 20;
            fieldDisplayName = 'Họ đệm';
            errorElementId = 'surnameError';
            break;
        case 'employeeAddress':
            maxLength = 50;
            fieldDisplayName = 'Địa chỉ';
            errorElementId = 'addressError';
            break;
        case 'employeeStatus':
            fieldDisplayName = 'Hoạt động';
            errorElementId = 'statusError';
            break;
    }
    
    // Validation rules
    if (fieldName === 'employeeStatus') {
        // Status field validation - always valid as it's a select dropdown
        const errorElement = $('#' + errorElementId);
        errorElement.removeClass('show');
        $field.removeClass('error');
        return true;
    } else if (!value) {
        errorMessage = `${fieldDisplayName} không được để trống`;
    } else if (value.length > maxLength) {
        errorMessage = `${fieldDisplayName} không được vượt quá ${maxLength} ký tự`;
    }
    
    // Display error
    const errorElement = $('#' + errorElementId);
    if (errorMessage) {
        errorElement.text(errorMessage).addClass('show');
        $field.addClass('error');
        return false;
    } else {
        errorElement.removeClass('show');
        $field.removeClass('error');
        return true;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    
    // Validate all fields
    $('#employeeName, #employeeSurname, #employeeAddress, #employeeStatus').each(function() {
        if (!validateField(this)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Clear all validation errors
function clearValidationErrors() {
    $('.error-message').removeClass('show');
    $('input').removeClass('error');
    
    // Reset character counts
    updateCharacterCount($('#employeeName')[0], 'nameCount', 15);
    updateCharacterCount($('#employeeSurname')[0], 'surnameCount', 20);
    updateCharacterCount($('#employeeAddress')[0], 'addressCount', 50);
}

// Render table
function renderTable() {
    const filteredData = getFilteredData();
    
    const tbody = $('#employeeTableBody');
    tbody.empty();
    
    if (filteredData.length === 0) {
        tbody.append('<tr><td colspan="6" style="text-align: center; padding: 40px;">Không có dữ liệu</td></tr>');
        return;
    }
    
    filteredData.forEach(employee => {
        const statusColor = employee.status === '✓' ? 'color: green;' : 'color: red;';
        const row = `
            <tr data-id="${employee.id}">
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-view" title="Xem">👁</button>
                        <button class="btn-small btn-edit" title="Sửa">✏</button>
                        <button class="btn-small btn-delete" title="Xóa">🗑</button>
                    </div>
                </td>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.surname}</td>
                <td>${employee.address}</td>
                <td style="${statusColor}">${employee.status}</td>
            </tr>
        `;
        tbody.append(row);
    });
    
    updateResultsInfo(filteredData.length);
}

// Get filtered data
function getFilteredData() {
    if (!searchTerm) return employees;
    
    return employees.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Update results info
function updateResultsInfo(totalItems) {
    const start = Math.min(1, totalItems);
    const end = Math.min(totalItems, totalItems);
    $('#currentResults').text(`${start} đến ${end}`);
}

// Handle search
function handleSearch() {
    searchTerm = $('#searchInput').val();
    renderTable();
}

// Modal functions
function openModal(employee = null) {
    editingId = employee ? employee.id : null;
    
    if (employee) {
        $('#modalTitle').text('Sửa Nhân viên');
        $('#saveBtn').text('Cập nhật');
        $('#employeeName').val(employee.name);
        $('#employeeSurname').val(employee.surname);
        $('#employeeAddress').val(employee.address);
        $('#employeeStatus').val(employee.status);
        
        // Update character counts for existing data
        updateCharacterCount($('#employeeName')[0], 'nameCount', 15);
        updateCharacterCount($('#employeeSurname')[0], 'surnameCount', 20);
        updateCharacterCount($('#employeeAddress')[0], 'addressCount', 50);
    } else {
        $('#modalTitle').text('Thêm Nhân viên');
        $('#saveBtn').text('Thêm');
        $('#employeeForm')[0].reset();
    }
    
    clearValidationErrors();
    $('#employeeModal').show();
}

function closeModal() {
    $('#employeeModal').hide();
    $('#employeeForm')[0].reset();
    clearValidationErrors();
    editingId = null;
}

// Save employee
function saveEmployee() {
    if (!validateForm()) {
        showAlert('Vui lòng kiểm tra lại thông tin đã nhập', 'error');
        return;
    }
    
    const formData = {
        name: $('#employeeName').val().trim(),
        surname: $('#employeeSurname').val().trim(),
        address: $('#employeeAddress').val().trim(),
        status: $('#employeeStatus').val()
    };
    
    if (editingId) {
        // Update existing employee
        const index = employees.findIndex(e => e.id === editingId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...formData };
            showAlert('Cập nhật nhân viên thành công!', 'success');
        }
    } else {
        // Add new employee
        const newId = Math.max(...employees.map(e => e.id)) + 1;
        employees.push({ id: newId, ...formData });
        showAlert('Thêm nhân viên thành công!', 'success');
    }
    
    closeModal();
    renderTable();
}

// Handle edit
function handleEdit(event) {
    const row = $(event.target).closest('tr');
    const id = parseInt(row.data('id'));
    const employee = employees.find(e => e.id === id);
    
    if (employee) {
        openModal(employee);
    }
}

// Handle delete
function handleDelete(event) {
    const row = $(event.target).closest('tr');
    const id = parseInt(row.data('id'));
    
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        employees = employees.filter(e => e.id !== id);
        showAlert('Xóa nhân viên thành công!', 'success');
        renderTable();
    }
}

// Show alert
function showAlert(message, type) {
    const alertElement = type === 'success' ? $('#successAlert') : $('#errorAlert');
    alertElement.text(message).show();
    
    setTimeout(() => {
        alertElement.hide();
    }, 3000);
}

// Export functions (utility functions for potential future use)
function exportToCSV() {
    const csvContent = generateCSV();
    downloadCSV(csvContent, 'nhan_vien.csv');
    showAlert('Xuất file thành công!', 'success');
}

function generateCSV() {
    const headers = ['STT', 'Tên', 'Họ đệm', 'Địa chỉ', 'Hoạt động'];
    const rows = employees.map(e => [
        e.id,
        e.name,
        e.surname,
        e.address,
        e.status
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

// Add export functionality to export button
$(document).ready(function() {
    $('#exportBtn').click(exportToCSV);
});