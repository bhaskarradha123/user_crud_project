import React, { useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteCurrentUserProfile,
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "../services/UserService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AdminDashboard.css";

const PAGE_SIZE = 5;

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState("view");
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    loadProfile();
    loadUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const loadProfile = () => {
    getCurrentUserProfile()
      .then((res) => {
        setAdmin(res.data);
        setFormData({ mobile: res.data.mobile, password: "" });
      })
      .catch(() => showToastMessage("Failed to fetch admin profile"));
  };

  const loadUsers = () => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(() => showToastMessage("Failed to fetch users list"));
  };

  const showToastMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDeleteOwn = () => {
    if (window.confirm("Delete your profile?")) {
      deleteCurrentUserProfile()
        .then(() => handleLogout())
        .catch(() => showToastMessage("Failed to delete profile"));
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateCurrentUserProfile(formData)
      .then(() => {
        showToastMessage("Profile updated");
        loadProfile();
        setSelectedAction("view");
      })
      .catch(() => showToastMessage("Failed to update profile"));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm(`Delete user ${id}?`)) {
      deleteUserById(id)
        .then(() => {
          showToastMessage(`User ${id} deleted`);
          loadUsers();
        })
        .catch(() => showToastMessage(`Failed to delete user ${id}`));
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setFormData({ mobile: user.mobile, password: "" });
    setSelectedAction("editUser");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUserById(editUser.id, formData)
      .then(() => {
        showToastMessage(`User ${editUser.id} updated`);
        setEditUser(null);
        setSelectedAction("users");
        loadUsers();
      })
      .catch(() => showToastMessage(`Failed to update user ${editUser.id}`));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) =>
          u.userName.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  const indexOfLast = currentPage * PAGE_SIZE;
  const indexOfFirst = indexOfLast - PAGE_SIZE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-5">
        <div className="text-white fw-bold">
          {admin && `Welcome, ${admin.userName}`}
        </div>

        <div className="ms-auto dropdown hover-dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            &#8942;
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedAction("view")}
              >
                View Profile
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedAction("update")}
              >
                Update Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleDeleteOwn}>
                Delete Profile
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedAction("users")}
              >
                Manage Users
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

      <main className="container mt-2">
        {selectedAction === "view" && admin && (
          <div className="card p-4 mx-auto admin-card">
            <h4>Your Profile</h4>
            <p>
              <strong>Username:</strong> {admin.userName}
            </p>
            <p>
              <strong>Role:</strong> {admin.role}
            </p>
            <p>
              <strong>Mobile:</strong> {admin.mobile}
            </p>
          </div>
        )}

        {selectedAction === "update" && (
          <div className="card p-4 mx-auto admin-card">
            <h4>Update Profile</h4>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Update
              </button>
            </form>
          </div>
        )}

        {selectedAction === "users" && (
          <div className="manage-users-container">
            <h4 className="mb-3">Manage Users</h4>

            <div className="row mb-3">
              <div className="col-md-7">
                <input
                  type="text"
                  placeholder="Search users"
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive ">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary text-center">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Mobile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.userName}</td>
                        <td>{u.role}</td>
                        <td>{u.mobile}</td>
                        <td>
                          <button
                            className="btn btn-outline-warning btn-sm me-1"
                            onClick={() => handleEditUser(u)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center mt-3 flex-wrap">
              {[
                ...Array(Math.ceil(filteredUsers.length / PAGE_SIZE)).keys(),
              ].map((n) => (
                <button
                  key={n}
                  className={`btn btn-sm m-1 ${
                    currentPage === n + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(n + 1)}
                >
                  {n + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedAction === "editUser" && editUser && (
          <div className="card p-4 mx-auto admin-card">
            <h4>Edit User: {editUser.userName}</h4>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Update
              </button>
            </form>
          </div>
        )}
      </main>

      <div
        className={`toast-container position-fixed bottom-0 end-0 p-3 ${
          showToast ? "" : "d-none"
        }`}
      >
        <div className="toast show bg-info text-white">
          <div className="toast-body">{toastMsg}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
