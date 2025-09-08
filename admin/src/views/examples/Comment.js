import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import Header from "components/Headers/Header.js";

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const token = localStorage.getItem("tokenAdmin"); // Hoặc lấy token phù hợp


          axios.post(`http://localhost:2109/api/extract-user-id?token=${token}`)
            .then((response) => {
                // alert("Token hợp lệ, userId: " + response.data.id);
            })
            .catch(() => {
                alert("hết hạn đăng nhập, vui lòng đăng nhập lại");
                localStorage.removeItem("tokenAdmin");
                window.location.href = "/auth/login"; // Chuyển hướng về trang đăng nhập
            });
  // Fetch all comments (no search param)
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:2109/api/admin/comments", {
        headers: { Authorization: token },
      });
      setComments(res.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi tải comment",
        detail: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Xóa comment
  const deleteComment = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa comment này?")) return;

    try {
      await axios.delete(`http://localhost:2109/api/admin/comment/${id}`, {
        headers: { Authorization: token },
      });
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa comment",
      });
      // Reload comment sau khi xóa
      fetchComments();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi xóa comment",
        detail: error.response?.data?.message || error.message,
      });
    }
  };

  // Filter comments trên client: tìm theo nội dung hoặc user
  const filteredComments = comments.filter(
    (c) =>
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.user.toLowerCase().includes(search.toLowerCase())
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
      <h3>Quản lý Comment</h3>
      <div style={{ marginBottom: 12 }}>
        <InputText
          placeholder="Tìm kiếm theo nội dung hoặc user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <DataTable
        value={filteredComments}
        paginator
        rows={10}
        loading={loading}
        dataKey="id"
        emptyMessage="Không có comment"
      >
        <Column field="id" header="ID" style={{ width: "80px" }} />
        <Column field="content" header="Nội dung" />
        <Column field="user" header="User" style={{ width: "150px" }} />
        <Column
          field="createdAt"
          header="Ngày tạo"
          style={{ width: "180px" }}
          body={(row) =>
            new Date(row.createdAt).toLocaleString("vi-VN", {
              hour12: false,
            })
          }
        />
        <Column
          header="Hành động"
          style={{ width: "150px" }}
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-rounded"
              onClick={() => deleteComment(rowData.id)}
              tooltip="Xóa comment"
            />
          )}
        />
      </DataTable>
    </div>
  );
}
