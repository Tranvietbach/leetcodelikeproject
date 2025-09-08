import React from 'react';
import { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { Col, Row } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file
import { message, Input } from 'antd';

import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  GithubFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
export default function PricingPage() {

  const [plans, setPlans] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

      alert('Phản hồi của bạn đã được gửi thành công!');
      setFeedback('');
    } catch (error) {
      console.error(error);
      message.error('Gửi phản hồi thất bại. Vui lòng thử lại.');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    fetch(`http://localhost:2109/api/extract-user-id?token=${token}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate('/login'); // chuyển hướng đến trang đăng nhập nếu token không hợp lệ
      });
  }, []);
  useEffect(() => {
    axios.get('http://localhost:2109/api/problem-access/premiums?token=' + localStorage.getItem("token"))
      .then(res => {
        const formatted = res.data.map(p => ({
          id: p.id,
          title: p.name,
          badge: p.durationDays + ' days',
          price: `$${p.price.toFixed(2)}`,
          features: p.description.split(';'),
          buttonLabel: 'Buy now',
          buttonClass: 'p-button-sm',
          bought: p.bought // 👈 THÊM DÒNG NÀY
        }));

        // Thêm gói Free vào đầu danh sách
        const freePlan = {
          title: 'Free Plan',
          badge: 'Forever',
          price: '$0.00',
          features: [
            'Access free problems',
          ],
          buttonLabel: 'Included',
          buttonClass: 'p-button-outlined p-button-sm'
        };

        setPlans([freePlan, ...formatted]);
      })
      .catch(err => console.error('Error loading premiums:', err));
  }, []);
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
    <>
      <Menubar
        model={items}
        start={start}
        end={isLoggedIn ? end2 : end1}
        className="custom-menubar"
        style={{ border: 'none', background: 'none' }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '3rem',
          gap: '2rem',
          backgroundColor: '#f7f7f7',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className="pricing-card"
            style={{
              width: '320px',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: plan.title === 'Free Plan' ? '#f9f9f9' : 'white',
              color: '#1e1e1e',
              border: plan.title === 'Free Plan' ? '2px dashed #ccc' : '2px solid #00a45a',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <i
                    className={`pi ${plan.title === 'Free Plan' ? 'pi-users' : 'pi-star'}`}
                    style={{ fontSize: '1.5rem', color: plan.title === 'Free Plan' ? '#888' : '#00a45a' }}
                  />
                  <span style={{ fontSize: '1.4rem', fontWeight: '600', color: '#00a45a' }}>{plan.title}</span>
                  {plan.badge && <Badge value={plan.badge} severity="info" />}
                  {plan.isPopular && (
                    <Badge value="Most Popular" severity="success" style={{ marginLeft: '0.5rem' }} />
                  )}
                </div>
              }
              subTitle={<div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#444' }}>{plan.price}</div>}
              style={{ textAlign: 'center', border: 'none', background: 'transparent', paddingBottom: '1rem' }}
            >
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', marginBottom: '1rem' }}>
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="pi pi-check" style={{ marginRight: '0.5rem', color: '#00a45a' }} />
                    <span style={{ fontSize: '0.95rem', color: '#333' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                label={
                  plan.title === 'Free Plan'
                    ? 'Free'
                    : plan.bought
                      ? 'Already bought'
                      : plan.buttonLabel || 'Buy Now'
                }
                className={plan.buttonClass}
                disabled={plan.title === 'Free Plan' || plan.bought}
                onClick={() => {
                  if (plan.title !== 'Free Plan' && !plan.bought) {
                    navigate(`/PaymentForm?id=${plan.id}`);
                  }
                }}
                style={{
                  backgroundColor:
                    plan.title === 'Free Plan'
                      ? '#ccc'
                      : plan.bought
                        ? '#aaa'
                        : '#00a45a',
                  border: 'none',
                  color: 'white',
                  cursor:
                    plan.title === 'Free Plan' || plan.bought
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    plan.title === 'Free Plan' || plan.bought
                      ? 0.6
                      : 1, // 👈 làm mờ thêm bằng opacity
                }}
              />


            </Card>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div style={{ marginTop: '4rem', textAlign: 'center', padding: '0 2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#00a45a', marginBottom: '1rem' }}>Why choose our plans?</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1rem', color: '#333' }}>
          Premium access unlocks exclusive coding problems, faster execution, submission analytics, and
          personalized support. It helps us build a better learning environment for everyone.
        </p>
      </div>

      {/* Footer */}
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
    </>

  );
}