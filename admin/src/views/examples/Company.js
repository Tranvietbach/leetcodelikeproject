import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import axios from "axios";
import Header from "components/Headers/Header.js";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({ name: "", description: "", problemIds: [] });
  const [problems, setProblems] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const toast = useRef(null);

  const token = localStorage.getItem("tokenAdmin"); // Hoặc lấy token phù hợp


          axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
            .then((response) => {
            })
            .catch(() => {
                alert("hết hạn đăng nhập, vui lòng đăng nhập lại");
                localStorage.removeItem("tokenAdmin");
                window.location.href = "/auth/login"; // Chuyển hướng về trang đăng nhập
            });
  // Load all companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:2109/api/admin/company", {
        headers: { Authorization: token },
      });
      setCompanies(res.data);
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Lỗi tải company", detail: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Load problems for MultiSelect
  const fetchProblems = async () => {
    try {
      const res = await axios.get("http://localhost:2109/api/admin/company/problems", {
        headers: { Authorization: token },
      });
      setProblems(res.data);
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Lỗi tải problem", detail: error.message });
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchProblems();
  }, []);

  // Open dialog for create new company
  const openNew = () => {
    setCurrentCompany({ name: "", description: "", problemIds: [] });
    setIsEdit(false);
    setDialogVisible(true);
  };

  // Open dialog for edit company
  const openEdit = (company) => {
    setCurrentCompany({
      id: company.id,
      name: company.name,
      description: company.description,
      problemIds: company.problemIds || [],
    });
    setIsEdit(true);
    setDialogVisible(true);
  };

  // Save company (create or update)
  const saveCompany = async () => {
    if (!currentCompany.name.trim()) {
      toast.current.show({ severity: "warn", summary: "Tên Company không được để trống" });
      return;
    }

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:2109/api/admin/company/${currentCompany.id}`,
          currentCompany,
          { headers: { Authorization: token } }
        );
        toast.current.show({ severity: "success", summary: "Cập nhật thành công" });
      } else {
        await axios.post(
          "http://localhost:2109/api/admin/company",
          currentCompany,
          { headers: { Authorization: token } }
        );
        toast.current.show({ severity: "success", summary: "Tạo mới thành công" });
      }
      setDialogVisible(false);
      fetchCompanies();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi lưu company",
        detail: error.response?.data?.message || error.message,
      });
    }
  };

  // Delete company
  const deleteCompany = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa company này?")) return;
    try {
      await axios.delete(`http://localhost:2109/api/admin/company/${id}`, {
        headers: { Authorization: token },
      });
      toast.current.show({ severity: "success", summary: "Đã xóa company" });
      fetchCompanies();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi xóa company",
        detail: error.response?.data?.message || error.message,
      });
    }
  };

  // Filter companies theo search name
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const dialogFooter = (
    <>
      <Button label="Hủy" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
      <Button label="Lưu" icon="pi pi-check" onClick={saveCompany} autoFocus />
    </>
  );

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
      <h3>Quản lý Company</h3>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
        <InputText
          placeholder="Tìm kiếm công ty"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
          className="p-inputtext-sm"
        />
        <Button label="Thêm Company" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable
        value={filteredCompanies}
        paginator
        rows={10}
        loading={loading}
        dataKey="id"
        emptyMessage="Không có dữ liệu"
      >
        <Column field="id" header="ID" style={{ width: "80px" }} />
        <Column field="name" header="Tên công ty" sortable />
        <Column field="description" header="Mô tả" />
<Column
  header="Problems"
  body={(row) => {
    if (!row.problems || row.problems.length === 0) return "";
    return row.problems.map(p => p.title).join(", ");
  }}
/>
        <Column
          header="Hành động"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteCompany(rowData.id)} />
            </>
          )}
          style={{ minWidth: 150 }}
        />
      </DataTable>

      <Dialog header={isEdit ? "Sửa Company" : "Thêm Company"} visible={dialogVisible} style={{ width: 500 }} modal footer={dialogFooter} onHide={() => setDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Tên Company*</label>
            <InputText
              id="name"
              value={currentCompany.name}
              onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="p-field">
            <label htmlFor="description">Mô tả</label>
            <InputText
              id="description"
              value={currentCompany.description}
              onChange={(e) => setCurrentCompany({ ...currentCompany, description: e.target.value })}
            />
          </div>

          <div className="p-field">
            <label>Problems (Chọn nhiều)</label>
            <MultiSelect
              value={currentCompany.problemIds}
              options={problems}
              onChange={(e) => setCurrentCompany({ ...currentCompany, problemIds: e.value })}
              optionLabel="title"
              optionValue="id"
              placeholder="Chọn problems"
              display="chip"
              filter
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
