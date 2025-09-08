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
import { useNavigate } from 'react-router-dom'; // thêm ở đầu file


export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [progress, setProgress] = useState({ solvedCount: 0, totalCount: 1 });
  const params = new URLSearchParams(window.location.search);
  const companyId = params.get('id'); // Default to 'doordash' if no ID is provided
    const [rankings, setRankings] = useState([]);
    const navigate = useNavigate(); // khởi tạo điều hướng
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
            return;
        }

        axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
            .then((response) => {
                setIsLoggedIn(true);
            })
            .catch(() => {
                setIsLoggedIn(false);
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
  useEffect(() => {
    axios.get('http://localhost:2109/api/' + companyId + '/problems')
      .then((res) => {
        const data = res.data;
        const enhanced = data.problems.map((p) => ({
          id: p.id,
          title: p.title,
          difficulty: ['Easy', 'Medium', 'Hard'][p.difficulty] || 'Easy',
          tags: p.tags || [],
          submitRate: p.submitRate || 0,
          category: 'General',
        }));
        setProblems(enhanced);
        setCompanyName(data.companyName);
      });

    // 📦 Gọi API tiến độ
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://localhost:2109/api/progress', { token,companyId: companyId})
        .then(res => setProgress(res.data))
        .catch(err => console.error('Progress API failed:', err));
    }
  }, []);

  const difficultyTemplate = (rowData) => {
    const sparkCount = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    }[rowData.difficulty] || 1;

    const severity = {
      Easy: 'success',
      Medium: 'warning',
      Hard: 'danger',
    }[rowData.difficulty];

    return (
      <Tag value={'🔥'.repeat(sparkCount)} severity={severity} className="px-3 py-1" />
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
      <Card className="mb-4 shadow-5 border-round-3xl">
        <div className="mb-3">
          <div className="text-xl font-bold text-blue-600 mb-2">📈 Your Progress</div>
          <ProgressBar
            value={Math.round((progress.solvedCount / progress.totalCount) * 100)}
            displayValueTemplate={() => `${progress.solvedCount}/${progress.totalCount} solved`}
            style={{ height: '24px' }}
            className="shadow-2"
          />
        </div>
      </Card>

      <Card
        title={<div className="text-2xl font-semibold text-blue-700">🚀 Company Problemssss ({companyName})</div>}
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
          sortMode="multiple"
          className="p-datatable-striped p-datatable-gridlines shadow-2 border-round-xl"
        >
          <Column field="id" header="ID" sortable style={{ width: '70px' }} />
          <Column field="title" header="Title" body={titleBodyTemplate} sortable />
          <Column field="category" header="Topic" sortable />
          <Column field="difficulty" header="Difficulty" body={difficultyTemplate} sortable />
          <Column field="tags" header="Tags" body={tagsTemplate} />
          <Column field="submitRate" header="Submit Rate" body={submitRateTemplate} />
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
