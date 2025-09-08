import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Row, message, Input, Col } from 'antd';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file
import { Menubar } from 'primereact/menubar';
import 'primereact/resources/themes/saga-blue/theme.css'; // Chọn theme phù hợp
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // Chọn icon phù hợp  
import {
    FacebookFilled,
    TwitterSquareFilled,
    LinkedinFilled,
    GithubFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
const AboutUs = () => {
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

            alert('Phản hồi của bạn đã được gửi thành công!');
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
    const timelineEvents = [
        { date: '2022', content: 'Launch of the first coding practice website' },
        { date: '2023', content: 'Expanded languages and exercises' },
        { date: '2024', content: 'Add ranking and contest features' },
    ];

    const stats = [
        { label: "Users", value: "25k+" },
        { label: "Problems", value: "1200+" },
        { label: "Contests", value: "45+" },
    ];

    const teamMembers = [
        { name: "Nguyen Anh Tuan", role: "Lead Developer", avatar: "/TuanImage.png" },
        { name: "Tien Anh Nguyen", role: "Dev", avatar: "/TienAnhImage.png" },
        { name: "Bach Tran", role: "Vice Lead Developer", avatar: "/BachImage.png" },
    ];

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <Menubar
                model={items}
                start={start}
                end={isLoggedIn ? end2 : end1}
                className="custom-menubar"
                style={{ border: 'none', background: 'none' }}
            />
            {/* Banner */}
            <div style={{
                backgroundColor: '#00a45a',
                color: 'white',
                padding: '80px 20px',
                textAlign: 'center'
            }}>
                <h1>About Us</h1>
                <p>We help you practice coding, improve your programming skills, and conquer challenges.</p>
                <Button label="Join Now" style={{ backgroundColor: 'white', color: '#00a45a', border: 'none' }} />
            </div>

            {/* Mission & Vision */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px', flexWrap: 'wrap' }}>
                <Card title="Our Mission" style={{ width: '300px', margin: '10px' }}>
                    <p>Improve programming skills for everyone, from students to professional developers.</p>
                </Card>
                <Card title="Our Vision" style={{ width: '300px', margin: '10px' }}>
                    <p>Become the leading coding training platform, helping programmers confidently solve any technical challenge.</p>
                </Card>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '60px 0', flexWrap: 'wrap' }}>
                {stats.map((stat, index) => (
                    <Card key={index} style={{ width: '200px', margin: '10px', textAlign: 'center', backgroundColor: '#e6f7ef' }}>
                        <h2 style={{ color: '#00a45a' }}>{stat.value}</h2>
                        <p>{stat.label}</p>
                    </Card>
                ))}
            </div>

            <Divider />

            {/* Timeline */}
            <div style={{ margin: '40px 20px' }}>
                <h2 style={{ color: '#00a45a', textAlign: 'center' }}>Our Journey</h2>
                <Timeline value={timelineEvents} align="alternate" content={(item) => (
                    <Card>
                        <h4>{item.date}</h4>
                        <p>{item.content}</p>
                    </Card>
                )} />
            </div>

            <Divider />

            {/* Team */}
            <div style={{ margin: '40px 20px', textAlign: 'center' }}>
                <h2 style={{ color: '#00a45a' }}>Meet Our Team</h2>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                    {teamMembers.map((member, index) => (
                        <Card key={index} style={{ width: '250px', margin: '15px', textAlign: 'center' }}>
                            <Avatar image={member.avatar} size="xlarge" shape="circle" />
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <Divider />

            {/* FAQ */}
            <div style={{ margin: '40px 20px' }}>
                <h2 style={{ color: '#00a45a', textAlign: 'center' }}>FAQ</h2>
                <Accordion>
                    <AccordionTab header="How to start coding?">
                        <p>Just sign up for an account and choose a workout or contest to enter.</p>
                    </AccordionTab>
                    <AccordionTab header="What programming languages are supported?">
                        <p>We currently support Python, Java, JavaScript</p>
                    </AccordionTab>
                    <AccordionTab header="Can I join the problem?">
                        <p>Yes, you can participate in weekly problems to challenge your skills.</p>
                    </AccordionTab>
                </Accordion>
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
};

export default AboutUs;
