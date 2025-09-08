/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import React, { useEffect, useState, useRef } from "react";
import Header from "components/Headers/Header.js";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";


const Tables = () => {
  const [premiums, setPremiums] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPremium, setCurrentPremium] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    durationDays: ""
  });

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

  // Lấy danh sách Premium từ API
  const fetchPremiums = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("tokenAdmin");
      const res = await axios.get("http://localhost:2109/api/admin/premiums", {
        headers: { Authorization: token },
      });
      setPremiums(res.data);
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không tải được dữ liệu", life: 3000 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPremiums();
  }, []);

  // Mở dialog thêm mới
  const openNew = () => {
    setIsEdit(false);
    setCurrentPremium({
      id: null,
      name: "",
      description: "",
      price: "",
      durationDays: "",
    });
    setDialogVisible(true);
  };

  // Mở dialog sửa
  const editPremium = (premium) => {
    setIsEdit(true);
    setCurrentPremium({ ...premium });
    setDialogVisible(true);
  };

  // Xóa Premium
  const deletePremium = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa Premium này?")) return;
    try {
      const token = localStorage.getItem("tokenAdmin");
      await axios.delete(`http://localhost:2109/api/admin/premiums/${id}`, {
        headers: { Authorization: token },
      });
      toast.current.show({ severity: "success", summary: "Thành công", detail: "Xóa thành công", life: 2000 });
      fetchPremiums();
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Lỗi", detail: "Xóa thất bại", life: 3000 });
    }
  };

  // Lưu (Thêm hoặc Sửa)
  const savePremium = async () => {
    const token = localStorage.getItem("tokenAdmin");
    if (!currentPremium.name || !currentPremium.price || !currentPremium.durationDays) {
      toast.current.show({ severity: "warn", summary: "Cảnh báo", detail: "Vui lòng điền đủ thông tin bắt buộc", life: 3000 });
      return;
    }
    try {
      if (isEdit) {
        // PUT update
        await axios.put(`http://localhost:2109/api/admin/premiums/${currentPremium.id}`, currentPremium, {
          headers: { Authorization: token },
        });
        toast.current.show({ severity: "success", summary: "Thành công", detail: "Cập nhật thành công", life: 2000 });
      } else {
        // POST create
        await axios.post("http://localhost:2109/api/admin/premiums", currentPremium, {
          headers: { Authorization: token },
        });
        toast.current.show({ severity: "success", summary: "Thành công", detail: "Thêm mới thành công", life: 2000 });
      }
      setDialogVisible(false);
      fetchPremiums();
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Lỗi", detail: "Lưu dữ liệu thất bại", life: 3000 });
    }
  };

  // Form dialog footer
  const dialogFooter = (
    <>
      <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={() => setDialogVisible(false)} />
      <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={savePremium} />
    </>
  );

  // Format giá tiền
  const priceBodyTemplate = (rowData) => {
    return rowData.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

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
      <div className="p-mt-4 p-mb-4" style={{ textAlign: "right" }}>
        <Button label="Thêm Premium" icon="pi pi-plus" onClick={openNew} />
      </div>
      <DataTable
        value={premiums}
        loading={loading}
        paginator
        rows={10}
        dataKey="id"
        responsiveLayout="scroll"
        emptyMessage="Không có dữ liệu"
      >
        <Column field="name" header="Tên" sortable />
        <Column field="description" header="Mô tả" />
        <Column field="price" header="Giá" body={priceBodyTemplate} sortable />
        <Column field="durationDays" header="Thời gian (ngày)" sortable />
        <Column
          header="Thao tác"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editPremium(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deletePremium(rowData.id)} />
            </>
          )}
          style={{ minWidth: "150px" }}
        />
      </DataTable>

      <Dialog header={isEdit ? "Sửa Premium" : "Thêm Premium"} visible={dialogVisible} style={{ width: "450px" }} modal footer={dialogFooter} onHide={() => setDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Tên*</label>
            <InputText id="name" value={currentPremium.name} onChange={(e) => setCurrentPremium({ ...currentPremium, name: e.target.value })} required autoFocus />
          </div>
          <div className="p-field">
            <label htmlFor="description">Mô tả</label>
            <InputTextarea id="description" value={currentPremium.description} rows={3} onChange={(e) => setCurrentPremium({ ...currentPremium, description: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="price">Giá*</label>
            <InputText
              id="price"
              type="number"
              value={currentPremium.price}
              onChange={(e) => setCurrentPremium({ ...currentPremium, price: e.target.value === "" ? "" : parseFloat(e.target.value) })}
              required
              min={0}
              step="0.01"
            />
          </div>
          <div className="p-field">
            <label htmlFor="durationDays">Thời gian (ngày)*</label>
            <InputText
              id="durationDays"
              type="number"
              value={currentPremium.durationDays}
              onChange={(e) => setCurrentPremium({ ...currentPremium, durationDays: e.target.value === "" ? "" : parseInt(e.target.value) })}
              required
              min={1}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Tables;

