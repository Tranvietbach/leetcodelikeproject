import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

import Header from "components/Headers/Header.js";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTag, setCurrentTag] = useState({ id: null, name: "" });

  const [searchName, setSearchName] = useState("");
  const toast = useRef(null);
  const token = localStorage.getItem("tokenAdmin"); // Hoặc lấy token phù hợp


  axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
    .then((response) => {
      // alert("Token hợp lệ, userId: " + response.data.id);
    })
    .catch(() => {
      alert("Token không hợp lệ, đã đăng xuất");
      localStorage.removeItem("tokenAdmin");
      window.location.href = "/auth/login"; // Chuyển hướng về trang đăng nhập
    });
  // Lấy dữ liệu tags 1 lần
  const fetchTags = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("tokenAdmin");
      const res = await axios.get("http://localhost:2109/api/admin/tags", {
        headers: { Authorization: token },
      });
      const data = res.data.data || [];
      setTags(data);
      setFilteredTags(data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không tải được dữ liệu",
        life: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Filter tags theo searchName (lọc trên client)
  useEffect(() => {
    if (!searchName.trim()) {
      setFilteredTags(tags);
    } else {
      const lowerSearch = searchName.toLowerCase();
      setFilteredTags(
        tags.filter((tag) => tag.name.toLowerCase().includes(lowerSearch))
      );
    }
  }, [searchName, tags]);

  const openNew = () => {
    setIsEdit(false);
    setCurrentTag({ id: null, name: "" });
    setDialogVisible(true);
  };

  const editTag = (tag) => {
    setIsEdit(true);
    setCurrentTag({ ...tag });
    setDialogVisible(true);
  };

  const deleteTag = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Tag này?")) return;
    try {
      const token = localStorage.getItem("tokenAdmin");
      await axios.delete(`http://localhost:2109/api/admin/tags/${id}`, {
        headers: { Authorization: token },
      });
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Xóa thành công",
        life: 2000,
      });
      // Cập nhật lại danh sách sau khi xóa
      fetchTags();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Xóa thất bại",
        life: 3000,
      });
    }
  };

  const saveTag = async () => {
    const token = localStorage.getItem("tokenAdmin");
    if (!currentTag.name.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Tên tag không được để trống",
        life: 3000,
      });
      return;
    }
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:2109/api/admin/tags/${currentTag.id}`,
          currentTag,
          {
            headers: { Authorization: token },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật thành công",
          life: 2000,
        });
      } else {
        await axios.post("http://localhost:2109/api/admin/tags", currentTag, {
          headers: { Authorization: token },
        });
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Thêm mới thành công",
          life: 2000,
        });
      }
      setDialogVisible(false);
      fetchTags();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Lưu dữ liệu thất bại",
        life: 3000,
      });
    }
  };

  const dialogFooter = (
    <>
      <Button
        label="Hủy"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setDialogVisible(false)}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveTag}
      />
    </>
  );

  return (
    <>
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
      <div
        className="p-mt-4 p-mb-4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <InputText
          placeholder="Tìm kiếm theo tên"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ maxWidth: "300px" }}
          className="p-inputtext-sm"
        />
        <Button label="Thêm Tag" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable
        value={filteredTags}
        loading={loading}
        paginator
        rows={10}
        dataKey="id"
        responsiveLayout="scroll"
        emptyMessage="Không có dữ liệu"
      >
        <Column
          field="stt"
          header="STT"
          style={{ width: "80px" }}
          body={(data, options) => options.rowIndex + 1}
        />
        <Column field="name" header="Tên Tag" sortable />
        <Column
          header="Thao tác"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => editTag(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteTag(rowData.id)}
              />
            </>
          )}
          style={{ minWidth: "150px" }}
        />
      </DataTable>

      <Dialog
        header={isEdit ? "Sửa Tag" : "Thêm Tag"}
        visible={dialogVisible}
        style={{ width: "400px" }}
        modal
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Tên Tag*</label>
            <InputText
              id="name"
              value={currentTag.name}
              onChange={(e) =>
                setCurrentTag({ ...currentTag, name: e.target.value })
              }
              required
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Tags;
