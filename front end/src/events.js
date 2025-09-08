import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Col, Row } from 'antd';
import { Menubar } from 'primereact/menubar';


export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [progress, setProgress] = useState({ solvedCount: 0, totalCount: 1 });

    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );
    const imagePath = "/images/Screenshot 2025-05-30 083029";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Chưa có token, chưa đăng nhập");
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
                alert("Token hợp lệ, userId: " + data.id);
            })
            .catch(() => {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                alert("Token không hợp lệ, đã đăng xuất");
            });
    }, []);
    const items = [
        {
            label: 'Home',
            template: itemRenderer

        },
        {
            label: 'Features',
            template: itemRenderer

        },
        {
            label: 'Projects',
            template: itemRenderer
            ,
            items: [
                {
                    label: 'Core',
                    template: itemRenderer
                },
                {
                    label: 'Blocks',
                    template: itemRenderer
                },
                {
                    label: 'UI Kit',
                    template: itemRenderer
                },
                {
                    separator: true
                },
                {
                    label: 'Templates',
                    items: [
                        {
                            label: 'Apollo',
                            badge: 2,
                            template: itemRenderer
                        },
                        {
                            label: 'Ultima',
                            badge: 3,
                            template: itemRenderer
                        }
                    ]
                }
            ]
        },
        {
            label: 'Contact',
            template: itemRenderer
        }
    ];

    const items2 = [

        {
            label: 'Projects',
            template: itemRenderer,

            items: [
                {
                    label: 'Login',
                    template: itemRenderer,
                },
                {
                    label: 'Register',
                    template: itemRenderer,
                },

            ]
        },


    ];
    const items3 = [

        {
            label: 'Projects',
            template: itemRenderer,

            items: [
                {
                    label: 'Profile',
                    template: itemRenderer,
                },
                {
                    label: 'Logout',
                    template: itemRenderer,
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
    useEffect(() => {
        const eventId = 1; // Hoặc lấy từ URL/router
        axios.get(`http://localhost:2109/api/${eventId}/problems/event`)
            .then((res) => {
                const data = res.data;
                const mapped = data.map(p => ({
                    id: p.problemId,
                    title: p.problemTitle,
                    eventTitle: p.eventTitle,
                    difficulty: ['Easy', 'Medium', 'Hard'][p.difficulty] || 'Easy',
                }));
                setProblems(mapped);
            });
    }, []);
    const difficultyTemplate = (rowData) => {
        const severity = {
            Easy: 'success',
            Medium: 'warning',
            Hard: 'danger',
        }[rowData.difficulty] || 'success';

        return (
            <Tag value={rowData.difficulty} severity={severity} />
        );
    };
    const tagsTemplate = (rowData) => (
        <div className="flex flex-wrap gap-2">
            {rowData.tags.map((tag, idx) => (
                <Tag key={idx} value={tag} rounded className="bg-gray-100 text-gray-800" />
            ))}
        </div>
    );

    const submitRateTemplate = (rowData) => (
        <div className="flex align-items-center gap-2">
            <ProgressBar
                value={rowData.submitRate}
                style={{ width: '100%', height: '18px' }}
                showValue={false}
            />
            <Badge value={`${rowData.submitRate}%`} severity="info" />
        </div>
    );

    const titleBodyTemplate = (rowData) => (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-code text-blue-500" />
            <span className="font-medium text-lg">{rowData.title}</span>
        </div>
    );

    const filteredProblems = problems.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(globalFilter.toLowerCase());
        const difficultyMatch = selectedDifficulty ? p.difficulty === selectedDifficulty : true;
        return titleMatch && difficultyMatch;
    });

    return (
        <div >
            <Menubar
                model={items}
                start={start}
                end={isLoggedIn ? end2 : end1}
                className="custom-menubar"
                style={{ border: 'none', background: 'none' }}
            />

            <Card
                title={<div className="text-2xl font-semibold text-blue-700">🚀 Company Problems (Doordash)</div>}
                className="shadow-4 border-round-2xl"
            >
                <div className="flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search problems by title..."
                            className="w-20rem"
                        />
                    </span>

                    <Dropdown
                        value={selectedDifficulty}
                        options={['Easy', 'Medium', 'Hard']}
                        onChange={(e) => setSelectedDifficulty(e.value)}
                        placeholder="Filter by Difficulty"
                        showClear
                        className="w-15rem"
                    />
                </div>

                <DataTable
                    value={filteredProblems}
                    paginator
                    rows={5}
                    responsiveLayout="scroll"
                    className="p-datatable-striped p-datatable-gridlines shadow-2 border-round-xl"
                >
                    <Column field="id" header="ID" sortable style={{ width: '70px' }} />
                    <Column field="title" header="Title" sortable />
                    <Column field="eventTitle" header="Event" />
                    <Column field="difficulty" header="Difficulty" body={difficultyTemplate} sortable />
                </DataTable>
            </Card>
            <Row
                style={{
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    background: '#0d0d0d',
                    paddingTop: '3.5%',
                    paddingBottom: '5%',
                    color: 'white',
                }}
                justify="space-between"
            >
                <Col flex="1" style={{ textAlign: 'center' }}>
                    <h3 className="font1">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                </Col>

                <Col flex="1" style={{ textAlign: 'center' }}>
                    <h3 className="font1">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                </Col>

                <Col flex="1" style={{ textAlign: 'center' }}>
                    <h3 className="font1">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                </Col>

                <Col flex="1" style={{ textAlign: 'center' }}>
                    <h3 className="font1">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                </Col>

                <Col flex="1" style={{ textAlign: 'center' }}>
                    <h3 className="font1">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                    <h3 className="font2">Products</h3>
                </Col>
            </Row>
        </div>
    );
}
