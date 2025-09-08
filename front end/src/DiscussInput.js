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
import { Splitter, SplitterPanel } from "primereact/splitter";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

import "./Discuss.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function MarkdownEditor() {
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState(`# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->

# Approach
<!-- Describe your approach to solving the problem. -->

# Complexity
- Time complexity:
<!-- Add your time complexity here, e.g. $$O(n)$$ -->

- Space complexity:
<!-- Add your space complexity here, e.g. $$O(n)$$ -->

# Code
\`\`\`java []
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[j] == target - nums[i]) {
                    return new int[] { i, j };
                }
            }
        }
        return new int[] {};
    }
}
\`\`\`
`);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  // Kiểm tra token hợp lệ
  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
      .then((res) => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        localStorage.removeItem("token"); // xóa token không hợp lệ
      });
  }, []);

  // Hàm lưu discuss
  const handleSave = async () => {
    const token = localStorage.getItem("token")?.trim();
    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !markdown.trim()) {
      alert("Tiêu đề và nội dung không được để trống!");
      return;
    }

    const newDiscuss = {
      title: title.trim(),
      content: markdown.trim(),
    };

    try {
      const response = await axios.post(
        "http://localhost:2109/api/discuss",
        newDiscuss,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      console.log("Đã lưu thành công:", response.data);
      alert("Đã lưu thảo luận thành công!");
      setTitle("");
      setMarkdown("");
    } catch (error) {
      if (error.response) {
        console.error(
          "Server lỗi:",
          error.response.status,
          error.response.data
        );
        alert(`Lỗi: ${error.response.data}`);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        alert("Không nhận được phản hồi từ server!");
      } else {
        console.error("Lỗi:", error.message);
        alert(error.message);
      }
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

  return (
    <>
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

      <div className="p-4" style={{ height: "100vh", backgroundColor: "#f9fafb",marginBottom: "170px" }}>

        <Card
          title="Markdown Discussion Editor"
          className="shadow-3 mb-3"
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <p className="text-gray-700 mb-2">
            Enter the title and content on the left, and preview it on the right.
          </p>
        </Card>

        <Splitter style={{ height: "80vh", borderRadius: "12px", overflow: "hidden" }} layout="horizontal">
          {/* Input Panel */}
          <SplitterPanel
            size={50}
            className="p-3"
            style={{ display: "block", backgroundColor: "#ffffff" }}
          >
            <h3 className="mb-3" style={{ color: "#00a45a" }}>Input</h3>

            <div className="mb-3">
              <InputText
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  padding: "10px",
                }}
              />
            </div>

            <InputTextarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={25}
              autoResize
              className="w-full"
              style={{
                fontFamily: "monospace",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "12px",
              }}
            />

            <div className="mt-3 text-left">
              <Button
                label="Save"
                icon="pi pi-save"
                className="p-button-success"
                style={{
                  backgroundColor: "#00a45a",
                  borderColor: "#00a45a",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
                onClick={handleSave}
              />
            </div>
          </SplitterPanel>

          {/* Preview Panel */}
          <SplitterPanel size={50} className="p-3" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="mb-3" style={{ color: "#00a45a" }}>Preview</h3>
            <Card
              className="shadow-2"
              style={{
                height: "calc(100% - 3rem)",
                overflowY: "auto",
                backgroundColor: "#f9fafb",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <ReactMarkdown
                children={markdown}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-200 p-1 rounded"
                        style={{ backgroundColor: "#e5e7eb", padding: "4px", borderRadius: "4px" }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </Card>
          </SplitterPanel>
        </Splitter>
        {isLoggedIn}
      </div>
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
    </>
  );
}
