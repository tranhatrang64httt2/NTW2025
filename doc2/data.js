// data.js - Dữ liệu JSON mô phỏng CSDL
const transactionData = [
    {
        id: 1102,
        customer: "Vũ Hoài An",
        employee: "Mai Thúc Anh",
        amount: 250000,
        date: "06 Tháng 5 2024 9:00"
    },
    {
        id: 1199,
        customer: "Hoàng Thị Thảng",
        employee: "Nguyễn Văn Hồng",
        amount: 600000,
        date: "06 Tháng 5 2024 7:03"
    },
    {
        id: 1239,
        customer: "Nguyễn Huy Quâng",
        employee: "Nguyễn Văn Hồng",
        amount: 334000,
        date: "06 Tháng 5 2024 8:10"
    },
    {
        id: 1677,
        customer: "Huỳnh Văn Nam",
        employee: "Mai Thúc Anh",
        amount: 150000,
        date: "06 Tháng 5 2024 4:20"
    },
    {
        id: 1439,
        customer: "Nguyễn Hồng Minh",
        employee: "Mai Thúc Anh",
        amount: 354000,
        date: "06 Tháng 5 2024 4:24"
    },
    {
        id: 1501,
        customer: "Trần Thị Lan",
        employee: "Lê Văn Đức",
        amount: 420000,
        date: "07 Tháng 5 2024 10:15"
    },
    {
        id: 1502,
        customer: "Phạm Minh Tuấn",
        employee: "Ngô Thị Hoa",
        amount: 780000,
        date: "07 Tháng 5 2024 14:30"
    },
    {
        id: 1503,
        customer: "Lê Thị Mai",
        employee: "Trần Văn Bình",
        amount: 125000,
        date: "08 Tháng 5 2024 9:45"
    }
];

// Export data for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = transactionData;
}