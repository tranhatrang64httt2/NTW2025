import React, { useState, useEffect } from 'react';

// Dữ liệu mẫu (tương tự data.js)
const initialOrdersData = [
    {
        id: 1,
        orderCode: "DH001",
        customer: "Nguyễn Văn An",
        employee: "Trần Thị Bình",
        orderDate: "2024-07-15",
        totalAmount: 1250000,
        status: "Hoàn thành"
    },
    {
        id: 2,
        orderCode: "DH002", 
        customer: "Lê Thị Cẩm",
        employee: "Phạm Văn Dũng",
        orderDate: "2024-07-20",
        totalAmount: 890000,
        status: "Đang xử lý"
    },
    {
        id: 3,
        orderCode: "DH003",
        customer: "Hoàng Minh Đức",
        employee: "Nguyễn Thị Em",
        orderDate: "2024-07-22",
        totalAmount: 2100000,
        status: "Đang xử lý"
    },
    {
        id: 4,
        orderCode: "DH004",
        customer: "Vũ Thị Giang",
        employee: "Đặng Văn Hùng",
        orderDate: "2024-07-18",
        totalAmount: 750000,
        status: "Đã hủy"
    },
    {
        id: 5,
        orderCode: "DH005",
        customer: "Đinh Công Khanh",
        employee: "Bùi Thị Lan",
        orderDate: "2024-07-25",
        totalAmount: 1680000,
        status: "Hoàn thành"
    }
];

// Component Header
const Header = ({ onAddNew }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 mb-8">
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center">
                            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15