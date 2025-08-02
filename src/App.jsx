import { useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 20,
      course: 'Computer Science',
      phone: '+1234567890',
      address: '123 Main St, City'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      age: 22,
      course: 'Mathematics',
      phone: '+1987654321',
      address: '456 Oak Ave, Town'
    }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    course: '',
    phone: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      age: '',
      course: '',
      phone: '',
      address: ''
    });
    setErrors({});
    setIsEditing(false);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Check for duplicate email when creating new student
    if (!isEditing) {
      const emailExists = students.some(student => 
        student.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (emailExists) {
        newErrors.email = 'Email already exists';
      }
    } else {
      // When editing, check if email exists in other students
      const emailExists = students.some(student => 
        student.email.toLowerCase() === formData.email.toLowerCase() && 
        student.id !== parseInt(formData.id)
      );
      if (emailExists) {
        newErrors.email = 'Email already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing) {
      // Update existing student
      setStudents(prev => prev.map(student => 
        student.id === parseInt(formData.id) 
          ? { ...formData, id: parseInt(formData.id), age: parseInt(formData.age) }
          : student
      ));
    } else {
      // Add new student
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      const newStudent = {
        ...formData,
        id: newId,
        age: parseInt(formData.age)
      };
      setStudents(prev => [...prev, newStudent]);
    }

    resetForm();
  };

  const handleEdit = (student) => {
    setFormData({
      ...student,
      age: student.age.toString()
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '20px', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Student Management System</h1>
          <button
            onClick={handleAddNew}
            style={{
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Add Student
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Form Section */}
          {showForm && (
            <div style={{ 
              marginBottom: '30px', 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              <h2 style={{ marginTop: 0, color: '#333' }}>
                {isEditing ? 'Edit Student' : 'Add New Student'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.name ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter student name"
                  />
                  {errors.name && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.email ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.email}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.age ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                  {errors.age && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.age}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Course *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.course ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter course name"
                  />
                  {errors.course && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.course}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.phone ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.phone}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.address ? '2px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter address"
                  />
                  {errors.address && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.address}</p>}
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isEditing ? 'Update Student' : 'Add Student'}
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
              Students List ({students.length} students)
            </h2>
            
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>No students found</p>
                <p>Click "Add Student" to create your first student record</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Age</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Phone</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Address</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{student.id}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', fontWeight: 'bold' }}>{student.name}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', color: '#666' }}>{student.email}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{student.age}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{student.course}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', color: '#666' }}>{student.phone}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', color: '#666' }}>{student.address}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'center' }}>
                          <button
                            onClick={() => handleEdit(student)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginRight: '5px',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
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
      </div>
    </div>
  )
}

export default App