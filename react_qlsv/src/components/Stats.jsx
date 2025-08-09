import React from 'react'

export default function Stats({ students }) {

  // Tính toán thống kê
  const totalStudents = students.length
  const maleCount = students.filter(s => s.gender === 'Nam').length
  const femaleCount = students.filter(s => s.gender === 'Nữ').length
  
  // Tính tuổi trung bình
  const calculateAverageAge = () => {
    if (students.length === 0) return 0
    
    const currentYear = new Date().getFullYear()
    const totalAge = students.reduce((sum, student) => {
      const birthYear = new Date(student.birthDate).getFullYear()
      return sum + (currentYear - birthYear)
    }, 0)
    
    return Math.round(totalAge / students.length * 10) / 10
  }

  const averageAge = calculateAverageAge()

  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card text-white bg-primary">
          <div className="card-body text-center">
            <h5 className="card-title">Tổng số sinh viên</h5>
            <h2 className="card-text">{totalStudents}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-white bg-info">
          <div className="card-body text-center">
            <h5 className="card-title">Nam</h5>
            <h2 className="card-text">{maleCount}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-white bg-warning">
          <div className="card-body text-center">
            <h5 className="card-title">Nữ</h5>
            <h2 className="card-text">{femaleCount}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-white bg-success">
          <div className="card-body text-center">
            <h5 className="card-title">Tuổi TB</h5>
            <h2 className="card-text">{averageAge}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}