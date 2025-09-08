import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Input,
  List,
  Modal,
  Space,
  Tooltip,
  message,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  GithubFilled,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Menubar } from "primereact/menubar";
import { useLocation } from 'react-router-dom';

const DiscussDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy query params
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // Lấy giá trị id từ ?id=...
  const token = localStorage.getItem("token");

  const [discuss, setDiscuss] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingDiscuss, setEditingDiscuss] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [feedback, setFeedback] = useState("");

  const isLoggedIn = !!token;

  // Fetch discuss + comments
  const fetchDiscuss = async () => {
    try {
      const res = await axios.get(`http://localhost:2109/api/discuss/${id}`, {
        headers: { Authorization: token },
      });
      setDiscuss(res.data.discuss);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDiscuss();
  }, [id]);

  const handleVote = async (type) => {
    try {
      await axios.post(
        `http://localhost:2109/api/discuss/${id}/${type}`,
        null,
        { headers: { Authorization: token } }
      );
      fetchDiscuss();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDiscuss = async () => {
    try {
      await axios.delete(`http://localhost:2109/api/discuss/${id}`, {
        headers: { Authorization: token },
      });
      navigate("/discuss");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEditDiscuss = async () => {
    try {
      await axios.put(
        `http://localhost:2109/api/discuss/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: token } }
      );
      setEditingDiscuss(false);
      fetchDiscuss();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `http://localhost:2109/api/discuss/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: token } }
      );
      setNewComment("");
      fetchDiscuss();
      message.success("Comment added successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:2109/api/discuss/${commentId}/comments`,
        { headers: { Authorization: token } }
      );
      fetchDiscuss();
      message.success("Comment deleted");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete comment");
    }
  };

  const handleSaveEditComment = async () => {
    if (!editingComment) return;
    try {
      await axios.put(
        `http://localhost:2109/api/discuss/${editingComment.id}/comments`,
        { content: editCommentContent },
        { headers: { Authorization: token } }
      );
      setEditingComment(null);
      fetchDiscuss();
      message.success("Comment updated");
    } catch (err) {
      console.error(err);
      message.error("Failed to update comment");
    }
  };

   const handleSubmit = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        if (!feedback.trim()) {
            message.error('Vui lòng nhập phản hồi!');
            return;
        }
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:2109/api/new/Feedback',
                {
                    message: feedback,
                    token: token  // token truyền trong JSON body
                }
                // Không cần headers Authorization nếu không dùng
            );

            alert('Phản hồi của bạn đã được gửi thành công!');
            setFeedback('');
        } catch (error) {
            console.error(error);
            message.error('Gửi phản hồi thất bại. Vui lòng thử lại.');
        }
    };

  const itemRenderer = (item, options) => {
    return (
      <a
        onClick={(e) => {
          e.preventDefault();
          if (item.label === "Logout") {
            localStorage.removeItem("token");
            navigate("/login");
          }
          if (item.url) {
            navigate(item.url);
          }
        }}
        className={options.className}
        style={{ color: "#00a45a" }}
      >
        {item.label}
      </a>
    );
  };

  const menuItems = [
    { label: "Home", template: itemRenderer, url: "/" },
    { label: "About Us", template: itemRenderer, url: "/aboutus" },
    { label: "Contact", template: itemRenderer, url: "/contactus" },
    { label: "Contests", template: itemRenderer, url: "/contests" },
    { label: "Premium", template: itemRenderer, url: "/premium" },
    { label: "Problem Set", template: itemRenderer, url: "/problemset" },
    { label: "Ranking", template: itemRenderer, url: "/ranking" },
    { label: "Discuss", template: itemRenderer, url: "/discuss" },
  ];

  const authMenu = isLoggedIn
    ? [
        {
          label: "Profile/Logout",
          template: itemRenderer,
          items: [
            { label: "Profile", template: itemRenderer, url: "/profile" },
            { label: "Logout", template: itemRenderer, url: "/login" },
          ],
        },
      ]
    : [
        {
          label: "Login/Register",
          template: itemRenderer,
          items: [
            { label: "Login", template: itemRenderer, url: "/login" },
            { label: "Register", template: itemRenderer, url: "/register" },
          ],
        },
      ];

  const headerStart = (
    <div style={{ display: "flex", alignItems: "center", marginRight: "5rem" }}>
      <h2 style={{ color: "#00a45a", margin: 0 }}>
        <b>PRIMEDEV</b>
      </h2>
    </div>
  );

  if (!discuss) return null;

  return (
    <div>
      {/* Header */}
      <Menubar
        model={menuItems}
        start={headerStart}
        end={
          <Menubar
            model={authMenu}
            style={{
              border: "none",
              background: "none",
              fontWeight: "500",
            }}
          />
        }
        className="custom-menubar"
        style={{
          border: "none",
          background: "#ffffff",
          padding: "0.5rem 2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "0 0 8px 8px",
        }}
      />

      {/* Discuss Detail */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 16,
          gap: 16,
          background: "#fff",
          minHeight: "80vh",
        }}
      >
        {/* Discuss Card */}
        <Card bordered={false} style={{ width: "60%" }} bodyStyle={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>{discuss.title}</h2>
            {discuss.owner && (
              <Space>
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingDiscuss(true);
                      setEditTitle(discuss.title);
                      setEditContent(discuss.content);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={handleDeleteDiscuss} />
                </Tooltip>
              </Space>
            )}
          </div>

          {/* Vote */}
          <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
            <Tooltip title={discuss.vote === 0 ? "You upvoted" : "Upvote"}>
              <Button
                type="text"
                icon={<ArrowUpOutlined />}
                onClick={() => handleVote("upvote")}
                style={{ color: discuss.vote === 0 ? "#00a45a" : "#888" }}
              />
            </Tooltip>
            <span style={{ margin: "0 8px" }}>
              {discuss.upvotes - discuss.downvotes >= 0 ? "+" : ""}
              {discuss.upvotes - discuss.downvotes}
            </span>
            <Tooltip title={discuss.vote === 1 ? "You downvoted" : "Downvote"}>
              <Button
                type="text"
                icon={<ArrowDownOutlined />}
                onClick={() => handleVote("downvote")}
                style={{ color: discuss.vote === 1 ? "#ff4d4f" : "#888" }}
              />
            </Tooltip>
            <span style={{ marginLeft: 12, fontSize: 12, color: "#555" }}>by {discuss.name}</span>
          </div>

          <Divider />

          {/* Content */}
          <ReactMarkdown
            children={discuss.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 p-1 rounded" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </Card>

        {/* Comments */}
        <Card title="Comments" style={{ width: "60%" }}>
          <List
            dataSource={comments}
            locale={{ emptyText: "No comments yet" }}
            renderItem={(c) => (
              <List.Item
                actions={
                  c.isOwnerComment
                    ? [
                        <Button
                          type="link"
                          onClick={() => {
                            setEditingComment(c);
                            setEditCommentContent(c.content);
                          }}
                        >
                          Edit
                        </Button>,
                        <Button type="link" danger onClick={() => handleDeleteComment(c.id)}>
                          Delete
                        </Button>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  title={
                    <span>
                      {c.username}{" "}
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </span>
                  }
                  description={
                    <ReactMarkdown
                      children={c.content}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          return <code className="bg-gray-100 p-1 rounded">{children}</code>;
                        },
                      }}
                    />
                  }
                />
              </List.Item>
            )}
          />

          {/* Add new comment */}
          <Input.TextArea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ marginTop: 12 }}
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            style={{ marginTop: 8, background: "#00a45a", borderColor: "#00a45a" }}
          >
            Submit
          </Button>
        </Card>
      </div>

      {/* Edit discuss modal */}
      <Modal
        title="Edit Discussion"
        open={editingDiscuss}
        onOk={handleSaveEditDiscuss}
        onCancel={() => setEditingDiscuss(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
          className="mb-3"
        />
        <Input.TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={8}
          placeholder="Content"
        />
      </Modal>

      {/* Edit comment modal */}
      <Modal
        title="Edit Comment"
        open={!!editingComment}
        onOk={handleSaveEditComment}
        onCancel={() => setEditingComment(null)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input.TextArea
          value={editCommentContent}
          onChange={(e) => setEditCommentContent(e.target.value)}
          rows={5}
          placeholder="Comment content"
        />
      </Modal>

      {/* Footer */}
      <div style={{ background: "#0d0d0d", padding: "50px 8%", color: "white" }}>
        <Row gutter={[32, 32]} justify="space-between">
          {/* Column 1 */}
          <Col xs={24} sm={12} md={6}>
            <h2 style={{ color: "#00a45a", fontWeight: "bold", fontSize: "24px", marginBottom: "15px" }}>
              PRIMEDEV
            </h2>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Platform for coding practice, contests, and ranking to improve your skills.
            </p>
            <div style={{ marginTop: 15 }}>
              <FacebookFilled
                style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }}
              />
              <TwitterSquareFilled
                style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }}
              />
              <LinkedinFilled
                style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }}
              />
              <GithubFilled style={{ fontSize: 26, cursor: "pointer", color: "#ccc" }} />
            </div>
          </Col>

          {/* Column 2 */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Quick Links</h3>
            {["Home", "About Us", "Contact", "Problem Set", "Ranking"].map((link, i) => (
              <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}>
                {link}
              </p>
            ))}
          </Col>

          {/* Column 3 */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Features</h3>
            {["Contests", "Premium", "Profile", "Leaderboard", "Statistics"].map((link, i) => (
              <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}>
                {link}
              </p>
            ))}
          </Col>

          {/* Column 4 */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Contact Info</h3>
            <p style={{ color: "#ccc", marginBottom: "8px" }}>
              <EnvironmentOutlined /> 123 Code Street, Dev City
            </p>
            <p style={{ color: "#ccc", marginBottom: "8px" }}>
              <MailOutlined /> support@primedev.com
            </p>
            <p style={{ color: "#ccc", marginBottom: "8px" }}>
              <PhoneOutlined /> +84 123 456 789
            </p>
          </Col>

          {/* Column 5 */}
          <Col xs={24} sm={12} md={6}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Feedback</h3>
            <Input.TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback..."
              rows={4}
              style={{
                marginBottom: 12,
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "white",
              }}
            />
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                background: "#00a45a",
                border: "none",
                padding: "8px 20px",
                fontWeight: "bold",
              }}
            >
              Send Feedback
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 40, borderTop: "1px solid #333", paddingTop: 20 }}>
          <Col span={24} style={{ textAlign: "center", color: "#777" }}>
            © {new Date().getFullYear()} PRIMEDEV. All rights reserved.
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DiscussDetail;
