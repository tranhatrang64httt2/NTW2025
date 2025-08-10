import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function StudentForm({ students, onAddStudent, onUpdateStudent }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    gender: '',
    birthDate: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const student = students.find(s => s.id === parseInt(id))
      if (student) {
        setFormData({
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          gender: student.gender,
          birthDate: student.birthDate,
          notes: student.notes
        })
      }
    }
  }, [id, isEdit, students])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Mã sinh viên không được để trống'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.gender) {
      newErrors.gender = 'Vui lòng chọn giới tính'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Vui lòng chọn ngày sinh'
    }

    // Kiểm tra mã sinh viên trùng lặp
    const existingStudent = students.find(s => 
      s.studentId === formData.studentId && 
      (!isEdit || s.id !== parseInt(id))
    )
    if (existingStudent) {
      newErrors.studentId = 'Mã sinh viên đã tồn tại'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (isEdit) {
      // Cập nhật sinh viên
      onUpdateStudent(parseInt(id), formData)
    } else {
      // Thêm sinh viên mới
      const newId = Math.max(...students.map(s => s.id), 0) + 1
      const newStudent = { ...formData, id: newId }
      onAddStudent(newStudent)
    }

    navigate('/')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          {isEdit ? 'Cập nhật thông tin sinh viên' : 'Thêm sinh viên mới'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="studentId" className="form-label">Mã sinh viên *</label>
                <input
                  type="text"
                  className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Ví dụ: SV001"
                />
                {errors.studentId && (
                  <div className="invalid-feedback">{errors.studentId}</div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Giới tính *</label>
                <select
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">{errors.gender}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="birthDate" className="form-label">Ngày sinh *</label>
                <input
                  type="date"
                  className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback">{errors.birthDate}</div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Ghi chú</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ghi chú thêm (không bắt buộc)"
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => navigate('/')}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEdit ? 'Cập nhật' : 'Thêm sinh viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}