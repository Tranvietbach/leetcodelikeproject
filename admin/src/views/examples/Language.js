import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function LanguageCrud() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ id: null, name: "" });
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
  // Load all languages
  const fetchLanguages = () => {
    setLoading(true);
    axios
      .get("http://localhost:2109/api/admin/language", {
        headers: { Authorization: token },
      })
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: "Error", detail: err.response?.data?.message || err.message });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const openNew = () => {
    setCurrentLanguage({ id: null, name: "" });
    setIsEdit(false);
    setDialogVisible(true);
  };

  const openEdit = (lang) => {
    setCurrentLanguage(lang);
    setIsEdit(true);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const saveLanguage = () => {
    if (!currentLanguage.name.trim()) {
      toast.current.show({ severity: "warn", summary: "Warning", detail: "Tên không được để trống" });
      return;
    }

    if (isEdit) {
      // Update
      axios
        .put(`http://localhost:2109/api/admin/language/${currentLanguage.id}`, currentLanguage, {
          headers: { Authorization: token },
        })
        .then(() => {
          toast.current.show({ severity: "success", summary: "Success", detail: "Cập nhật thành công" });
          fetchLanguages();
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({ severity: "error", summary: "Error", detail: err.response?.data?.message || err.message });
        });
    } else {
      // Create
      axios
        .post("http://localhost:2109/api/admin/language", currentLanguage, {
          headers: { Authorization: token },
        })
        .then(() => {
          toast.current.show({ severity: "success", summary: "Success", detail: "Tạo thành công" });
          fetchLanguages();
          hideDialog();
        })
        .catch((err) => {
          toast.current.show({ severity: "error", summary: "Error", detail: err.response?.data?.message || err.message });
        });
    }
  };

  const deleteLanguage = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa Language này?")) {
      axios
        .delete(`http://localhost:2109/api/admin/language/${id}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          toast.current.show({ severity: "success", summary: "Success", detail: "Xóa thành công" });
          fetchLanguages();
        })
        .catch((err) => {
          toast.current.show({ severity: "error", summary: "Error", detail: err.response?.data?.message || err.message });
        });
    }
  };

  const dialogFooter = (
    <>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={saveLanguage} />
    </>
  );

  return (
    <div className="p-m-4">
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
      <Toast ref={toast} />
      <div className="p-mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Quản lý Language</h3>
        <Button label="Thêm Language" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={languages} loading={loading} paginator rows={10} dataKey="id" responsiveLayout="scroll" emptyMessage="Không có dữ liệu">
        <Column field="id" header="ID" style={{ width: "80px" }} />
        <Column field="name" header="Tên Language" />
        <Column
          header="Thao tác"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEdit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteLanguage(rowData.id)} />
            </>
          )}
          style={{ minWidth: "150px" }}
        />
      </DataTable>

      <Dialog visible={dialogVisible} style={{ width: "400px" }} header={isEdit ? "Sửa Language" : "Thêm Language"} modal footer={dialogFooter} onHide={hideDialog}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Tên Language*</label>
            <InputText id="name" value={currentLanguage.name} onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })} required autoFocus />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
