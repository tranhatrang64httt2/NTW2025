// File script.js - JavaScript chính xử lý logic ứng dụng (CÂU 2)

/**
 * Định dạng tiền tệ theo chuẩn Việt Nam
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Định dạng ngày tháng theo chuẩn Việt Nam
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} - Ngày tháng đã định dạng
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN');
}

/**
 * Lấy class CSS cho trạng thái đơn hàng
 * @param {string} status - Trạng thái đơn hàng
 * @returns {string} - Class CSS tương ứng
 */
function getStatusClass(status) {
    switch(status) {
        case 'Đang xử lý': 
            return 'status-pending';
        case 'Hoàn thành': 
            return 'status-completed';
        case 'Đã hủy': 
            return 'status-cancelled';
        default: 
            return 'status-pending';
    }
}

/**
 * Load và hiển thị dữ liệu đơn hàng ra bảng
 */
function loadOrdersData() {
    const tbody = document.getElementById('ordersTableBody');
    
    // Xóa dữ liệu cũ
    tbody.innerHTML = '';
    
    // Duyệt qua từng đơn hàng và tạo hàng trong bảng
    ordersData.forEach((order, index) => {
        const row = document.createElement('tr');
        
        // Thêm class cho hàng chẵn/lẻ
        if (index % 2 === 0) {
            row.classList.add('table-row-even');
        }
        
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td style="text-align: left;">${order.customerName}</td>
            <td style="text-align: left;">${order.employeeName}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td style="text-align: right; font-weight: 600; color: #28a745;">
                ${formatCurrency(order.totalAmount)}
            </td>
            <td>
                <span class="status-badge ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td>
                <button class="btn-action btn-view" title="Xem chi tiết" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Hiển thị thông tin tổng số đơn hàng
    updateOrderSummary();
}

/**
 * Cập nhật thông tin tổng quan về đơn hàng
 */
function updateOrderSummary() {
    const totalOrders = ordersData.length;
    const completedOrders = ordersData.filter(order => order.status === 'Hoàn thành').length;
    const processingOrders = ordersData.filter(order => order.status === 'Đang xử lý').length;
    
    console.log(`Tổng số đơn hàng: ${totalOrders}`);
    console.log(`Đơn hàng hoàn thành: ${completedOrders}`);
    console.log(`Đơn hàng đang xử lý: ${processingOrders}`);
}

/**
 * Xem chi tiết đơn hàng
 * @param {string} orderId - Mã đơn hàng
 */
function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        alert(`Chi tiết đơn hàng ${orderId}:\n\n` +
              `Khách hàng: ${order.customerName}\n` +
              `Nhân viên: ${order.employeeName}\n` +
              `Ngày đặt: ${formatDate(order.orderDate)}\n` +
              `Tổng tiền: ${formatCurrency(order.totalAmount)}\n` +
              `Trạng thái: ${order.status}\n` +
              `Ghi chú: ${order.notes || 'Không có'}`);
    }
}

/**
 * Xóa tất cả thông báo lỗi
 */
function clearErrors() {
    // Xóa text lỗi
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    // Xóa class invalid
    const formControls = document.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.classList.remove('is-invalid');
    });
}

/**
 * Hiển thị thông báo lỗi cho trường cụ thể
 * @param {string} fieldId - ID của trường input
 * @param {string} message - Thông báo lỗi
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const fieldElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (fieldElement) {
        fieldElement.classList.add('is-invalid');
    }
}

/**
 * Validation form - Kiểm tra tính hợp lệ của dữ liệu (CÂU 2)
 * @returns {boolean} - true nếu dữ liệu hợp lệ, false nếu có lỗi
 */
function validateForm() {
    // Xóa lỗi cũ
    clearErrors();
    
    let isValid = true;

    // Lấy giá trị từ form
    const customerName = document.getElementById('customerName').value.trim();
    const employeeName = document.getElementById('employeeName').value.trim();
    const orderDate = document.getElementById('orderDate').value;
    const totalAmount = document.getElementById('totalAmount').value;
    const status = document.getElementById('status').value;

    // Kiểm tra tên khách hàng
    if (!customerName) {
        showError('customerName', 'Vui lòng nhập tên khách hàng');
        isValid = false;
    } else if (customerName.length > 30) {
        showError('customerName', 'Tên khách hàng không được quá 30 ký tự');
        isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(customerName)) {
        showError('customerName', 'Tên khách hàng chỉ được chứa chữ cái và khoảng trắng');
        isValid = false;
    }

    // Kiểm tra tên nhân viên
    if (!employeeName) {
        showError('employeeName', 'Vui lòng nhập tên nhân viên');
        isValid = false;
    } else if (employeeName.length > 30) {
        showError('employeeName', 'Tên nhân viên không được quá 30 ký tự');
        isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(employeeName)) {
        showError('employeeName', 'Tên nhân viên chỉ được chứa chữ cái và khoảng trắng');
        isValid = false;
    }

    // Kiểm tra ngày đặt hàng
    if (!orderDate) {
        showError('orderDate', 'Vui lòng chọn ngày đặt hàng');
        isValid = false;
    } else {
        const selectedDate = new Date(orderDate);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (selectedDate > today) {
            showError('orderDate', 'Ngày đặt hàng không được lớn hơn ngày hiện tại');
            isValid = false;
        } else if (selectedDate < oneYearAgo) {
            showError('orderDate', 'Ngày đặt hàng không được quá 1 năm trước');
            isValid = false;
        }
    }

    // Kiểm tra tổng tiền
    if (!totalAmount) {
        showError('totalAmount', 'Vui lòng nhập tổng tiền');
        isValid = false;
    } else if (isNaN(totalAmount) || parseFloat(totalAmount) <= 0) {
        showError('totalAmount', 'Tổng tiền phải là số dương');
        isValid = false;
    } else if (parseFloat(totalAmount) > 100000000) {
        showError('totalAmount', 'Tổng tiền không được vượt quá 100 triệu VNĐ');
        isValid = false;