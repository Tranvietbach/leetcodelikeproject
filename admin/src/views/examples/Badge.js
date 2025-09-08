import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import Header from "components/Headers/Header.js";

export default function BadgeManager() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBadge, setCurrentBadge] = useState({ name: "", description: "" });

  const toast = useRef(null);

  const token = localStorage.getItem("tokenAdmin"); // Hoặc lấy token phù hợp


          axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
            .then((response) => {
                alert("Token hợp lệ, userId: " + response.data.id);
            })
            .catch(() => {
                alert("Token không hợp lệ, đã đăng xuất");
                localStorage.removeItem("tokenAdmin");
                window.location.href = "/auth/login"; // Chuyển hướng về trang đăng nhập
            });
  const axiosInstance = axios.create({
    baseURL: "http://localhost:2109/api/admin/",
    headers: { Authorization: token },
  });

  // Load badges
  const fetchBadges = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/badge");
      setBadges(res.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  // Mở dialog thêm mới
  const openNew = () => {
    setCurrentBadge({ name: "", description: "" });
    setIsEdit(false);
    setDialogVisible(true);
  };

  // Mở dialog sửa
  const editBadge = (badge) => {
    setCurrentBadge(badge);
    setIsEdit(true);
    setDialogVisible(true);
  };

  // Xóa badge
  const deleteBadge = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa badge này?")) return;
    try {
      await axiosInstance.delete(`/badge/${id}`);
      toast.current.show({ severity: "success", summary: "Thành công", detail: "Đã xóa badge" });
      fetchBadges();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || error.message,
      });
    }
  };

  // Lưu badge (thêm hoặc sửa)
  const saveBadge = async () => {
    if (!currentBadge.name.trim()) {
      toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Tên badge không được để trống" });
      return;
    }
    try {
      if (isEdit) {
        await axiosInstance.put(`/badge/${currentBadge.id}`, currentBadge);
      } else {
        await axiosInstance.post("/badge", currentBadge);
      }
      toast.current.show({ severity: "success", summary: "Thành công", detail: "Đã lưu badge" });
      setDialogVisible(false);
      fetchBadges();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: error.response?.data?.message || error.message,
      });
    }
  };

  const dialogFooter = (
    <>
      <Button label="Hủy" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
      <Button label="Lưu" icon="pi pi-check" onClick={saveBadge} autoFocus />
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
      <div className="p-mt-4 p-mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý Badges</h2>
        <Button label="Thêm Badge" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable
        value={badges}
        loading={loading}
        paginator
        rows={10}
        dataKey="id"
        emptyMessage="Không có dữ liệu"
      >
        <Column field="id" header="ID" style={{ width: "80px" }} />
        <Column field="name" header="Tên Badge" sortable />
        <Column field="description" header="Mô tả" />
        <Column
          header="Thao tác"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => editBadge(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteBadge(rowData.id)}
              />
            </>
          )}
          style={{ minWidth: "150px" }}
        />
      </DataTable>

      <Dialog
        header={isEdit ? "Sửa Badge" : "Thêm Badge"}
        visible={dialogVisible}
        style={{ width: "400px" }}
        modal
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Tên Badge*</label>
            <InputText
              id="name"
              value={currentBadge.name}
              onChange={(e) => setCurrentBadge({ ...currentBadge, name: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="p-field">
            <label htmlFor="description">Mô tả</label>
            <InputText
              id="description"
              value={currentBadge.description}
              onChange={(e) => setCurrentBadge({ ...currentBadge, description: e.target.value })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
