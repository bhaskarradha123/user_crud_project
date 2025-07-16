import React, { useEffect, useState } from 'react';
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteCurrentUserProfile
} from '../services/UserService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState('view'); 
  const [formData, setFormData] = useState({ mobile: '', password: '' });
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    getCurrentUserProfile()
      .then((res) => {
        setUser(res.data);
        setFormData({ mobile: res.data.mobile, password: '' });
      })
      .catch((err) => {
        console.error(err);
        showToastMessage('Failed to fetch profile');
      });
  };

  const showToastMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      deleteCurrentUserProfile()
        .then(() => {
          showToastMessage('Profile deleted');
          handleLogout();
        })
        .catch((err) => {
          console.error(err);
          showToastMessage('Failed to delete profile');
        });
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!formData.mobile || isNaN(formData.mobile)) {
      showToastMessage('Mobile must be a valid number');
      return;
    }

    updateCurrentUserProfile(formData)
      .then(() => {
        showToastMessage('Profile updated');
        loadProfile();
        setSelectedAction('view');
      })
      .catch((err) => {
        console.error(err);
        showToastMessage('Failed to update profile');
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <div className="text-white fw-bold">
          {user && `Welcome, ${user.userName}`}
        </div>

        <div className="ms-auto dropdown hover-dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            &#8942;
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
              <button className="dropdown-item" onClick={() => setSelectedAction('view')}>
                View Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setSelectedAction('update')}>
                Update Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleDelete}>
                Delete Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="card p-4 w-100 w-md-50">
          {selectedAction === 'view' && user && (
            <>
              <h4>Your Profile</h4>
              <p><strong>Username:</strong> {user.userName}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
            </>
          )}

          {selectedAction === 'update' && (
            <>
              <h4>Update Profile</h4>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">Update</button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Toast */}
      <div
        className={`toast-container position-fixed bottom-0 end-0 p-3 ${showToast ? '' : 'd-none'}`}
      >
        <div className="toast show bg-info text-white">
          <div className="toast-body">
            {toastMsg}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
