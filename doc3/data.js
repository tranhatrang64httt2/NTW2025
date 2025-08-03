// data.js - Dữ liệu nhân viên mẫu

const employeeData = [
    {
        id: 1,
        name: "Mai",
        surname: "Thúc Anh",
        address: "23 Hoàng Đạo Thúy, Thanh Xuân, Hà Nội",
        status: "✓"
    },
    {
        id: 2,
        name: "Hoàng",
        surname: "Sinh Hồng",
        address: "23 Hoàng Đạo Thúy, Thanh Xuân, Hà Nội",
        status: "✗"
    },
    {
        id: 3,
        name: "Tân",
        surname: "Mai Trung",
        address: "1481 Bưởi Láng, Cầu Giấy, Hà Nội",
        status: "✓"
    },
    {
        id: 4,
        name: "Hồng",
        surname: "Nguyễn Văn",
        address: "1481 Bưởi Láng, Cầu Giấy, Hà Nội",
        status: "✗"
    },
    {
        id: 5,
        name: "Linh",
        surname: "Trần Thị",
        address: "45 Lê Duẩn, Hai Bà Trưng, Hà Nội",
        status: "✓"
    },
    {
        id: 6,
        name: "Dũng",
        surname: "Phạm Minh",
        address: "78 Nguyễn Trãi, Thanh Xuân, Hà Nội",
        status: "✓"
    },
    {
        id: 7,
        name: "Hương",
        surname: "Lê Thị",
        address: "102 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        status: "✗"
    },
    {
        id: 8,
        name: "Tuấn",
        surname: "Vũ Minh",
        address: "56 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội",
        status: "✓"
    }
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = employeeData;
}