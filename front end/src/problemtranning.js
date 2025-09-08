import React, { useState, useRef, useEffect } from 'react';
import { TieredMenu } from 'primereact/tieredmenu';
import axios from "axios";
import { Collapse } from 'antd';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card } from 'primereact/card';
import { Col, Row } from 'antd';
import { Image } from 'primereact/image';
import { Images } from 'antd';
import { Carousel } from 'antd';
import { Calendar, Table, Menu, Divider, Flex, Tag, InputNumber, Splitter, Typography, Tabs, Space, message, Descriptions, List, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, StarFilled, StarTwoTone, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './App.css';
import { Select } from 'antd';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Spin } from 'antd';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, theme } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { Editor } from '@monaco-editor/react';
import { Dropdown } from 'primereact/dropdown';
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

export default function TemplateDemo() {
    const { TextArea } = Input;

    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState([]);
    const { Option } = Select;
    const [activeTab, setActiveTab] = useState('1');
    const { TabPane } = Tabs;
    const { Panel } = Collapse;
    const [results, setResults] = useState([]);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const inputRef = useRef();
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const languageIdToKey = {
        1: 'javascript',
        2: 'java',
        3: 'python',
    };

    useEffect(() => {
        const token = localStorage.getItem("token"); // lấy token từ localStorage

        if (!token) {
            console.log("No token found");
            return;
        }

        axios.get("http://localhost:2109/api/check-email-status", {
            headers: {
                Authorization: token
            }
        })
            .then(response => {
                if (response.data.statusmail) {
                    console.log("Email đã được xác minh");
                } else {
                    alert("You have not verified your email, please check your email to verify.");
                    navigate('/profile');
                }

            })
            .catch(error => {
                alert("You have not verified your email, please check your email to verify.");
                navigate('/profile');
            });
    }, []); // chỉ chạy 1 lần khi component mount

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Chưa có token, chưa đăng nhập");
            navigate("/login");
            return;
        }

        // Kiểm tra token có hợp lệ không bằng API
        axios.post("http://localhost:2109/api/extract-user-id?token=" + token)
            .then((res) => {
                // Token hợp lệ, cho phép ở lại
                console.log("Token hợp lệ, userId:", res.data.id);
            })
            .catch(() => {
                alert("Token hết hạn hoặc không hợp lệ");
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

useEffect(() => {
    const token = localStorage.getItem("token");

    // Kiểm tra token có hợp lệ không bằng API
    axios.get("http://localhost:2109/api/problem-access/check?token=" + token + "&problemId=" + searchParams.get('id'))
        .then((res) => {
            // Token hợp lệ, cho phép ở lại
            if(res.data.access) {
                
            } else {
                alert("bạn cần phải mua premium để truy cập bài này");
                navigate("/Premium");
            }

        })
        .catch(() => {
        });
}, []);



    const fetchComments = async () => {
        if (!problem?.id) return;
        try {
            const res = await axios.get(`http://localhost:2109/api/comments/${problem.id}`);
            setComments(res.data);
        } catch (err) {
            console.error("Lỗi lấy comment:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [problem?.id]);

    const handleAddComment = async () => {
        try {
            await axios.post("http://localhost:2109/api/comments", {
                token: localStorage.getItem("token"),
                problemId: problem.id,
                content: commentInput,
            });
            setCommentInput("");
            fetchComments();
        } catch (err) {
            console.error("Lỗi thêm comment:", err);
        }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await axios.put(`http://localhost:2109/api/comments/${commentId}`, {
                content: editContent,
                token: localStorage.getItem("token"),
            });
            setEditingId(null);
            setEditContent("");
            fetchComments();
        } catch (err) {
            console.error("Lỗi sửa comment:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:2109/api/comments/${commentId}`);
            fetchComments();
        } catch (err) {
            console.error("Lỗi xóa comment:", err);
        }
    };

    const handleEdit = (id, content) => {
        setEditingId(id);
        setEditContent(content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://localhost:2109/api/${searchParams.get('id')}/details`);
                const problemData = res.data;
                setProblem(problemData);

                // Tạo code theo ngôn ngữ
                const codeMap = {};
                problemData.languages.forEach(lang => {
                    const key = languageIdToKey[lang.languageId];
                    if (key) {
                        codeMap[key] = lang.codeStart;
                    }
                });
                setCode(codeMap);

                // Tạo payload ngay từ response thay vì state
                setRequestPayload({
                    problemId: problemData.id,
                    code: codeMap[language],
                    programmingLanguageId: selectedLanguageId,
                    testCases: problemData.testcases.map((tc) => ({
                        expectedOutput: tc.expectedOutput,
                        isPublic: tc.isPublic,
                        details: tc.inputs.map((input) => ({
                            variableName: input.variableName,
                            variableValue: input.variableValue,
                        })),
                    })),
                });
            } catch (error) {
                console.error("Error fetching problem:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, []);


    const handleRun = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:2109/api/runCustomTest", payload);
            setResult(response.data);
        } catch (err) {
            message.error("Chạy thất bại");
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = () => {
        message.success('Đã nộp code!');
        // Thêm logic submit code ở đây
    };

    const handleChangeTab = () => {
        setActiveTab('2');
    };


    const languageOptions = [
        { label: 'JavaScript', value: 'javascript', id: 1 },
        { label: 'Java', value: 'java', id: 2 },
        { label: 'Python', value: 'python', id: 3 },
    ];
    const [language, setLanguage] = useState('javascript');

    const [code, setCode] = useState({
        javascript: `// Write your JavaScript code here\nfunction twoSum(nums, target) {\n  // ...\n}`,
        python: `# Write your Python code here\ndef twoSum(nums, target):\n    # ...\n`,
        java: `// Write your Java code here\npublic class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // ...\n  }\n}`,
    });
    const selectedLanguageId = languageOptions.find(
        (lang) => lang.value === language
    )?.id;


    const [requestPayload, setRequestPayload] = useState();
    const handleRuns = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Chưa có token, chưa đăng nhập");
            navigate('/login');
            return; // THOÁT LUÔN
        }

        try {
            // Kiểm tra token hợp lệ hay không
            const res = await axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`);
            const userId = res.data.id;

            setIsRunning(true);

            if (!problem) return;

            const payload = {
                problemId: problem.id,
                code: code[language],
                programmingLanguageId: selectedLanguageId,
                token: token,
                testCases: problem.testcases.map((tc) => ({
                    expectedOutput: tc.expectedOutput,
                    isPublic: tc.isPublic,
                    details: tc.inputs.map((input) => ({
                        variableName: input.variableName,
                        variableValue: input.variableValue,
                    })),
                })),
            };

            setRequestPayload(payload);

            setLoading(true);
            const response = await axios.post('http://localhost:2109/api/runCode', payload);
            setResults(response.data);
        } catch (error) {
            console.error('Lỗi xác thực hoặc chạy code:', error);

            // Nếu lỗi là do xác thực (401), thì xử lý đăng xuất
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                alert("Token không hợp lệ, đã đăng xuất");
                navigate('/login');
            } else {
                message.error('Đã xảy ra lỗi khi chạy code.');
            }
        } finally {
            setLoading(false);
            setIsRunning(false);
        }
    };


    useEffect(() => {
        if (!problem || !code || !code[language]) return;

        const updatedPayload = {
            problemId: problem.id,
            code: code[language],
            programmingLanguageId: selectedLanguageId,
            testCases: problem.testcases.map((tc) => ({
                expectedOutput: tc.expectedOutput,
                isPublic: tc.isPublic,
                details: tc.inputs.map((input) => ({
                    variableName: input.variableName,
                    variableValue: input.variableValue,
                })),
            })),
        };

        setRequestPayload(updatedPayload);
    }, [problem, code, language]);
    const onCodeChange = (value) => {
        setCode(prev => ({
            ...prev,
            [language]: value,
        }));
    };
    const itemRenderer = (item) => (
        <div className="flex align-items-center gap-2 px-2 py-1">
            <i className={item.icon}></i>
            <span>{item.label}</span>
            {item.shortcut && (
                <span className="ml-auto text-sm text-muted">{item.shortcut}</span>
            )}
        </div>
    );


    // ✅ Dữ liệu menu con trong "end"
    const menuRef = useRef(null);

    const items2 = [
        {
            label: 'Core',
            icon: 'pi pi-bolt',
        },
        {
            label: 'Blocks',
            icon: 'pi pi-server',
        },
        {
            label: 'UI Kit',
            icon: 'pi pi-pencil',
        },
    ];

    // ⬅️ Bên trái Menubar
    const start = (
        <h2 style={{ color: '#00a45a', margin: 0 }}><b>PRIMEDEV</b></h2>);

    // ➡️ Bên phải Menubar
    const end = (
        <div
            className="flex align-items-center gap-2"
            style={{
                whiteSpace: 'nowrap',
                overflow: 'visible',
                flexShrink: 0,
                position: 'relative',
            }}
        >
            {/* Menu xổ xuống khi click */}
            {/* <TieredMenu model={items2} popup ref={menuRef} /> */}

            {/* Nút để bật menu */}
            {/* <Button
                label="Projects"
                icon="pi pi-folder"
                onClick={(e) => menuRef.current.toggle(e)}
                className="p-button-text"
            /> */}


        </div>
    );
    // index.js hoặc App.js (dòng đầu tiên của file)

    const suppressedErrors = [
        'ResizeObserver loop completed with undelivered notifications'
    ];

    const originalConsoleError = console.error;
    console.error = (...args) => {
        if (typeof args[0] === 'string' && suppressedErrors.some(msg => args[0].includes(msg))) {
            // Bỏ qua lỗi ResizeObserver loop
            return;
        }
        originalConsoleError.apply(console, args);
    };


    const [activeKey, setActiveKey] = useState('0');

    const renderDifficultyFlames = (level) => {
        return Array.from({ length: level }, (_, i) => (
            <span key={i} style={{ color: '#f97316', fontSize: '1.2rem' }}>⚡</span>
        ));
    };
    const [inputs, setInputs] = useState([]); // đúng là mảng

    useEffect(() => {
        if (
            problem &&
            Array.isArray(problem.testcases) &&
            problem.testcases.length > 0 &&
            Array.isArray(problem.testcases[0].inputs)
        ) {
            const mappedInputs = problem.testcases[0].inputs.map((input) => ({
                name: input.variableName,
                value: input.variableValue,
                type: parseInt(input.typeInput, 10),
            }));
            setInputs(mappedInputs); // ✅ Chỉ set mảng inputValues
        }
    }, [problem]);

    const payload = {
        problemId: problem?.id,
        programmingLanguageId: 3,
        code: decodeEscapedString(problem?.availablecode || ''),
        slug: problem?.slug,
        inputValues: inputs.map((inp) => ({
            name: inp.name,
            value: inp.value,
            type: inp.type,
        })),
    };
    function decodeEscapedString(str) {
        return str
            .replace(/\\r\\n/g, '\n')          // xuống dòng Windows
            .replace(/\\n/g, '\n')             // xuống dòng Unix
            .replace(/\\"/g, '"')              // nháy kép
            .replace(/\\\\/g, '\\');           // dấu \
    }


    const [result, setResult] = useState(null);
    const [loadingsss, setLoadingsss] = useState(false);
    const [error, setError] = useState(null);

    const handleRunsss = async () => {
        setLoading(true);
        setLoadingsss(null);
        setResult(null);

        const payload = {
            problemId: problem.id,
            programmingLanguageId: 3, // hoặc dynamic nếu bạn có dropdown chọn
            code: code,
            slug: problem.slug,
            inputValues: inputs.map(inp => ({
                name: inp.name,
                value: inp.value,
                type: inp.type,
            })),
        };

        try {
            const response = await axios.post('/api/submit/run', payload); // URL tùy vào backend bạn
            setResult(response.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };
    const handleChanges = (index, newValue) => {
        const updatedInputs = [...inputs];
        updatedInputs[index].value = newValue;
        setInputs(updatedInputs);
    };
    if (!problem || !problem.testcases || !Array.isArray(problem.testcases) || problem.testcases.length === 0) {
        return <Spin />;
    }

    return (
        <>
            <div
                style={{
                    height: '7vh',
                }}
                className="card"
            >
                <Menubar
                    style={{
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 1rem',
                    }}
                    start={start}
                    end={end}
                />
            </div>
            <Splitter
                layout="vertical"
                style={{
                    height: '93vh', // Sửa lại từ 300 thành 100%

                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',

                }}
            >
                <Splitter.Panel>
                    <Splitter
                        style={{
                            height: '100%', // Chiều cao bên trong cũng 100%
                            width: '100%',
                            paddingLeft: '20px', paddingRight: '60px'
                        }}
                    >
                        <Splitter.Panel defaultSize="50%" min="20%" max="70%">

                            <Typography.Title
                                type="secondary"
                                level={5}
                                style={{ whiteSpace: 'nowrap', overflowY: 'auto', color: '' }}
                            >
                                {problem && (
                                    <h2 className='font2' style={{ color: '#00a45a' }}>{problem.id}. {problem.title}</h2>
                                )}                                <Flex gap="4px 0" wrap>

                                    <Tag style={{ border: '1px solid #fff' }} color="">
                                        <Tooltip target=".difficulty" content="Difficulty Level" />

                                        {renderDifficultyFlames(problem.difficulty)}</Tag>

                                </Flex>
                                <p style={{
                                    whiteSpace: 'normal',
                                    overflowY: 'auto',
                                    maxHeight: '100px', // Giới hạn chiều cao
                                    marginTop: '10px'
                                }}>{problem.description}</p>
                                {problem?.testcases?.filter(tc => tc.isPublic).map((tc, index) => (
                                    <div key={tc.id} style={{
                                        fontFamily: "monospace",
                                        backgroundColor: "#f9f9f9",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        whiteSpace: "pre-wrap",
                                        marginBottom: "16px"
                                    }}>
                                        <span style={{
                                            fontWeight: "bold",
                                            color: "#00a45a",
                                        }}>Example {index + 1}:</span>
                                        <br /><br />

                                        {tc.inputs.map(input => (
                                            <div key={input.variableName}>
                                                <span style={{ fontWeight: "bold", color: "#00a45a" }}>Input:</span> {input.variableName} = {input.variableValue}
                                            </div>
                                        ))}

                                        <br />
                                        <span style={{ fontWeight: "bold", color: "#00a45a" }}>Output:</span> {tc.expectedOutput}
                                        <br />
                                        <span style={{ fontWeight: "bold", color: "#00a45a" }}>Explanation:</span> {tc.explanation}
                                    </div>
                                ))}
                                <Collapse defaultActiveKey={['1']} accordion>
                                    <Panel header="Hint" key="1">
                                        {problem.hint}
                                    </Panel>
                                    <Panel header="Companies" key="2">
                                        {problem.companies.map((tag) => (
                                            <Tag color="blue" key={tag.id}>
                                                {tag.name}
                                            </Tag>
                                        ))}

                                    </Panel>
                                    <Panel header="Topics" key="3">
                                        {problem.tags.map((tag) => (
                                            <Tag color="blue" key={tag.id}>
                                                {tag.name}
                                            </Tag>
                                        ))}      </Panel>
                                </Collapse>
                                <div style={{ marginTop: 24 }}>
                                    <Divider orientation="left">🧪 New Test</Divider>

                                    {inputs.map((input, index) => (
                                        <div key={index} style={{ marginBottom: '10px' }}>
                                            <label>{input.name} : </label>
                                            <Input
                                                value={input.value}
                                                style={{ width: '80%' }}
                                                onChange={(e) => handleChanges(index, e.target.value)}
                                                placeholder={`Nhập giá trị cho ${input.name}`}
                                            />
                                        </div>
                                    ))}

                                    <Button type="primary" loading={loading} onClick={handleRun}>
                                        Run
                                    </Button>

                                    {error && (
                                        <Alert
                                            message="Error"
                                            description={error}
                                            type="error"
                                            showIcon
                                            style={{ marginTop: 16 }}
                                        />
                                    )}

                                    {result && (
                                        <div style={{ marginTop: 16 }}>
                                            <Divider orientation="left">🧾 Output</Divider>
                                            <p><b>Output:</b> {result.actualOutput}</p>
                                            <p><b>Exit Code:</b> {result.exitCode}</p>
                                            {result.error && <p><b>Error:</b> {result.error}</p>}
                                            <p><b>Time:</b> {result.timeUsed}s</p>
                                            <p><b>Memory:</b> {result.memoryUsed} MB</p>
                                        </div>
                                    )}
                                </div>


                            </Typography.Title>
                        </Splitter.Panel>

                        <Splitter.Panel defaultSize="50%" min="20%" max="70%">
                            {/* <Typography.Title
                                type="secondary"
                                level={5}
                                style={{ whiteSpace: 'nowrap', overflowY: 'hidden', marginBottom: 8 }}
                            >
                                Your Title Here
                            </Typography.Title>

                            <div style={{ flexGrow: 1, height: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                                <Editor
                                    language={language}
                                    value={code[language]}
                                    onChange={onCodeChange}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        wordWrap: 'on',
                                        minimap: { enabled: false },
                                        automaticLayout: true, // thử false nếu lỗi nặng
                                    }}
                                    height="100%"
                                    width="100%"
                                />
                            </div> */}

                            {/* <div style={{ width: '160px', height: '28px', overflow: 'hidden' }}>
                                <Tag
                                    value="Editor"
                                    severity="success"
                                    style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                                />
                                <Dropdown
                                    value={language}
                                    options={languageOptions}
                                    onChange={(e) => setLanguage(e.value)}
                                    placeholder="Lang"
                                    style={{
                                    height: '26px',
                                    fontSize: '0.75rem',
                                    padding: '0 6px',
                                    }}
                                />
                                </div> */}


                            {/* <Editor
                                language={language}
                                value={code[language]}
                                onChange={onCodeChange}
                                theme="vs-dark"
                                options={{
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    minimap: { enabled: false },
                                    automaticLayout: true, // thử false nếu lỗi nặng
                                }}
                                height="80%"
                                width="100%"
                            /> */}

                            <Flex gap="small" align="center">
                                <Select
                                    value={language}
                                    onChange={(value) => setLanguage(value)}
                                    placeholder="Lang"
                                    style={{
                                        height: '4vh',
                                        fontSize: '0.75rem',
                                        padding: '0 6px',
                                        width: 120,
                                    }}
                                    size="small"
                                >
                                    {languageOptions.map((lang) => (
                                        <Option key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </Option>
                                    ))}
                                </Select>

                                <Button
                                    size="small"
                                    type="default"
                                    loading={isRunning} // antd hỗ trợ prop loading
                                    onClick={handleRuns}
                                >
                                    {isRunning ? 'Đang chạy...' : 'Run'}
                                </Button>
                            </Flex>
                            <Editor
                                language={language}
                                value={code[language] || ''}
                                onChange={onCodeChange}
                                theme=""
                                options={{
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                }}
                                height="200vh"
                                width="100%"
                            />
                            <p>{language}</p>
                            <p>{selectedLanguageId}</p>
                        </Splitter.Panel>


                    </Splitter>
                </Splitter.Panel>

                <Splitter.Panel>
                    <Typography.Title
                        type="secondary"
                        level={5}
                        style={{ whiteSpace: 'nowrap', overflowY: 'auto' }}
                    >
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <TabPane tab="Testcase Code" key="1">
                                <Card title="Test Cases" size="small" bordered style={{ maxWidth: "100%" }}>
                                    <Tabs
                                        activeKey={activeKey}
                                        onChange={setActiveKey}
                                        type="card"
                                        size="small"
                                        tabBarGutter={8}
                                    >
                                        {results.map((test, index) => {
                                            const isFail = test.pass === false;

                                            return (
                                                <Tabs.TabPane
                                                    key={index.toString()}
                                                    tab={
                                                        <span
                                                            style={{
                                                                color: isFail ? '#ff4d4f' : undefined,
                                                                fontWeight: isFail ? 'bold' : undefined,
                                                            }}
                                                        >
                                                            {`Test ${index + 1}`}
                                                        </span>
                                                    }
                                                >
                                                    <Descriptions
                                                        size="small"
                                                        column={1}
                                                        bordered
                                                        labelStyle={{ width: '100px' }}
                                                    >
                                                        {(Array.isArray(test.details) ? test.details : []).map((detail, i) => (
                                                            <Descriptions.Item key={i} label={detail.variableName}>
                                                                <Typography.Text code>{detail.variableValue}</Typography.Text>
                                                            </Descriptions.Item>
                                                        ))}

                                                        <Descriptions.Item label="Expected">
                                                            <Typography.Text code>{test.expectedOutput}</Typography.Text>
                                                        </Descriptions.Item>

                                                        <Descriptions.Item label="Actual">
                                                            <Typography.Text code>{test.actualOutput}</Typography.Text>
                                                        </Descriptions.Item>

                                                        <Descriptions.Item label="Pass">
                                                            <Typography.Text type={test.pass ? 'success' : 'danger'}>
                                                                {test.pass ? '✔ Passed' : '✘ Failed'}
                                                            </Typography.Text>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Tabs.TabPane>
                                            );
                                        })}
                                    </Tabs>
                                </Card>

                            </TabPane>
                             {/* <TabPane tab="Tab 2" key="2">
                                <pre>{JSON.stringify(problem, null, 2)}</pre>
                                <pre>{JSON.stringify(requestPayload, null, 2)}</pre>

                                <pre>{JSON.stringify(inputs, null, 2)}</pre>
                                <pre>{JSON.stringify(payload, null, 2)}</pre>
                                <pre>{JSON.stringify(comments, null, 2)}</pre>



                            </TabPane>  */}
                            {/* <TabPane tab="Comment" key="3">
                                <div style={{ maxWidth: 800, marginTop: 32 }}>
                                    <h3>Bình luận</h3>
                                    <List
                                        dataSource={comments}
                                        bordered
                                        locale={{ emptyText: "Chưa có bình luận nào" }}
                                        renderItem={(item) => (
                                            <List.Item
                                                actions={
                                                    editingId === item.id
                                                        ? [
                                                            <Button type="link" onClick={() => handleUpdateComment(item.id)}>Lưu</Button>,
                                                            <Button type="link" onClick={handleCancelEdit}>Hủy</Button>,
                                                        ]
                                                        : [
                                                            <Button type="link" onClick={() => handleEdit(item.id, item.content)}>Sửa</Button>,
                                                            <Popconfirm
                                                                title="Xóa bình luận này?"
                                                                onConfirm={() => handleDeleteComment(item.id)}
                                                            >
                                                                <Button type="link" danger>Xóa</Button>
                                                            </Popconfirm>,
                                                        ]
                                                }
                                            >
                                                {editingId === item.id ? (
                                                    <TextArea
                                                        rows={2}
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                    />
                                                ) : (
                                                    <span>{item.content}</span>
                                                )}
                                            </List.Item>
                                        )}
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <TextArea
                                            rows={2}
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            placeholder="Viết bình luận..."
                                        />
                                        <Button
                                            type="primary"
                                            onClick={handleAddComment}
                                            style={{ marginTop: 8 }}
                                            disabled={!commentInput.trim()}
                                        >
                                            Thêm bình luận
                                        </Button>
                                    </div>
                                </div>
                            </TabPane> */}
                        </Tabs>
                    </Typography.Title>
                </Splitter.Panel>
            </Splitter>

        </>
    )
}
