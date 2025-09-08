import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card } from 'primereact/card';
import { Col, Row } from 'antd';
import { Image } from 'primereact/image';
import { Images } from 'antd';
import { Carousel, message, Input } from 'antd';
import './App.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file
import {
    FacebookFilled,
    TwitterSquareFilled,
    LinkedinFilled,
    GithubFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
const contentStyle = {
    margin: 0,
    height: '35vh',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '',
};


export default function TemplateDemo() {


    const imagePath = "/images/Screenshot 2025-05-30 083029";
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
        }
        ,
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
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '5rem' }}>
            <h2 style={{ color: '#00a45a', margin: 0, fontFamily: 'Arial, sans-serif' }}>
                <b>PRIMEDEV</b>
            </h2>
        </div>
    );
    const end1 = (
        <div className="flex align-items-center gap-2">
            <Menubar className="custom-menubar"
                style={{
                    color: '#333333',
                    border: 'none',
                    background: 'none',
                    fontWeight: '500'
                }}
                model={items2} />
        </div>
    );
    const end2 = (
        <div className="flex align-items-center gap-2">
            <Menubar className="custom-menubar"
                style={{
                    color: '#333333',
                    border: 'none',
                    background: 'none',
                    fontWeight: '500'
                }} model={items3} />
        </div>
    );
    const logos = [
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/673d7a6b22208f1a1fefa8a2_AirBnB-BW.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/673d7a6b22208f1a1fefa817_Stripe-BW.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/6787f6f4bb18a3ca707ac771_linkedin.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/673d7a6bae7ad199a36794eb_Atlassian-BW.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/6787f76721b5766b2190fe7d_ibm.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/673d7a6bc5556b277d750a69_Doordash-BW.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/673d7a6a9a5cd6110dc622db_Snap-color.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/6787f815d46542504f9cee31_adobe.svg",
        "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/6787f9e10d903ef8395e299a_goldmansachs.svg"
    ];

    const testimonials = [
        {
            logo: 'https://cdn.prod.website-files.com/.../Atlassian-Logo.png',
            company: 'Atlassian',
            quote: "HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.",
            author: 'K. Thomas Head of Talent Acquisition'
        },
        {
            logo: 'https://cdn.prod.website-files.com/.../Atlassian-Logo.png',
            company: 'Atlassian',
            quote: "HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.",
            author: 'K. Thomas Head of Talent Acquisition'
        },
        {
            logo: 'https://cdn.prod.website-files.com/.../Atlassian-Logo.png',
            company: 'Atlassian',
            quote: "HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.",
            author: 'K. Thomas Head of Talent Acquisition'
        },
        // các testimonial khác
    ];
    return (
        <div className="card">
                                <div
      style={{
        position: "fixed",      // luôn cố định
        bottom: "20px",         // cách dưới 20px
        right: "20px",          // cách phải 20px
        zIndex: 1000,           // luôn nổi trên UI
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        backgroundColor: "#00a45a", // màu quốc kỳ Ukraine xanh
        color: "#fff",           // vàng của Ukraine
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        cursor: "default",
        fontWeight: "bold",
        fontSize: "14px",
      }}
      title="Ủng hộ nhân đạo Ukraine"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg"
        alt="Ukraine"
        style={{
          width: "24px",
          height: "16px",
          marginRight: "8px",
          borderRadius: "2px",
        }}
      />
      We and democracy supports Ukraine 
            <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/DemocraticLogo.svg/250px-DemocraticLogo.svg.png"
        alt="Ukraine"
        style={{
          height: "26px",
          marginRight: "8px",
          borderRadius: "2px",
        }}
      />
    </div>
            <Menubar
                model={items}
                start={start}
                end={isLoggedIn ? end2 : end1}
                className="custom-menubar"
                style={{
                    border: 'none',
                    background: '#ffffff',
                    padding: '0.5rem 2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: '0 0 8px 8px'
                }}
            />
            <Card
                style={{
                    width: '60%',
                    margin: '3rem auto', // căn giữa ngang và thêm khoảng cách top/bottom
                    textAlign: 'center',
                    border: 'none',
                    padding: '2rem 3%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    background: '#ffffff'
                }}
            >
                <h1
                    className='font1'
                    style={{
                        fontSize: '48px',
                        color: '#00a45a',
                        marginBottom: '1rem',
                        fontWeight: '700',
                        lineHeight: '1.2'
                    }}
                >
                    Become the Next Generation Developer
                </h1>
                <h3
                    style={{
                        fontWeight: '400',
                        color: '#555555',
                        marginBottom: '2rem',
                        lineHeight: '1.5'
                    }}
                >
                    We help thousands of companies hire and upskill the next generation of developers, and millions of developers to become one.
                </h3>
                <div className="flex justify-content-center gap-3">
                    <Button
                        style={{
                            backgroundColor: '#00a45a',
                            border: '1px solid #00a45a',
                            color: '#fff',
                            padding: '0.6rem 1.8rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                        label="Get Started"
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#008f46'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#00a45a'}
                    />
                    <Button
                        style={{
                            color: '#00a45a',
                            border: '1px solid #00a45a',
                            padding: '0.6rem 1.8rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: '0.3s',
                            background: 'transparent'
                        }}
                        label="Learn More"
                        className="p-button-outlined"
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    />
                </div>
            </Card>
            <div style={{ overflow: 'hidden', padding: '5% 7%', background: '', borderRadius: '12px' }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '2%',
                        animation: 'scroll 20s linear infinite',
                    }}
                >
                    {logos.concat(logos).map((src, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '50px',       // chiều cao cố định
                                cursor: 'pointer',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'scale(1.2)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Image
                                src={src}
                                alt="logo"
                                style={{
                                    maxHeight: '60px', // chiều cao bằng nhau
                                    width: 'auto',     // chiều dài tự do
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    ))}
                </div>

                <style>
                    {`
        @keyframes scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        `}
                </style>
            </div>
            <Card
                style={{
                    width: '75%',
                    background: '#0d0d0d',
                    margin: '5% auto',
                    textAlign: 'left',
                    border: 'none',
                    padding: '3% 5%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.6)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', color: 'white' }}>
                    <h1
                        className="font1"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '2rem',
                            fontWeight: 700,
                            lineHeight: '1.3',
                            background: 'linear-gradient(90deg, #00a45a, #00ff9f)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0
                        }}
                    >
                        The future is human <span style={{ fontWeight: 300, fontSize: '1.5rem' }} className="font3">plus</span> AI.
                    </h1>

                    <p
                        className="font2"
                        style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 400,
                            lineHeight: '1.8',
                            color: '#e0e0e0'
                        }}
                    >
                        We’ve entered a new era of software development where human and AI build together. This changes the skills you need as a developer.
                    </p>

                    <p
                        className="font2"
                        style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 400,
                            lineHeight: '1.8',
                            color: '#e0e0e0'
                        }}
                    >
                        It also changes the way companies engage, hire, and upskill technical talent. In short, this changes everything.
                    </p>
                </div>
            </Card>

            <Row style={{ paddingLeft: '7%', paddingRight: '7%', paddingTop: '5%' }} gutter={[16]}>
                <Col style={{ justifyContent: 'center', textAlign: 'center' }} span={24}><h1 className='font2' style={{ fontSize: '50px' }}>The Developer Skills Platform</h1></Col>
            </Row>
            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#f9f9f9', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 1 */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
            </Row>

            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#ffffff', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 2 - Image on left */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
            </Row>

            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#f9f9f9', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 1 */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
            </Row>

            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#ffffff', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 2 - Image on left */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
            </Row>


            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#f9f9f9', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 1 */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
            </Row>

            <Row style={{ padding: '5% 10%', marginBottom: '5%', alignItems: 'center', background: '#ffffff', borderRadius: '12px' }} gutter={[16, 16]}>
                {/* Section 2 - Image on left */}
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', padding: '2%' }}>
                    <Image
                        height={362}
                        style={{ objectFit: 'contain', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                        src="/Screenshot_2025-05-30_083029.png"
                    />
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', padding: '2%' }}>
                    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Button
                            style={{
                                color: 'white',
                                background: '#00a45a',
                                height: '36px',
                                fontSize: '15px',
                                width: '120px',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            label="Learn More"
                            className="font3"
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <h1 className="font1" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: '1.3', margin: 0 }}>
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className="font1" style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: '1.6', color: '#333' }}>
                            Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3 style={{ fontSize: '1.1rem', color: '#00a45a', cursor: 'pointer' }}>Learn more ➜</h3>
                    </div>
                </Col>
            </Row>

            <Row style={{ paddingLeft: '25%', paddingRight: '25%', background: '#0d0d0d', paddingTop: '3.5%', paddingBottom: '5%' }} gutter={[16]}>
                <Col style={{ justifyContent: 'center', textAlign: 'center', padding: '4% 2%' }} span={24}>
                    <h1 className='font2' style={{ fontSize: '50px', color: 'white' }}>Loved by companies of all sizes and developers from all backgrounds</h1>
                </Col>
                <Col style={{ justifyContent: 'center', textAlign: 'center', padding: '2% 2%' }} span={24}>
                    <Carousel >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            <Image
                                height={100}
                                style={{
                                    marginLeft: '40%',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                                src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a3c832ff33bda63211a329_Atlassian-Logo.png"
                            />
                            <h2 style={{ color: 'white' }} className='font1'>HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.</h2>
                            <h3 style={{ color: 'white', marginBottom: '5%', color: '#00a45a' }} className='font3'>K. Thomas Head of Talent Acquisition</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            <Image
                                height={100}
                                style={{
                                    marginLeft: '40%',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                                src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a3c832ff33bda63211a329_Atlassian-Logo.png"
                            />
                            <h2 style={{ color: 'white' }} className='font1'>HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.</h2>
                            <h3 style={{ color: 'white', marginBottom: '5%', color: '#00a45a' }} className='font3'>K. Thomas Head of Talent Acquisition</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            <Image
                                height={100}
                                style={{
                                    marginLeft: '40%',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                                src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a3c832ff33bda63211a329_Atlassian-Logo.png"
                            />
                            <h2 style={{ color: 'white' }} className='font1'>HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.</h2>
                            <h3 style={{ color: 'white', marginBottom: '5%', color: '#00a45a' }} className='font3'>K. Thomas Head of Talent Acquisition</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                            <Image
                                height={100}
                                style={{
                                    marginLeft: '40%',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                                src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a3c832ff33bda63211a329_Atlassian-Logo.png"
                            />
                            <h2 style={{ color: 'white' }} className='font1'>HackerRank helped us go beyond traditional universities. We've scaled up our college hiring from zero to 200.</h2>
                            <h3 style={{ color: 'white', marginBottom: '5%', color: '#00a45a' }} className='font3'>K. Thomas Head of Talent Acquisition</h3>
                        </div>
                    </Carousel>

                </Col>
            </Row>
            <Row style={{ paddingLeft: '11%', paddingRight: '11%', paddingTop: '2%', marginBottom: '1%' }}>

                <Col style={{ justifyContent: 'center', textAlign: 'center', padding: '4% 2%' }} span={12}>
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                        <Button
                            style={{ color: 'white', background: 'black', height: '33px', fontSize: '15px' }}
                            label="Learn More"
                            className="font3"
                        />
                        <h1 className='font1' >
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className='font1'>Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3>Learn more ➜</h3>
                    </div>
                </Col>
                <Col style={{ justifyContent: 'center', textAlign: 'center', padding: '4% 2%' }} span={12}>
                    <div style={{ marginTop: '20px', textAlign: 'left' }}>
                        <Button
                            style={{ color: 'white', background: 'black', height: '33px', fontSize: '15px' }}
                            label="Learn More"
                            className="font3"
                        />
                        <h1 className='font1' >
                            Prepare and apply for your dream job
                        </h1>
                        <h3 className='font1'>Over 26 million developers have joined the HackerRank community to certify their skills, practice interviewing, and discover relevant jobs. An AI Mock Interviewer can help you prepare, while our QuickApply agent puts your job search on autopilot.
                        </h3>
                        <h3>Learn more ➜</h3>
                    </div>
                </Col>
            </Row>
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
                            Send Feedback
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
    )
}