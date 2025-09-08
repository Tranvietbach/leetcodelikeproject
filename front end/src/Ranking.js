import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Avatar, Card, Badge } from 'antd';
import { Menubar } from 'primereact/menubar';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file
import { message, Input } from 'antd';
import { Button } from 'primereact/button';


import { TrophyOutlined } from '@ant-design/icons';
import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  GithubFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
export default function Ranking() {
    const [rankings, setRankings] = useState([]);
    const navigate = useNavigate(); // khởi tạo điều hướng
  const [feedback, setFeedback] = useState('');
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

      // alert('Phản hồi của bạn đã được gửi thành công!');
      setFeedback('');
    } catch (error) {
      console.error(error);
      message.error('Gửi phản hồi thất bại. Vui lòng thử lại.');
    }
  };
    useEffect(() => {
        axios.get("http://localhost:2109/api/all/rankings")
            .then(res => {
                setRankings(res.data);
            })
            .catch(err => console.error("Error loading rankings:", err));
    }, []);


    const imagePath = "/images/Screenshot 2025-05-30 083029";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
const itemRenderer = (item, options) => {
    return (
        <a
            onClick={(e) => {
                e.preventDefault(); // ngăn reload trang

                // Nếu là Logout thì xóa token
                if (item.label === "Logout") {
                    localStorage.removeItem("token"); // xóa token
                    // có thể xóa thêm các state user khác nếu cần
                }

                // Chuyển route nếu có url
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // alert("Chưa có token, chưa đăng nhập");
            return;
        }

        axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
            .then((response) => {
                setIsLoggedIn(true);
                // alert("Token hợp lệ, userId: " + response.data.id);
            })
            .catch(() => {
                setIsLoggedIn(false);
                // alert("Token không hợp lệ, đã đăng xuất");
            });
    }, []);
    const items = [
        {
            label: 'Home',
            template: itemRenderer,
            url: '/'
        },
        {
            label: 'About Us',
            template: itemRenderer,
            url: '/AboutUs'
        },
        {
            label: 'Contact',
            template: itemRenderer,
            url: '/ContactUs'
        },
        {
            label: 'Contests',
            template: itemRenderer,
            url: '/contests'
        },
        {
            label: 'Premium',
            template: itemRenderer,
            url: '/Premium'
        },

        {
            label: 'Problem Set',
            template: itemRenderer,
            url: '/problemset'
        },
        {
            label: 'Ranking',
            template: itemRenderer,
            url: '/Ranking'
        }        ,
        {
            label: 'Discuss',
            template: itemRenderer,
            url: '/Discuss'
        }
    ];


    const items2 = [

        {
            label: 'Login/Register',
            template: itemRenderer,


            items: [
                {
                    label: 'Login',
                    template: itemRenderer,
                    url: '/login'
                },
                {
                    label: 'Register',
                    template: itemRenderer,
                    url: '/register'
                },

            ]
        },


    ];
    const items3 = [

        {
            label: 'Profile/Logout',
            template: itemRenderer,

            items: [
                {
                    label: 'Profile',
                    template: itemRenderer,
                    url: '/profile'
                },
                {
                    label: 'Logout',
                    template: itemRenderer,
                    url: '/login'
                }
            ]
        },


    ];

    const start = (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '7rem' }}>
            <h2 style={{ color: '#00a45a', margin: 0 }}><b>PRIMEDEV</b></h2>
        </div>
    );
    const end1 = (
        <div className="flex align-items-center gap-2">
            <Menubar className="custom-menubar" style={{ color: 'black', border: 'none', background: 'none' }} model={items2} />
        </div>
    );
    const end2 = (
        <div className="flex align-items-center gap-2">
            <Menubar className="custom-menubar" style={{ color: 'black', border: 'none', background: 'none' }} model={items3} />
        </div>
    );
    return (
        <div>
            <Menubar
                model={items}
                start={start}
                end={isLoggedIn ? end2 : end1}
                className="custom-menubar"
                style={{ border: 'none', background: 'none' }}
            />
            <div style={{ padding: '3% 10%', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
                <h1 style={{ color: '#00a45a', textAlign: 'center', fontSize: '32px', marginBottom: '2rem' }}>
                    <TrophyOutlined style={{ marginRight: 10 }} /> Leaderboard
                </h1>

                <Card>
<List
    itemLayout="horizontal"
    dataSource={rankings}
    pagination={{ pageSize: 10 }} // 👈 Thêm phân trang tại đây
    renderItem={(item) => (
        <List.Item>
            <List.Item.Meta
                avatar={
                    <Avatar
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.user.username}`}
                        alt={item.user.username}
                    />
                }
                title={<b>{item.user.username}</b>}
                description={`Score: ${item.score}`}
            />
            <div style={{
                fontWeight: 'bold',
                fontSize: '18px',
                minWidth: '50px',
                textAlign: 'center',
                color: '#1890ff'
            }}>
                #{item.rank}
            </div>
        </List.Item>
    )}
/>

                </Card>
            </div>
      <div style={{ background: "#0d0d0d", padding: "50px 8%", color: "white" }}>
        <Row gutter={[32, 32]} justify="space-between">
          {/* Cột 1 - Logo & giới thiệu */}
          <Col xs={24} sm={12} md={6}>
            <h2 style={{ color: "#00a45a", fontWeight: "bold", fontSize: "24px", marginBottom: "15px" }}>CodeMaster</h2>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Nền tảng luyện code, contest và xếp hạng, giúp bạn nâng cao kỹ năng lập trình.
            </p>
            <div style={{ marginTop: 15 }}>
              <FacebookFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e) => e.target.style.color = "#00a45a"} onMouseOut={(e) => e.target.style.color = "#ccc"} />
              <TwitterSquareFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e) => e.target.style.color = "#00a45a"} onMouseOut={(e) => e.target.style.color = "#ccc"} />
              <LinkedinFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e) => e.target.style.color = "#00a45a"} onMouseOut={(e) => e.target.style.color = "#ccc"} />
              <GithubFilled style={{ fontSize: 26, cursor: "pointer", color: "#ccc" }} onMouseOver={(e) => e.target.style.color = "#00a45a"} onMouseOut={(e) => e.target.style.color = "#ccc"} />
            </div>
          </Col>

          {/* Cột 2 - Liên kết nhanh */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Quick Links</h3>
            {["Home", "About Us", "Contact", "Problem Set", "Ranking"].map((link, i) => (
              <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}
                onMouseOver={(e) => e.target.style.color = "#00a45a"}
                onMouseOut={(e) => e.target.style.color = "#ccc"}>
                {link}
              </p>
            ))}
          </Col>

          {/* Cột 3 - Sản phẩm/Dịch vụ */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Features</h3>
            {["Contests", "Premium", "Profile", "Leaderboard", "Statistics"].map((link, i) => (
              <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}
                onMouseOver={(e) => e.target.style.color = "#00a45a"}
                onMouseOut={(e) => e.target.style.color = "#ccc"}>
                {link}
              </p>
            ))}
          </Col>

          {/* Cột 4 - Thông tin liên hệ */}
          <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Contact Info</h3>
            <p style={{ color: "#ccc", marginBottom: "8px" }}><EnvironmentOutlined /> 123 Code Street, Dev City</p>
            <p style={{ color: "#ccc", marginBottom: "8px" }}><MailOutlined /> support@codemaster.com</p>
            <p style={{ color: "#ccc", marginBottom: "8px" }}><PhoneOutlined /> +84 123 456 789</p>
          </Col>

          {/* Cột 5 - Feedback form */}
          <Col xs={24} sm={12} md={6}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Feedback</h3>
            <Input.TextArea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
              rows={4}
              style={{
                marginBottom: 12,
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "white"
              }}
            />
            <Button type="primary" onClick={handleSubmit} style={{
              background: "#00a45a",
              border: "none",
              padding: "8px 20px",
              fontWeight: "bold"
            }}>
              Gửi phản hồi
            </Button>
          </Col>
        </Row>

        {/* Dòng bản quyền */}
        <Row style={{ marginTop: 40, borderTop: "1px solid #333", paddingTop: 20 }}>
          <Col span={24} style={{ textAlign: "center", color: "#777" }}>
            © {new Date().getFullYear()} CodeMaster. All rights reserved.
          </Col>
        </Row>
      </div>
        </div>

    );
}
