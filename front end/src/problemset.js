import React, { useState, useEffect } from 'react';
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
import { Carousel } from 'antd';
import { Calendar, Table, Menu, Divider, Flex, Tag, InputNumber } from 'antd';
import dayjs from 'dayjs';
import './App.css';
import { Select } from 'antd';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';


import {
    FacebookFilled,
    TwitterSquareFilled,
    LinkedinFilled,
    GithubFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined, DownOutlined, LeftOutlined, RightOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, theme } from 'antd';
import { Input } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const MAX_COUNT = 3;
const colorPrimary = '#00a45a';
const colorSecondary = '#1a1a1a';
const colorLight = '#ffffff';
const colorGray = '#f0f0f0';
export default function TemplateDemo() {
    const params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const imagePath = "/images/Screenshot 2025-05-30 083029";
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [startid, setStart] = useState(parseInt(params.get("startId")) || null);
    const [endid, setEnd] = useState(parseInt(params.get("endId")) || null);
    const [data, setData] = useState([]);

    const [values, setValues] = useState(
        params.get("tags")?.split(',').filter(Boolean).map(Number) || []
    ); const suffix = (
        <>
            <span>
                {values.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );
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
    const [date, setDate] = useState(null);
    const [value, setValue] = useState(dayjs());
    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        background: '#00a45a'
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên bài',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (difficulty) => {
                const rocketCount = Math.max(1, difficulty);
                return (
                    <span>
                        {Array.from({ length: rocketCount }).map((_, index) => (
                            <span key={index}>⚡</span>
                        ))}
                    </span>
                );
            },
        },
        {
            title: 'Premium',
            dataIndex: 'premiums',
            key: 'premiums',
            render: (premiums) => {
                if (!premiums || premiums.length === 0) {
                    return <Tag color="green">Free</Tag>;
                }

                return (
                    <>
                        {premiums.map((p) => (
                            <Tag color="gold" key={p.id}>
                                {p.name} (${p.price})
                            </Tag>
                        ))}
                    </>
                );
            },
        },
        {
            title: 'Làm bài',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    style={{ background: '#00a45a', margin: 0, border: 'none' }}
                    onClick={() =>
                        window.open(`http://localhost:3000/Problemtranning?id=${record.id}`, "_blank")
                    }
                >
                    start code
                </Button>
            ),
        },
    ];


    const [title, setTitle] = useState(params.get("title") || '');
    const [columnsstar, setcolumnsstar] = useState(parseInt(params.get("difficulty")) || null);
    const [premium, setpremium] = useState([]);

    useEffect(() => {
        axios.post("http://localhost:2109/api/allproblems", {
            title: params.get("title") || "",
            startId: parseInt(params.get("startId")) || 1,
            endId: parseInt(params.get("endId")) || 999,
            difficulty: parseInt(params.get("difficulty")) || 1,
            tags: params.get("tags")?.split(',').filter(Boolean).map(Number) || [],

        }).then((res) => setData(res.data));
    }, [
        title,
        startid,
        endid,
        String(columnsstar),
        values.join(','),
    ]);


    const onClick = e => {
        console.log('click ', e);
    };
    const [optionsTag, setOptionsTag] = useState([]);

    const [options, setOptions] = useState([
        { value: 1, label: '⚡' },
        { value: 2, label: '⚡⚡' },
        { value: 3, label: '⚡⚡⚡' },
        { value: 4, label: '⚡⚡⚡⚡' },
        { value: 5, label: '⚡⚡⚡⚡⚡' },
    ]);



    const [allCompanies, setAllCompanies] = useState([]);


    const visibleCount = 5; // Số tag hiển thị một lần
    const [startIndex, setStartIndex] = useState(0);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    };

    const handleNext = () => {
        setStartIndex((prev) =>
            Math.min(prev + visibleCount, allCompanies.length - visibleCount)
        );
    };

    const visibleCompanies = allCompanies.slice(startIndex, startIndex + visibleCount);

    const handleSearch = () => {
        const queryParams = new URLSearchParams({
            title,
            startId: startid ?? '1',
            endId: endid ?? '999',
            difficulty: columnsstar ?? 1,
            tags: values.join(','),
        });

        // Cập nhật URL và điều hướng
        window.location.href = `/problemset?${queryParams.toString()}`;
    };

    useEffect(() => {
        axios.get("http://localhost:2109/api/tags")
            .then((res) => {
                const fetchedOptions = res.data.map(tag => ({
                    value: tag.id,
                    label: tag.name
                }));
                setOptionsTag(fetchedOptions);
            })
            .catch(err => {
                console.error("Error fetching tags:", err);
            });
    }, []);
    useEffect(() => {
        axios.get("http://localhost:2109/api/companies")
            .then(res => setAllCompanies(res.data));
    }, []);
    return (
        <div className="card">
            <Menubar
                model={items}
                start={start}
                end={isLoggedIn ? end2 : end1}
                className="custom-menubar"
                style={{ border: 'none', background: 'none' }}
            />               <hr style={{
                border: 'none',
                height: '1px',
                backgroundColor: '#00a45a',
                margin: '0 0'
            }} />
            <Layout style={{ minHeight: '100vh', background: '#00a45a' }}>
                <Sider width={350} style={siderStyle}>
                    {/* Calendar */}
                    <div
                        style={{
                            height: 315,
                            padding: 20,
                            boxSizing: 'border-box',
                            marginBottom: '20px'
                        }}
                    >
                        <Calendar
                            fullscreen={false}
                            value={value}
                            onSelect={setValue}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>

                    {/* Menu */}
                    <div
                        style={{
                            height: 'auto',
                            padding: 20,
                            boxSizing: 'border-box',
                            overflowY: 'auto',
                        }}
                    >

                    </div>

                    {/* Trending Companies */}
                    <div
                        style={{
                            padding: 20,
                            boxSizing: 'border-box',
                            width: '100%',
                        }}
                    >
                        <div
                            style={{
                                padding: 16,
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                background: '#fff',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <h4 style={{ marginBottom: 16, fontWeight: 600 }}>⚡ Trending Companies</h4>

                            {/* Danh sách Tag */}
                            <Flex
                                wrap="wrap"
                                gap="small"
                                justify="center"
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                {visibleCompanies.map((company) => (
                                    <Tag
                                        key={company.id}
                                        style={{
                                            backgroundColor: '#00a45a',
                                            color: '#fff',
                                            fontSize: '14px',
                                            padding: '6px 12px',
                                            borderRadius: 4,
                                            marginBottom: 4,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => window.location.href = `/listcompanies?id=${company.id}`}
                                    >
                                        <b>{company.name}</b>
                                    </Tag>
                                ))}
                            </Flex>

                            {/* Nút trái/phải nằm cạnh nhau */}
                            <Flex justify="center" gap="small">
                                <Button
                                    icon={<LeftOutlined />}
                                    onClick={handlePrev}
                                    disabled={startIndex === 0}
                                    style={{
                                        backgroundColor: '#00a45a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '0 16px',
                                        fontWeight: 500,
                                    }}
                                >
                                </Button>

                                <Button
                                    icon={<RightOutlined />}
                                    onClick={handleNext}
                                    disabled={startIndex + visibleCount >= allCompanies.length}
                                    style={{
                                        backgroundColor: '#00a45a',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '0 16px',
                                        fontWeight: 500,
                                    }}
                                >

                                </Button>


                            </Flex>
                        </div>

                    </div>
                </Sider>


                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />


                    <Content style={{ margin: '0', background: 'white' }}>
                        <Breadcrumb style={{ margin: '0' }} />
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                gap: '20px',
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Flex style={{ background: 'white', marginBottom: '20px' }} gap="4px 0" wrap>
                                {optionsTag.map((tag, index) => (
                                    <Tag
                                        key={tag.value}
                                        bordered={false}
                                    >
                                        {tag.label}
                                    </Tag>
                                ))}
                            </Flex>
                            <Select
                                mode="multiple"
                                maxCount={MAX_COUNT}
                                value={values}
                                style={{ width: '100%', marginBottom: '20px' }}
                                onChange={setValues}
                                suffixIcon={suffix}
                                placeholder="Please select"
                                className="custom-select"
                                options={optionsTag}
                            />
                            <Flex style={{ background: 'white', marginBottom: '20px' }} wrap gap="small">
                                <Input value={title}                    // <-- đã có từ query param
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Search title..."
                                />
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Chọn số sao"
                                    value={columnsstar}
                                    onChange={setcolumnsstar}
                                    optionFilterProp="label"
                                    options={options}
                                />
                                <InputNumber
                                    placeholder="Start"
                                    value={startid}
                                    onChange={setStart}
                                    style={{ width: 100 }}
                                />

                                <InputNumber
                                    placeholder="End"
                                    value={endid}
                                    onChange={setEnd}
                                    style={{ width: 100 }}
                                />
                            </Flex>
                            <Button style={{ background: '#00a45a', margin: 0, border: 'none', marginBottom: '1rem' }}
                                type="primary" onClick={handleSearch}>Search</Button>
                            {/* <Row gutter={[8, 8]} style={{ marginBottom: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                                <Col>
                                    <strong>Title:</strong> {title ? <Tag color="blue">{title}</Tag> : <Tag>---</Tag>}
                                </Col>
                                <Col>
                                    <strong>Start ID:</strong> {startid ? <Tag>{startid}</Tag> : <Tag>---</Tag>}
                                </Col>
                                <Col>
                                    <strong>End ID:</strong> {endid ? <Tag>{endid}</Tag> : <Tag>---</Tag>}
                                </Col>
                                <Col>
                                    <strong>Hard level:</strong> {columnsstar ? (
                                        <Tag color="geekblue">{columnsstar}</Tag>
                                    ) : <Tag>---</Tag>}
                                </Col>
                                <Col>
                                    <strong>Tags:</strong> {values.length > 0 ? (
                                        values.map((tagId) => (
                                            <Tag color="purple" key={tagId}>{tagId}</Tag>
                                        ))
                                    ) : <Tag>---</Tag>}
                                </Col>
                            </Row> */}
                            <Table
                                columns={columns}
                                pagination={{ pageSize: 10 }}
                                size="small"
                                dataSource={data}
                                rowKey="id"
                                style={{
                                    color: '#00a45a',
                                    background: 'white',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}
                            />

                        </div>
                    </Content>
                    {/* <pre>{JSON.stringify({
                        title: params.get("title") || "",
                        startid: parseInt(params.get("startId")) || 1,
                        endid: parseInt(params.get("endId")) || 999,
                        difficulty: parseInt(params.get("difficulty")) || 1,
                        values: params.get("tags")?.split(',').filter(Boolean).map(Number) || [],
                    }, null, 2)}</pre> */}
                    <Footer style={{ textAlign: 'center', background: 'white' }}>
                    </Footer>
                </Layout>
            </Layout>
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
    )
}
