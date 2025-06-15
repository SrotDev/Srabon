import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEllipsisH, FaTimes } from "react-icons/fa"; // Import 3-dot menu and close (cross) icon

const Notification = ({ setShowNotifications, setIsActive }) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [notifications, setNotifications] = useState([]);
  const [viewType, setViewType] = useState("all"); // All or unread notifications
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false); // State for 3-dot menu visibility

  const fetchNotifications = async (arg) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to fetch notifications.");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/notifications/${arg}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(viewType);
  }, [viewType]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to mark notification as read.");
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/notifications/read/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
        body: JSON.stringify({ id }),
      });
      fetchNotifications(viewType); // Refresh notifications
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to mark all notifications as read.");
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/notifications/readall/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
      });
      fetchNotifications(viewType); // Refresh notifications
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
    toggleMenu();
  };

  const deleteAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to delete notifications.");
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/notifications/read/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
      });
      fetchNotifications(viewType); // Refresh notifications
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
    toggleMenu(); // Close the menu after deletion
  };

  const deleteAllMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Unable to delete notifications.");
      return;
    }

    try {
      await fetch(`${apiBaseUrl}/notifications/all/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
        },
      });
      fetchNotifications(viewType); // Refresh notifications
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
    toggleMenu();
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeDropdown = () => {
    setShowNotifications(false); // Close the notification dropdown
    setIsActive(false); // Set the icon-btn to inactive
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        {/* Close button on the left */}
        <FaTimes
          onClick={closeDropdown}
          style={{ cursor: "pointer", fontSize: "20px", color: "#333", marginRight: "10px" }}
        />
        <span>Notifications</span>

        {/* 3-Dot Menu on the right */}
        <div className="three-dot-menu">
          <FaEllipsisH
            onClick={toggleMenu}
            style={{ cursor: "pointer", fontSize: "20px", color: "#333", marginLeft: "auto" }}
          />
          {showMenu && (
            <div className={`menu-options ${showMenu ? "visible" : ""}`}>
              <button onClick={markAllAsRead}>Mark All as Read</button>
              <button onClick={deleteAllRead}>Delete Only Read</button>
              <button onClick={deleteAllMessages}>Delete All</button>
            </div>
          )}
        </div>
      </div>

      <div className="notification-actions">
        <button onClick={() => fetchNotifications("all")}>All</button>
        <button onClick={() => fetchNotifications("unread")}>Unread</button>
      </div>

      <div className="notifications-list">
        {loading ? (
          <p>Loading notifications...</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? "" : "unread"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
