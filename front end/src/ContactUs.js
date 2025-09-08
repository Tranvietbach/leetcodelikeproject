import React, { useEffect, useState } from 'react';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file
import axios from "axios";
import { Menubar } from 'primereact/menubar';
import { Row, message, Input,Col } from 'antd';

import {
    FacebookFilled,
    TwitterSquareFilled,
    LinkedinFilled,
    GithubFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";  
const ContactUs = () => {
        const navigate = useNavigate(); // khởi tạo điều hướng
        const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const contactDetails = [
        { icon: "📍", label: "Address", value: "123 Code Street, Dev City, Country" },
        { icon: "✉️", label: "Email", value: "support@codeweb.com" },
        { icon: "📞", label: "Phone", value: "+84 123 456 789" },
        { icon: "⏰", label: "Working Hours", value: "Mon - Fri: 9:00 - 18:00" },
    ];
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
        <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
                        <Menubar
                            model={items}
                            start={start}
                            end={isLoggedIn ? end2 : end1}
                            className="custom-menubar"
                            style={{ border: 'none', background: 'none' }}
                        />  
            {/* Banner */}
            <div style={{
                backgroundColor: "#00a45a",
                color: "white",
                padding: "60px 20px",
                textAlign: "center"
            }}>
                <h1>Contact Us</h1>
                <p>We are always ready to support you. Contact us now!</p>
            </div>

            {/* Google Map */}
            <div style={{ margin: "40px 0", display: "flex", justifyContent: "center" }}>
                <iframe
                    title="google-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.966169846472!2d105.74615676962543!3d21.038099850497833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134552afb2bc2b9%3A0xf94b886472c56b9e!2zRlBUIEFwdGVjaCAtIEjhu4cgdGjhu5FuZyDEkcOgbyB04bqhbyBM4bqtcCB0csOsbmggdmnDqm4gUXXhu5FjIHThur8!5e0!3m2!1svi!2s!4v1755187945284!5m2!1svi!2s"
                    width="80%"
                    height="450"
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>

            <Divider />

            {/* Contact Form + Details */}
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", margin: "40px 20px" }}>
                {/* Form */}
                <Card title="Send us a Message" style={{ width: "400px", margin: "10px" }}>
                    <div className="p-field">
                        <label htmlFor="name">Your Name</label>
                        <InputText id="name" placeholder="Enter your name" style={{ width: "100%" }} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" placeholder="Enter your email" style={{ width: "100%" }} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="message">Message</label>
                        <InputTextarea id="message" rows={5} placeholder="Type your message..." style={{ width: "100%" }} />
                    </div>
                    <Button label="Send Message" style={{ backgroundColor: "#00a45a", border: "none" }} />
                </Card>

                {/* Contact Details */}
                <Card title="Our Contact Info" style={{ width: "400px", margin: "10px", backgroundColor: "#e6f7ef" }}>
                    {contactDetails.map((detail, index) => (
                        <div key={index} style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
                            <div style={{
                                fontSize: "24px",
                                marginRight: "15px",
                                color: "#00a45a"
                            }}>{detail.icon}</div>
                            <div>
                                <h4 style={{ margin: 0 }}>{detail.label}</h4>
                                <p style={{ margin: 0 }}>{detail.value}</p>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            {/* Team & Support */}
            <div style={{ margin: "60px 20px", textAlign: "center" }}>
                <h2 style={{ color: "#00a45a" }}>Support Team</h2>
                <p>Đội ngũ của chúng tôi luôn sẵn sàng giúp bạn 24/7.</p>
                <DataTable value={contactDetails} style={{ marginTop: "20px", width: "80%", marginLeft: "auto", marginRight: "auto" }}>
                    <Column field="label" header="Type"></Column>
                    <Column field="value" header="Information"></Column>
                </DataTable>
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
                <FacebookFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e)=>e.target.style.color="#00a45a"} onMouseOut={(e)=>e.target.style.color="#ccc"} />
                <TwitterSquareFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e)=>e.target.style.color="#00a45a"} onMouseOut={(e)=>e.target.style.color="#ccc"} />
                <LinkedinFilled style={{ fontSize: 26, marginRight: 12, cursor: "pointer", color: "#ccc" }} onMouseOver={(e)=>e.target.style.color="#00a45a"} onMouseOut={(e)=>e.target.style.color="#ccc"} />
                <GithubFilled style={{ fontSize: 26, cursor: "pointer", color: "#ccc" }} onMouseOver={(e)=>e.target.style.color="#00a45a"} onMouseOut={(e)=>e.target.style.color="#ccc"} />
            </div>
        </Col>

        {/* Cột 2 - Liên kết nhanh */}
        <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Quick Links</h3>
            {["Home", "About Us", "Contact", "Problem Set", "Ranking"].map((link, i) => (
                <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}
                    onMouseOver={(e)=>e.target.style.color="#00a45a"}
                    onMouseOut={(e)=>e.target.style.color="#ccc"}>
                    {link}
                </p>
            ))}
        </Col>

        {/* Cột 3 - Sản phẩm/Dịch vụ */}
        <Col xs={24} sm={12} md={4}>
            <h3 style={{ color: "#fff", marginBottom: 15, fontSize: "18px" }}>Features</h3>
            {["Contests", "Premium", "Profile", "Leaderboard", "Statistics"].map((link, i) => (
                <p key={i} style={{ color: "#ccc", cursor: "pointer", marginBottom: "8px" }}
                    onMouseOver={(e)=>e.target.style.color="#00a45a"}
                    onMouseOut={(e)=>e.target.style.color="#ccc"}>
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
};

export default ContactUs;
