import { useState } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Sakib',
      email: 'sakib@example.com',
      age: 20,
      course: 'Computer Science',
      phone: '+1234567890',
      address: '123 Main St, City'
    },
    {
      id: 2,
      name: 'Mili',
      email: 'mili@example.com',
      age: 22,
      course: 'Mathematics',
      phone: '+0987654321',
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

    if (!isEditing) {
      const emailExists = students.some(student =>
        student.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (emailExists) {
        newErrors.email = 'Email already exists';
      }
    } else {
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
      setStudents(prev => prev.map(student =>
        student.id === parseInt(formData.id)
          ? { ...formData, id: parseInt(formData.id), age: parseInt(formData.age) }
          : student
      ));
    } else {
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
    <div>
      {/* Navigation Bar */}
      <nav>
        <div>
          <div className="brand">Student Management System</div>
          <div className="nav-links">
            <div className="active">Students</div>
            <div>Courses</div>
            <div>Reports</div>
            <div>Settings</div>
          </div>
          <div className="user-info">
            <div>Welcome, Admin</div>
            <div className="user-avatar">A</div>
          </div>
        </div>
      </nav>

      <main className="main-container">
        <div className="card">
          <div className="card-header">
            <h1>Student Management System</h1>
            <button onClick={handleAddNew}>+ Add Student</button>
          </div>

          <section className="students-table">
            <h2>Students List ({students.length} students)</h2>

            {students.length === 0 ? (
              <div className="no-data">
                <p>No students found</p>
                <p>Click "Add Student" to create your first student record</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Course</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{student.id}</td>
                        <td className="bold">{student.name}</td>
                        <td className="gray">{student.email}</td>
                        <td>{student.age}</td>
                        <td>{student.course}</td>
                        <td className="gray">{student.phone}</td>
                        <td className="gray">{student.address}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(student.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Full Screen Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? 'Edit Student' : 'Add New Student'}</h2>

            <div className="form-grid">
              <div className="form-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-field">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <p className="error-text">{errors.age}</p>}
              </div>

              <div className="form-field">
                <label>Course *</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Enter course name"
                  className={errors.course ? 'error' : ''}
                />
                {errors.course && <p className="error-text">{errors.course}</p>}
              </div>

              <div className="form-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-field">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>
            </div>

            <div className="modal-buttons">
              <button className="submit-btn" onClick={handleSubmit}>
                {isEditing ? 'Update Student' : 'Add Student'}
              </button>
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
