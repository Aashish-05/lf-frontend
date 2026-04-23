import React, { useEffect, useState } from "react";
import {
  getAllItems,
  addItem,
  deleteItem,
  searchItems,
} from "../utils/api";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    date: "",
    contactInfo: "",
  });

  // 🔥 Fetch items
  const fetchItems = async () => {
    try {
      const res = await getAllItems();
      setItems(res.data.items || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ➕ Add Item
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await addItem({
        ...form,
        description: form.description || "No description", // ✅ FIX
        type: form.type || "Lost",
      });

      fetchItems();

      setForm({
        itemName: "",
        description: "",
        type: "Lost",
        location: "",
        date: "",
        contactInfo: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Add failed");
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      fetchItems();
    } catch {
      alert("Delete failed");
    }
  };

  // 🔍 Search
  const handleSearch = async () => {
    if (!search.trim()) return fetchItems();

    try {
      const res = await searchItems(search);
      setItems(res.data.items || []);
    } catch {
      console.log("Search error");
    }
  };

  return (
    <div className="container">
      <h2>Lost & Found</h2>

      {/* ➕ Add Item */}
      <form onSubmit={handleAdd} className="card">
        <h3>Add Item</h3>

        <input
          placeholder="Item Name"
          required
          value={form.itemName}
          onChange={(e) =>
            setForm({ ...form, itemName: e.target.value })
          }
        />

        <input
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Location"
          required
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          placeholder="Contact Info"
          required
          value={form.contactInfo}
          onChange={(e) =>
            setForm({ ...form, contactInfo: e.target.value })
          }
        />

        <button type="submit">Add Item</button>
      </form>

      {/* 🔍 Search */}
      <div className="card">
        <h3>Search Items</h3>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 📦 Items List */}
      <div className="card">
        <h3>All Items</h3>

        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item">
              <h4>{item.itemName}</h4>
              <p>{item.description}</p>
              <p>📍 {item.location}</p>
              <p>📞 {item.contactInfo}</p>
              <p>👤 {item.user?.name || "Unknown"}</p>

              {item.user?._id === user.id && (
                <button onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;