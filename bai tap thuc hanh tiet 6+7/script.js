let selectedRow = null;

// Hàm hiển thị thông báo
function thongBao(message) {
    document.getElementById("thongBao").innerText = message;
    document.getElementById("thongBao").classList.add("show");
    
    setTimeout(() => {
        document.getElementById("thongBao").classList.remove("show");
    }, 3000);
}

// Hàm thêm sinh viên
function themSinhVien() {
    const maSV = document.getElementById("studentId").value.trim();
    const hoTen = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const gioiTinh = document.getElementById("gender").value;
    const ngaySinh = document.getElementById("birthDate").value;
    const ghiChu = document.getElementById("notes").value.trim();
    
    // Validation đơn giản
    if (!maSV || !hoTen || !email || !gioiTinh || !ngaySinh) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Kiểm tra email
    let regexEmail = /^\S+@\S+\.\S+$/;
    if (!regexEmail.test(email)) {
        alert("Email không hợp lệ!");
        return;
    }

    let table = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();
    let stt = table.rows.length;
    const dateFormatted = new Date(ngaySinh).toLocaleDateString('vi-VN');
    
    newRow.insertCell(0).innerText = stt;
    newRow.insertCell(1).innerText = maSV;
    newRow.insertCell(2).innerText = hoTen;
    newRow.insertCell(3).innerText = email;
    newRow.insertCell(4).innerText = gioiTinh;
    newRow.insertCell(5).innerText = dateFormatted;
    newRow.insertCell(6).innerText = ghiChu;
    newRow.insertCell(7).innerHTML = `
        <button class="btn-edit" onclick="suaDong(this)">Sửa</button>
        <button class="btn-delete" onclick="xoaDong(this)">Xóa</button>
    `;

    thongBao("Thêm sinh viên thành công!");
    document.getElementById("studentForm").reset();
}

// Hàm xóa dòng
function xoaDong(btn) {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
        btn.parentElement.parentElement.remove();
        capNhatSTT();
        thongBao("Xóa thành công!");
    }
}

// Hàm cập nhật STT
function capNhatSTT() {
    const tbody = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

// Hàm sửa dòng
function suaDong(btn) {
    selectedRow = btn.parentElement.parentElement;
    
    document.getElementById("studentId").value = selectedRow.cells[1].innerText;
    document.getElementById("fullName").value = selectedRow.cells[2].innerText;
    document.getElementById("email").value = selectedRow.cells[3].innerText;
    document.getElementById("gender").value = selectedRow.cells[4].innerText;
    
    // Chuyển ngày từ dd/mm/yyyy sang yyyy-mm-dd
    const ngayViet = selectedRow.cells[5].innerText;
    const [ngay, thang, nam] = ngayViet.split('/');
    document.getElementById("birthDate").value = `${nam}-${thang.padStart(2, '0')}-${ngay.padStart(2, '0')}`;
    
    document.getElementById("notes").value = selectedRow.cells[6].innerText;

    // Chuyển nút "Thêm" thành "Cập nhật"
    document.getElementById("formTitle").innerText = "Chỉnh sửa sinh viên";
    document.getElementById("btnThem").style.display = "none";
    document.getElementById("btnCapNhat").style.display = "block";
    document.getElementById("btnHuy").style.display = "block";
}

// Hàm cập nhật sinh viên
function capNhatSinhVien() {
    if (selectedRow) {
        const maSV = document.getElementById("studentId").value.trim();
        const hoTen = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const gioiTinh = document.getElementById("gender").value;
        const ngaySinh = document.getElementById("birthDate").value;
        const ghiChu = document.getElementById("notes").value.trim();

        if (!maSV || !hoTen || !email || !gioiTinh || !ngaySinh) {
            alert("Vui lòng điển đầy đủ thông tin!");
            return;
        }

        const dateFormatted = new Date(ngaySinh).toLocaleDateString('vi-VN');

        selectedRow.cells[1].innerText = maSV;
        selectedRow.cells[2].innerText = hoTen;
        selectedRow.cells[3].innerText = email;
        selectedRow.cells[4].innerText = gioiTinh;
        selectedRow.cells[5].innerText = dateFormatted;
        selectedRow.cells[6].innerText = ghiChu;

        thongBao("Cập nhật thành công!");
        huyChinhSua();
    }
}

// Hàm hủy chỉnh sửa
function huyChinhSua() {
    selectedRow = null;
    document.getElementById("studentForm").reset();
    document.getElementById("formTitle").innerText = "Thêm sinh viên mới";
    document.getElementById("btnThem").style.display = "block";
    document.getElementById("btnCapNhat").style.display = "none";
    document.getElementById("btnHuy").style.display = "none";
}