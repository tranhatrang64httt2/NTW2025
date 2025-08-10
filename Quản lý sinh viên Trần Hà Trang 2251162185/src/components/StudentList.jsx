import React from 'react'
import { Link } from 'react-router-dom'

export default function StudentList({ students, onDeleteStudent }) {

  const deleteStudent = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      onDeleteStudent(id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="card">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">Danh sách sinh viên</h5>
      </div>
      <div className="card-body">
        {students.length === 0 ? (
          <div className="text-center text-muted">
            <p>Chưa có sinh viên nào trong danh sách</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã SV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="badge bg-primary">{student.studentId}</span>
                    </td>
                    <td>
                      <strong>{student.fullName}</strong>
                    </td>
                    <td>{student.email}</td>
                    <td>
                      <span className={`badge ${student.gender === 'Nam' ? 'bg-info' : 'bg-warning'}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td>{formatDate(student.birthDate)}</td>
                    <td>
                      <small className="text-muted">{student.notes}</small>
                    </td>
                    <td>
                      <Link 
                        to={`/edit/${student.id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Sửa
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}