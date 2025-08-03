let currentEditingId = null;
let filteredEmployees = [...employeeDatabase];
// Modal controls
function showModal() {
    $('#employeeModal').addClass('active');
}
function hideModal() {
    $('#employeeModal').removeClass('active');
    resetForm();
    currentEditingId = null;
}
function resetForm() {
    $('#employeeForm')[0].reset();
    clearValidationErrors();
    $('#modalTitle').text('Add New Employee');
}
// Event listeners for modal
$('#openModalBtn').on('click', showModal);
$('#closeModalBtn, #cancelModalBtn').on('click', hideModal);
$('#employeeModal').on('click', function(e) {
    if (e.target === this) {
        hideModal();
    }
});
// Form validation functions
function validateEmployeeForm() {
    let isValid = true;
    clearValidationErrors();
    const fullName = $('#fullName').val().trim();
    const emailAddress = $('#emailAddress').val().trim();
    const homeAddress = $('#homeAddress').val().trim();
    const phoneNumber = $('#phoneNumber').val().trim();
    // Validate full name
    if (!fullName) {
        showValidationError('#fullName', '#nameValidation', 'Please enter your full name');
        isValid = false;
    } else if (fullName.length < 2) {
        showValidationError('#fullName', '#nameValidation', 'Full name must be at least 2 characters');
        isValid = false;
    } else {
        showValidationSuccess('#fullName');
    }
    // Validate email
    if (!emailAddress) {
        showValidationError('#emailAddress', '#emailValidation', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(emailAddress)) {
        showValidationError('#emailAddress', '#emailValidation', 'Please enter a valid email address (e.g., user@example.com)');
        isValid = false;
    } else {
        showValidationSuccess('#emailAddress');
    }
    // Validate address
    if (!homeAddress) {
        showValidationError('#homeAddress', '#addressValidation', 'Please enter your address');
        isValid = false;
    } else if (homeAddress.length < 10) {
        showValidationError('#homeAddress', '#addressValidation', 'Address must be at least 10 characters');
        isValid = false;
    } else {
        showValidationSuccess('#homeAddress');
    }
    // Validate phone number
    if (!phoneNumber) {
        showValidationError('#phoneNumber', '#phoneValidation', 'Please enter your phone number');
        isValid = false;
    } else if (!isValidPhoneNumber(phoneNumber)) {
        showValidationError('#phoneNumber', '#phoneValidation', 'Phone number must be exactly 10 digits and start with 0 (e.g., 0987654321)');
        isValid = false;
    } else {
        showValidationSuccess('#phoneNumber');
    }
    return isValid;
}
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
function isValidPhoneNumber(phone) {
    // Must be exactly 10 digits and start with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}
function showValidationError(inputSelector, messageSelector, message) {
    $(inputSelector).removeClass('valid').addClass('invalid');
    $(messageSelector).text(message).addClass('visible');
}
function showValidationSuccess(inputSelector) {
    $(inputSelector).removeClass('invalid').addClass('valid');
}
function clearValidationErrors() {
    $('.form-input').removeClass('invalid valid');
    $('.validation-message').removeClass('visible');
}
// Real-time validation setup
function setupRealTimeValidation() {
    $('#fullName').on('blur', function() {
        const value = $(this).val().trim();
        if (value) {
            if (value.length < 2) {
                showValidationError('#fullName', '#nameValidation', 'Full name must be at least 2 characters');
            } else {
                showValidationSuccess('#fullName');
                $('#nameValidation').removeClass('visible');
            }
        }
    });
    $('#emailAddress').on('blur', function() {
        const value = $(this).val().trim();
        if (value) {
            if (!isValidEmail(value)) {
                showValidationError('#emailAddress', '#emailValidation', 'Please enter a valid email address (e.g., user@example.com)');
            } else {
                showValidationSuccess('#emailAddress');
                $('#emailValidation').removeClass('visible');
            }
        }
    });
    $('#homeAddress').on('blur', function() {
        const value = $(this).val().trim();
        if (value) {
            if (value.length < 10) {
                showValidationError('#homeAddress', '#addressValidation', 'Address must be at least 10 characters');
            } else {
                showValidationSuccess('#homeAddress');
                $('#addressValidation').removeClass('visible');
            }
        }
    });
    $('#phoneNumber').on('input', function() {
        // Only allow digits
        let value = $(this).val().replace(/\D/g, '');
        
        // Limit to 10 characters
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        $(this).val(value);
    });
    $('#phoneNumber').on('blur', function() {
        const value = $(this).val().trim();
        if (value) {
            if (!isValidPhoneNumber(value)) {
                showValidationError('#phoneNumber', '#phoneValidation', 'Phone number must be exactly 10 digits and start with 0 (e.g., 0987654321)');
            } else {
                showValidationSuccess('#phoneNumber');
                $('#phoneValidation').removeClass('visible');
            }
        }
    });
}
// Search functionality
function performSearch() {
    const query = $('#searchInput').val().toLowerCase();
    filteredEmployees = employeeDatabase.filter(employee => 
        employee.fullName.toLowerCase().includes(query) ||
        employee.emailAddress.toLowerCase().includes(query) ||
        employee.homeAddress.toLowerCase().includes(query) ||
        employee.phoneNumber.includes(query)
    );
    renderEmployeeTable();
}
$('#searchBtn').on('click', performSearch);
$('#searchInput').on('keypress', function(e) {
    if (e.which === 13) { // Enter key
        performSearch();
    }
});
// Employee management functions
function saveEmployee() {
    // Validate form before saving
    if (!validateEmployeeForm()) {
        alert('Please fix the errors in the form before saving.');
        return;
    }
    const employeeData = {
        fullName: $('#fullName').val().trim(),
        emailAddress: $('#emailAddress').val().trim(),
        homeAddress: $('#homeAddress').val().trim(),
        phoneNumber: $('#phoneNumber').val().trim()
    };
    // Check for duplicate email (except when editing the same employee)
    const existingEmployee = employeeDatabase.find(emp => 
        emp.emailAddress.toLowerCase() === employeeData.emailAddress.toLowerCase() && 
        emp.id !== currentEditingId
    );
    if (existingEmployee) {
        showValidationError('#emailAddress', '#emailValidation', 'This email address is already in use');
        return;
    }
    // Check for duplicate phone number (except when editing the same employee)
    const existingPhone = employeeDatabase.find(emp => 
        emp.phoneNumber === employeeData.phoneNumber && 
        emp.id !== currentEditingId
    );
    if (existingPhone) {
        showValidationError('#phoneNumber', '#phoneValidation', 'This phone number is already in use');
        return;
    }
    
    if (currentEditingId) {
        // Update existing employee
        const index = employeeDatabase.findIndex(emp => emp.id === currentEditingId);
        if (index !== -1) {
            employeeDatabase[index] = { ...employeeDatabase[index], ...employeeData };
            alert('Employee updated successfully!');
        }
    } else {
        // Add new employee
        const newEmployee = {
            id: Date.now(),
            ...employeeData
        };
        employeeDatabase.push(newEmployee);
        alert('New employee added successfully!');
    }
    
    filteredEmployees = [...employeeDatabase];
    renderEmployeeTable();
    hideModal();
}
// Make editEmployee global for onclick handlers
window.editEmployee = function(employeeId) {
    currentEditingId = employeeId;
    const employee = employeeDatabase.find(emp => emp.id === employeeId);
    
    if (employee) {
        $('#fullName').val(employee.fullName);
        $('#emailAddress').val(employee.emailAddress);
        $('#homeAddress').val(employee.homeAddress);
        $('#phoneNumber').val(employee.phoneNumber);
        
        $('#modalTitle').text('Edit Employee');
        showModal();
    }
};
// Make removeEmployee global for onclick handlers
window.removeEmployee = function(employeeId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employeeDatabase = employeeDatabase.filter(emp => emp.id !== employeeId);
        filteredEmployees = [...employeeDatabase];
        renderEmployeeTable();
        alert('Employee deleted successfully!');
    }
};
function deleteSelectedEmployees() {
    const selectedCheckboxes = $('.employee-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        alert('Please select employees to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} employee(s)?`)) {
        const selectedIds = selectedCheckboxes.map(function() {
            return parseInt($(this).data('id'));
        }).get();
        
        employeeDatabase = employeeDatabase.filter(emp => !selectedIds.includes(emp.id));
        filteredEmployees = [...employeeDatabase];
        renderEmployeeTable();
        alert('Selected employees deleted successfully!');
    }
}
function renderEmployeeTable() {
    const $employeeList = $('#employeeList');
    $employeeList.empty();
    
    filteredEmployees.forEach(employee => {
        const row = $(`
            <tr>
                <td class="checkbox-container">
                    <input type="checkbox" class="custom-checkbox employee-checkbox" data-id="${employee.id}">
                </td>
                <td>${employee.fullName}</td>
                <td>${employee.emailAddress}</td>
                <td>${employee.homeAddress}</td>
                <td>${employee.phoneNumber}</td>
                <td class="actions-cell">
                    <button class="action-btn btn-edit" onclick="editEmployee(${employee.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-remove" onclick="removeEmployee(${employee.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
        $employeeList.append(row);
    });
    
    updateEmployeeCount();
    updateSelectAllCheckbox();
}
function updateEmployeeCount() {
    const totalCount = filteredEmployees.length;
    $('#currentCount').text(Math.min(5, totalCount));
    $('#totalEmployees').text(employeeDatabase.length);
}
function updateSelectAllCheckbox() {
    const $checkboxes = $('.employee-checkbox');
    const $checkedBoxes = $('.employee-checkbox:checked');
    const $selectAll = $('#selectAllCheckbox');
    
    if ($checkboxes.length === 0) {
        $selectAll.prop('indeterminate', false).prop('checked', false);
    } else if ($checkedBoxes.length === $checkboxes.length) {
        $selectAll.prop('indeterminate', false).prop('checked', true);
    } else if ($checkedBoxes.length > 0) {
        $selectAll.prop('indeterminate', true);
    } else {
        $selectAll.prop('indeterminate', false).prop('checked', false);
    }
}
// Event listeners
$('#saveEmployeeBtn').on('click', saveEmployee);
$('#deleteSelectedBtn').on('click', deleteSelectedEmployees);
$('#selectAllCheckbox').on('change', function() {
    const isChecked = $(this).is(':checked');
    $('.employee-checkbox').prop('checked', isChecked);
});
// Delegate event for employee checkboxes
$(document).on('change', '.employee-checkbox', function() {
    updateSelectAllCheckbox();
});
// Initialize the application
renderEmployeeTable();
setupRealTimeValidation();
