import React, { useEffect, useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from "primereact/toast";
import axios from "axios";
import Header from "components/Headers/Header.js";
import Editor from "@monaco-editor/react";

export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [showTestcaseDialog, setShowTestcaseDialog] = useState(false);
    const [editingTestcase, setEditingTestcase] = useState(null);
    // form create
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [premiums, setPremiums] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedPremiums, setSelectedPremiums] = useState([]);
    const [testcases, setTestcases] = useState([]);
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [hint, setHint] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [availablecode, setAvailablecode] = useState(`def hello():\n    print("hi")`);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProblemId, setEditingProblemId] = useState(1);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [editingDetailIndex, setEditingDetailIndex] = useState(null);
    const [editingDetail, setEditingDetail] = useState(null);
    const [problemLanguagePy, setProblemLanguagePy] = useState(`def hello():\n    print("Hi Python")`);
    const [problemLanguageJa, setProblemLanguageJa] = useState(`public class Hello { public static void main(String[] args) { System.out.println("Hi Java"); } }`);
    const [problemLanguageJs, setProblemLanguageJs] = useState(`function hello() { console.log("Hi JS"); }`);
    const token = localStorage.getItem("tokenAdmin"); // Hoặc lấy token phù hợp
    const editorRef = useRef(null);
    const pyRef = useRef(null);
    const jaRef = useRef(null);
    const jsRef = useRef(null);
    const handleMount = (editorRef, setCode) => (editor, monaco) => {
        editorRef.current = editor;

        // Tự động format khi gõ (JS/TS/Java hỗ trợ; Python cần external formatter)
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            setCode(value);

            try {
                // Chỉ JS/TS/Java hỗ trợ built-in format
                editor.getAction("editor.action.formatDocument").run();
            } catch (err) {
                // Python không format được sẵn
            }
        });
    };

    axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
        .then((response) => {
        })
        .catch(() => {
            alert("Token không hợp lệ, đã đăng xuất");
            localStorage.removeItem("tokenAdmin");
            window.location.href = "/auth/login"; // Chuyển hướng về trang đăng nhập
        });

    const openEditDialog = (problem) => {

        fetchSelectData();

        setIsEditing(true);
        setEditingProblemId(problem.id);  // lưu id cho API PUT

        setTitle(problem.title || "");
        setSlug(problem.slug || "");
        setDescription(problem.description || "");
        setHint(problem.hint || "");
        setDifficulty(problem.difficulty || null);
        setIsActive(problem.isActive || true);
        setAvailablecode(problem.availablecode || "");

        setSelectedTags(problem.tagIds || []);
        setSelectedCompanies(problem.companyIds || []);
        setSelectedPremiums(problem.premiumIds || []);
        setTestcases(problem.testcases || []);
        setProblemLanguagePy(problem.problemLanguagePy || "");
        setProblemLanguageJa(problem.problemLanguageJa || "");
        setProblemLanguageJs(problem.problemLanguageJs || "");

        setShowDialog(true);
    };

    const handleSaveProblem = async () => {
        try {
            const token = localStorage.getItem("tokenAdmin");
            const payload = {
                title,
                slug,
                description,
                hint,
                difficulty,
                isActive,
                availablecode,
                tagIds: selectedTags.map(t => ({ id: t.id, name: t.name })),
                companyIds: selectedCompanies.map(c => ({ id: c.id, name: c.name })),
                premiumIds: selectedPremiums.map(p => ({ id: p.id, name: p.name })),
                testcases,
                problemLanguageJs,
                problemLanguageJa,
                problemLanguagePy
            };

            if (isEditing && editingProblemId) {
                // gọi PUT cập nhật problem
                await axios.put(`http://localhost:2109/api/admin/problems/problems/${editingProblemId}`, payload, {
                    headers: { Authorization: token }
                });
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Cập nhật Problem thành công" });
            } else {
                // gọi POST tạo mới problem
                await axios.post("http://localhost:2109/api/admin/problems", payload, {
                    headers: { Authorization: token }
                });
                toast.current.show({ severity: "success", summary: "Thành công", detail: "Tạo Problem thành công" });
            }

            setShowDialog(false);
            fetchProblems();

        } catch (error) {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: isEditing ? "Không cập nhật được Problem" : "Không tạo được Problem" });
        }
    };

    const openCreateDialog = () => {
        fetchSelectData();

        setIsEditing(false);
        setEditingProblemId(null);

        setTitle("");
        setSlug("");
        setDescription("");
        setHint("");
        setDifficulty(null);
        setIsActive(true);
        setAvailablecode("");

        setSelectedTags([]);
        setSelectedCompanies([]);
        setSelectedPremiums([]);
        setTestcases([]);
        setProblemLanguagePy("");
        setProblemLanguageJa("");
        setProblemLanguageJs("");
        setShowDialog(true);
    };


    // Hàm mở dialog detail
    const openDetailDialog = (detail, index) => {
        setEditingDetail(detail || { variableName: "", variableValue: "", typeInput: 0 });
        setEditingDetailIndex(index);
        setShowDetailDialog(true);
    };

    // Hàm lưu detail
    const saveDetail = (detail) => {
        let newDetails = [...editingTestcase.details];
        if (editingDetailIndex !== null && editingDetailIndex !== undefined) {
            newDetails[editingDetailIndex] = detail;
        } else {
            newDetails.push(detail);
        }
        setEditingTestcase({ ...editingTestcase, details: newDetails });
        setShowDetailDialog(false);
        setEditingDetail(null);
        setEditingDetailIndex(null);
    };
    const addTestcase = () => {
        setEditingTestcase({
            expectedOutput: "",
            isPublic: false,
            details: []
        });
        setShowTestcaseDialog(true);
    };

    const editTestcase = (tc, index) => {
        setEditingTestcase({ ...tc, index });
        setShowTestcaseDialog(true);
    };
    const saveTestcase = () => {
        let updatedList = [...testcases];
        if (editingTestcase.index !== undefined) {
            updatedList[editingTestcase.index] = { ...editingTestcase };
        } else {
            updatedList.push({ ...editingTestcase });
        }
        setTestcases(updatedList);
        setShowTestcaseDialog(false);
        setEditingTestcase(null);
    };

    const deleteTestcase = (tc) => {
        setTestcases(testcases.filter(t => t !== tc));
    };
    const toast = useRef(null);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("tokenAdmin");
            const res = await axios.get("http://localhost:2109/api/admin/problems", {
                headers: { Authorization: token }
            });
            setProblems(res.data.data || []);
        } catch {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không tải được danh sách" });
        }
        setLoading(false);
    };

    const fetchSelectData = async () => {
        try {
            const token = localStorage.getItem("tokenAdmin");
            const [tagRes, compRes, premiumRes] = await Promise.all([
                axios.get("http://localhost:2109/api/admin/tags", { headers: { Authorization: token } }),
                axios.get("http://localhost:2109/api/admin/companies", { headers: { Authorization: token } }),
                axios.get("http://localhost:2109/api/admin/premiums", { headers: { Authorization: token } })
            ]);
            setTags(tagRes.data.data || []);
            setCompanies(compRes.data || []);
            setPremiums(premiumRes.data || []);
        } catch {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không tải được dữ liệu chọn" });
        }
    };

    const openDialog = () => {
        fetchSelectData();
        setShowDialog(true);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("tokenAdmin");
            const payload = {
                title,
                slug,
                description,
                hint,
                difficulty,
                isActive,
                availablecode,
                tagIds: selectedTags.map(t => ({ id: t.id, name: t.name })),
                companyIds: selectedCompanies.map(c => ({ id: c.id, name: c.name })),
                premiumIds: selectedPremiums.map(p => ({ id: p.id, name: p.name })),
                testcases,
                problemLanguageJs,
                problemLanguageJa,
                problemLanguagePy
            };

            await axios.post("http://localhost:2109/api/admin/problems", payload, {
                headers: { Authorization: token }
            });

            toast.current.show({ severity: "success", summary: "Thành công", detail: "Tạo Problem thành công" });
            setShowDialog(false);
            fetchProblems();
        } catch {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không tạo được Problem" });
        }
    };

    const difficultyMap = {
        "Rất dễ": 1,
        "Dễ": 2,
        "Trung bình": 3,
        "Khó": 4,
        "Rất khó": 5,
    };

    const difficultyOptions = [
        { label: "Tất cả", value: "" },
        { label: "Rất dễ", value: "Rất dễ" },
        { label: "Dễ", value: "Dễ" },
        { label: "Trung bình", value: "Trung bình" },
        { label: "Khó", value: "Khó" },
        { label: "Rất khó", value: "Rất khó" },
    ];

    const filteredProblems = problems.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());

        if (!difficultyFilter || difficultyFilter === "") {
            return titleMatch;
        }

        const difficultyNumber = difficultyMap[difficultyFilter];
        if (!difficultyNumber) return titleMatch;

        return titleMatch && p.difficulty === difficultyNumber;
    });

    const rowExpansionTemplate = (problem) => (
        <div className="p-3">
            <h5>Testcases</h5>
            {problem.testcases?.map((tc, idx) => (
                <div key={idx} className="p-2 border-round surface-100 mb-2">
                    <p><b>Expected Output:</b> {tc.expectedOutput}</p>
                    <p><b>Public:</b> {tc.isPublic ? "Yes" : "No"}</p>
                    <h6>Details:</h6>
                    {tc.details?.map((d, j) => (
                        <div key={j} style={{ marginLeft: "1rem" }}>
                            <p>- <b>Name:</b> {d.variableName} | <b>Value:</b> {d.variableValue} | <b>Type:</b> {d.typeInput}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    const handleDeactivate = async (problemId) => {
        try {
            // Giả sử bạn có token lưu trong localStorage
            const token = localStorage.getItem('tokenAdmin');

            await axios.put(`http://localhost:2109/api/admin/problems/problems/${problemId}/deactivate`, null, {
                headers: { Authorization: token }
            });
            const res = await axios.get("http://localhost:2109/api/admin/problems", {
                headers: { Authorization: token }
            });
            setProblems(res.data.data || []);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Problem đã được deactivate' });

            // Load lại data hoặc update state để cập nhật UI
            // loadProblems();  // Hàm tải lại danh sách problem (bạn tự implement)

        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.message || error.message });
        }
    };
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Lắng nghe khi nội dung thay đổi
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            setAvailablecode(value); // cập nhật state

            // Format code ngay lập tức
            editor.getAction("editor.action.formatDocument").run();
        });
    };
    return (
        <div>
            <div
                style={{
                    position: "fixed",      // luôn cố định
                    bottom: "20px",         // cách dưới 20px
                    right: "20px",          // cách phải 20px
                    zIndex: 1000,           // luôn nổi trên UI
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#4696ecff", // màu quốc kỳ Ukraine xanh
                    color: "#ffd700",           // vàng của Ukraine
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
                Primedev supports Ukraine
            </div>
            <Header />

            <Toast ref={toast} />
            <h3>Danh sách Problems</h3>
            <div style={{ gap: '10px' }} className="mb-3 flex justify-content-between">
                <span style={{ gap: '10px' }} className="p-input-icon-left">
                    <InputText style={{ marginRight: '10px' }} placeholder="Tìm theo tiêu đề" value={search} onChange={e => setSearch(e.target.value)} />

                    <Dropdown
                        style={{ marginRight: '10px' }}
                        value={difficultyFilter}
                        onChange={e => setDifficultyFilter(e.value)}
                        options={[
                            { label: 'Tất cả', value: '' },
                            { label: 'Rất dễ', value: 'Rất dễ' },
                            { label: 'Dễ', value: 'Dễ' },
                            { label: 'Trung bình', value: 'Trung bình' },
                            { label: 'Khó', value: 'Khó' },
                            { label: 'Rất khó', value: 'Rất khó' },
                        ]}
                        placeholder="Chọn độ khó"
                    />           </span>
                <Button label="Thêm mới" icon="pi pi-plus" onClick={openCreateDialog} />
            </div>

            <DataTable
                value={filteredProblems}
                paginator
                rows={10}
                loading={loading}
                dataKey="id"
            // rowExpansionTemplate={rowExpansionTemplate} // nếu có thì để lại
            >
                <Column field="title" header="Tiêu đề" />
                <Column field="slug" header="Slug" />
                <Column field="difficulty" header="Độ khó" />
                <Column
                    header="Tags"
                    body={(row) => row.tagIds?.map((t) => t.name).join(", ")}
                />
                <Column
                    header="Companies"
                    body={(row) => row.companyIds?.map((c) => c.name).join(", ")}
                />
                <Column
                    header="Premiums"
                    body={(row) => row.premiumIds?.map((p) => p.name).join(", ")}
                />
                <Column
                    header="Hành động"
                    body={(rowData) => (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Button
                                label="Sửa"
                                icon="pi pi-pencil"
                                onClick={() => openEditDialog(rowData)}
                            />
                            <Button
                                label="Xóa"
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => handleDeactivate(rowData.id)}
                            />
                        </div>
                    )}
                />
            </DataTable>
            {/* <pre>{JSON.stringify({
                title,
                slug,
                description,
                hint,
                difficulty,
                isActive,
                availablecode,
                tagIds: selectedTags.map(t => ({ id: t.id, name: t.name })),
                companyIds: selectedCompanies.map(c => ({ id: c.id, name: c.name })),
                premiumIds: selectedPremiums.map(p => ({ id: p.id, name: p.name })),
                testcases // giữ nguyên, vì đã đủ định dạng
            }, null, 2)}</pre> */}
            {editingProblemId}

            {/* Dialog tạo problem */}
            <Dialog
                header={isEditing ? "Cập nhật Problem" : "Tạo Problem mới"}
                visible={showDialog}
                style={{ width: "60vw" }}
                onHide={() => setShowDialog(false)}
            >                <div className="p-fluid">
                    <div className="p-field">
                        <label>Tiêu đề</label>
                        <InputText value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label>Slug</label>
                        <InputText value={slug} onChange={(e) => setSlug(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label>Mô tả</label>
                        <InputTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label>Hint</label>
                        <InputTextarea rows={3} value={hint} onChange={(e) => setHint(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label>Độ khó</label>
                        <Dropdown
                            value={difficulty}
                            options={[
                                { label: "Rất Dễ", value: 1 },

                                { label: "Dễ", value: 2 },
                                { label: "Trung bình", value: 3 },
                                { label: "Khó", value: 4 }
                                , { label: "Rất khó", value: 5 }

                            ]}
                            onChange={(e) => setDifficulty(e.value)}
                            placeholder="Chọn độ khó"
                        />
                    </div>
                    {/* <div className="p-field">
                        <label>Kích hoạt?</label>
                        <Checkbox checked={isActive} onChange={(e) => setIsActive(e.checked)} />
                    </div> */}
                    <div className="p-field">
                        <label>Available Code</label>
                        <Editor
                            height="300px"
                            defaultLanguage="python"

                            theme="vs-dark" value={availablecode}
                            onMount={handleEditorDidMount}
                            options={{
                                automaticLayout: true,
                                minimap: { enabled: false },
                            }}
                        />                    </div>

                    {/* Tags */}
                    <div className="p-field">
                        <label>Tags</label>
                        <MultiSelect value={selectedTags} options={tags} optionLabel="name" onChange={(e) => setSelectedTags(e.value)} placeholder="Chọn Tags" />
                    </div>

                    {/* Companies */}
                    <div className="p-field">
                        <label>Companies</label>
                        <MultiSelect value={selectedCompanies} options={companies} optionLabel="name" onChange={(e) => setSelectedCompanies(e.value)} placeholder="Chọn Companies" />
                    </div>

                    {/* Premiums */}
                    <div className="p-field">
                        <label>Premiums</label>
                        <MultiSelect value={selectedPremiums} options={premiums} optionLabel="name" onChange={(e) => setSelectedPremiums(e.value)} placeholder="Chọn Premiums" />
                    </div>
                    <div className="p-field">
                        <label>Code mẫu Python</label>
                        <Editor
                            height="200px"
                            defaultLanguage="python"
                            value={problemLanguagePy}
                            onMount={handleMount(pyRef, setProblemLanguagePy)}
                            theme="vs-dark"
                            options={{ automaticLayout: true, minimap: { enabled: false }, tabSize: 4 }}
                        />
                    </div>

                    <div className="p-field">
                        <label>Code mẫu Java</label>
                        <Editor
                            height="200px"
                            defaultLanguage="java"
                            value={problemLanguageJa}
                            onMount={handleMount(jaRef, setProblemLanguageJa)}
                            theme="vs-dark"
                            options={{ automaticLayout: true, minimap: { enabled: false }, tabSize: 4 }}
                        />
                    </div>

                    <div className="p-field">
                        <label>Code mẫu JavaScript</label>
                        <Editor
                            height="200px"
                            defaultLanguage="javascript"
                            value={problemLanguageJs}
                            onMount={handleMount(jsRef, setProblemLanguageJs)}
                            theme="vs-dark"
                            options={{ automaticLayout: true, minimap: { enabled: false }, tabSize: 2 }}
                        />
                    </div>

                    {/* Testcases */}
                    <div className="p-field">
                        <label>Testcases</label>
                        <Button label="Thêm testcase" onClick={addTestcase} />
                        <DataTable value={testcases}>
                            <Column field="expectedOutput" header="Expected Output" />
                            <Column field="isPublic" header="Công khai" body={(row) => row.isPublic ? "✔" : "✖"} />
                            <Column body={(rowData) => (
                                <Column body={(rowData, options) => (
                                    <Button label="Chi tiết" onClick={() => editTestcase(rowData, options.rowIndex)} />
                                )} />)} />
                            <Column body={(rowData) => (
                                <Button label="Xóa" className="p-button-danger" onClick={() => deleteTestcase(rowData)} />
                            )} />
                        </DataTable>
                    </div>
                </div>

                <div className="flex justify-content-end mt-3">
                    <div className="flex justify-content-end mt-3">
                        <Button label="Hủy" className="p-button-text" onClick={() => setShowDialog(false)} />
                        <Button label={isEditing ? "Cập nhật" : "Tạo"} onClick={handleSaveProblem} autoFocus />
                    </div>                </div>
            </Dialog>
            <Dialog header="Testcase" visible={showTestcaseDialog} style={{ width: '40vw' }} onHide={() => setShowTestcaseDialog(false)}>
                {editingTestcase && (
                    <div className="p-fluid">
                        <div className="p-field">
                            <label>Expected Output</label>
                            <InputText value={editingTestcase.expectedOutput} onChange={(e) => setEditingTestcase({ ...editingTestcase, expectedOutput: e.target.value })} />
                        </div>
                        <div className="p-field">
                            <Checkbox inputId="isPublic" checked={editingTestcase.isPublic}
                                onChange={(e) => setEditingTestcase({ ...editingTestcase, isPublic: e.checked })} />
                            <label htmlFor="isPublic" className="ml-2">Công khai</label>
                        </div>

                        <div className="p-field">
                            <label>Details</label>
                            <Button label="Thêm detail" onClick={() => {
                                setEditingTestcase({
                                    ...editingTestcase,
                                    details: [...editingTestcase.details, { id: Date.now(), variableName: "", variableValue: "", typeInput: 0 }]
                                });
                            }} />
                            <DataTable value={editingTestcase.details}>
                                <Column field="variableName" header="Tên biến" />
                                <Column field="variableValue" header="Giá trị" />
                                <Column
                                    field="typeInput"
                                    header="Kiểu"
                                    body={(rowData) => {
                                        const mapType = { 0: "Số", 1: "Chuỗi", 2: "Boolean" };
                                        return mapType[rowData.typeInput] || "Unknown";
                                    }}
                                />
                                <Column
                                    body={(rowData, { rowIndex }) => (
                                        <>
                                            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => openDetailDialog(rowData, rowIndex)} />
                                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm ml-2" onClick={() => {
                                                let newDetails = [...editingTestcase.details];
                                                newDetails.splice(rowIndex, 1);
                                                setEditingTestcase({ ...editingTestcase, details: newDetails });
                                            }} />
                                        </>
                                    )}
                                />
                            </DataTable>

                        </div>

                        <div className="flex justify-content-end mt-3">
                            <Button label="Hủy" className="p-button-text" onClick={() => setShowTestcaseDialog(false)} />
                            <Button label="Lưu" onClick={saveTestcase} autoFocus />
                        </div>
                    </div>
                )}
            </Dialog>

            <Dialog header="Chi tiết biến Testcase" visible={showDetailDialog} onHide={() => setShowDetailDialog(false)} style={{ width: "30vw" }}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label>Tên biến</label>
                        <InputText value={editingDetail?.variableName || ""} onChange={(e) => setEditingDetail({ ...editingDetail, variableName: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label>Giá trị</label>
                        <InputText value={editingDetail?.variableValue || ""} onChange={(e) => setEditingDetail({ ...editingDetail, variableValue: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label>Kiểu</label>
                        <Dropdown
                            value={editingDetail?.typeInput ?? 0}
                            options={[
                                { label: "Số", value: 0 },
                                { label: "Chuỗi", value: 1 },
                                { label: "Boolean", value: 2 },
                            ]}
                            onChange={(e) => setEditingDetail({ ...editingDetail, typeInput: e.value })}
                        />
                    </div>

                    <div className="flex justify-content-end mt-3">
                        <Button label="Hủy" className="p-button-text" onClick={() => setShowDetailDialog(false)} />
                        <Button label="Lưu" onClick={() => saveDetail(editingDetail)} />
                    </div>
                </div>
            </Dialog>
            {problemLanguageJs}
            {difficulty}

        </div>
    );
}