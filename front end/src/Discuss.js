import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Space, Tooltip, Divider, message } from "antd";
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Menubar } from "primereact/menubar";

export default function DiscussList() {
  const navigate = useNavigate();

  const [discussList, setDiscussList] = useState([]);
  const [editingDiscuss, setEditingDiscuss] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token")?.trim();

  // Fetch discussions
  const fetchDiscuss = async () => {
    try {
      const res = await axios.get("http://localhost:2109/api/discuss", {
        headers: { Authorization: token },
      });
      setDiscussList(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load discussions!");
    }
  };

  useEffect(() => {
    fetchDiscuss();
  }, []);

  // Edit discussion
  const handleEdit = (discuss) => {
    setEditingDiscuss(discuss);
    setTitle(discuss.title);
    setContent(discuss.content);
  };

  // Delete discussion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2109/api/discuss/${id}`, {
        headers: { Authorization: token },
      });
      message.success("Deleted successfully!");
      fetchDiscuss();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete!");
    }
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:2109/api/discuss/${editingDiscuss.id}`,
        { title, content },
        { headers: { Authorization: token } }
      );
      message.success("Updated successfully!");
      setEditingDiscuss(null);
      fetchDiscuss();
    } catch (err) {
      console.error(err);
      message.error("Failed to update!");
    }
  };

  // Vote
  const handleVote = async (id, type) => {
    try {
      await axios.post(`http://localhost:2109/api/discuss/${id}/${type}`, null, {
        headers: { Authorization: token },
      });
      fetchDiscuss();
    } catch (err) {
      console.error(err);
      message.error(`Failed to ${type === "upvote" ? "Upvote" : "Downvote"}!`);
    }
  };

  // Menu config
  const itemRenderer = (item, options) => {
    return (
      <a
        onClick={(e) => {
          e.preventDefault();
          if (item.label === "Logout") {
            localStorage.removeItem("token");
          }
          if (item.url) {
            navigate(item.url);
          }
        }}
        className={options.className}
        style={{ color: "#00a45a", fontWeight: "500" }}
      >
        {item.label}
      </a>
    );
  };

  const items = [
    { label: "Home", template: itemRenderer, url: "/" },
    { label: "About Us", template: itemRenderer, url: "/AboutUs" },
    { label: "Contact", template: itemRenderer, url: "/ContactUs" },
    { label: "Contests", template: itemRenderer, url: "/contests" },
    { label: "Premium", template: itemRenderer, url: "/Premium" },
    { label: "Problem Set", template: itemRenderer, url: "/problemset" },
    { label: "Ranking", template: itemRenderer, url: "/Ranking" },
    { label: "Discuss", template: itemRenderer, url: "/Discuss" },
  ];

  const items2 = [
    {
      label: "Login/Register",
      template: itemRenderer,
      items: [
        { label: "Login", template: itemRenderer, url: "/login" },
        { label: "Register", template: itemRenderer, url: "/register" },
      ],
    },
  ];

  const items3 = [
    {
      label: "Profile/Logout",
      template: itemRenderer,
      items: [
        { label: "Profile", template: itemRenderer, url: "/profile" },
        { label: "Logout", template: itemRenderer, url: "/login" },
      ],
    },
  ];

  const start = (
    <div style={{ display: "flex", alignItems: "center", marginRight: "5rem" }}>
      <h2 style={{ color: "#00a45a", margin: 0, fontFamily: "Arial, sans-serif" }}>
        <b>PRIMEDEV</b>
      </h2>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Menubar
        className="custom-menubar"
        style={{
          color: "#333333",
          border: "none",
          background: "none",
          fontWeight: "500",
        }}
        model={token ? items3 : items2}
      />
    </div>
  );

  return (
    <div>
      {/* Top Menu */}
      <Menubar
        model={items}
        start={start}
        end={end}
        style={{
          background: "#f8f8f8",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16 }}>
        <div style={{ width: "45%", marginBottom: 16, textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/DiscussInput")}
            style={{
              backgroundColor: "#00a45a",
              borderColor: "#00a45a",
              fontWeight: "500",
            }}
          >
            Create New
          </Button>
        </div>

        {discussList.map((d) => (
          <Card
            key={d.id}
            bordered={false}
            className="shadow-2"
            size="small"
            style={{ width: "45%", marginBottom: 16 }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>{d.title}</span>
              {d.owner && (
                <Space size="small">
                  <Tooltip title="Edit">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(d)} />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(d.id)} />
                  </Tooltip>
                </Space>
              )}
            </div>

            <Divider style={{ margin: "8px 0" }} />

            <ReactMarkdown
              children={d.content}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200 p-1 rounded" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />

            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <Tooltip title={d.vote === 0 ? "You Upvoted" : "Upvote"}>
                <Button
                  type="text"
                  icon={<ArrowUpOutlined />}
                  onClick={() => handleVote(d.id, "upvote")}
                  style={{ color: d.vote === 0 ? "#00a45a" : "#888", marginRight: 4 }}
                />
              </Tooltip>
              <span style={{ fontWeight: 500, fontSize: 14, color: "#333", marginRight: 8 }}>
                {d.upvotes - d.downvotes >= 0 ? "+" : ""}
                {d.upvotes - d.downvotes}
              </span>
              <Tooltip title={d.vote === 1 ? "You Downvoted" : "Downvote"}>
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  onClick={() => handleVote(d.id, "downvote")}
                  style={{ color: d.vote === 1 ? "#ff4d4f" : "#888", marginRight: 8 }}
                />
              </Tooltip>
              <span style={{ fontSize: 12, color: "#555" }}>by {d.name}</span>
            </div>

            <Button
              type="link"
              onClick={() => navigate(`/DiscussDetail?id=${d.id}`)}
              style={{ padding: 0, color: "#00a45a", fontWeight: "500" }}
            >
              View Details
            </Button>
          </Card>
        ))}

        <Modal
          title="Edit Discussion"
          open={!!editingDiscuss}
          onOk={handleSaveEdit}
          onCancel={() => setEditingDiscuss(null)}
          okText="Save"
          cancelText="Cancel"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-3"
          />
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Content"
          />
        </Modal>
      </div>
    </div>
  );
}
