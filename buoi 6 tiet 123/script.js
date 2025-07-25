function themSinhVien() {
    alert("Đã nhấn nút Thêm");
    
    const maSV = document.getElementById("studentId").value;
    const hoTen = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const gioiTinh = document.getElementById("gender").value;
    const ngaySinh = document.getElementById("birthDate").value;
    const ghiChu = document.getElementById("notes").value;
    
    if (!maSV || !hoTen || !email || !gioiTinh || !ngaySinh) {
        alert("Vui lòng điền đầy đủ thông tin!");
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
    newRow.insertCell(7).innerHTML = `<button class="btn-delete" onclick="xoaDong(this)">Xóa</button>`;

    document.getElementById("thongBao").innerText = "Thêm sinh viên thành công!";
    document.getElementById("thongBao").classList.add("show");
    
    setTimeout(() => {
        document.getElementById("thongBao").innerText = "";
        document.getElementById("thongBao").classList.remove("show");
    }, 3000);

    document.getElementById("studentForm").reset();
}

function xoaDong(button) {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) {
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        capNhatSTT();
    }
}

function capNhatSTT() {
    const tbody = document.getElementById("bangSinhVien").getElementsByTagName("tbody")[0];
    const rows = tbody.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }
}

document.getElementById("btnThem").addEventListener("click", function () {
    alert("Đã nhấn nút Thêm");
});