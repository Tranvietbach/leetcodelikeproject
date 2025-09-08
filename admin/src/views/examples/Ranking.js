import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import axios from "axios";
import Header from "components/Headers/Header.js";

export default function RankingList() {
    const [rankings, setRankings] = useState([]);
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
    const fetchRankings = async () => {
        try {
            const res = await axios.get("http://localhost:2109/api/ranking", {
                headers: { Authorization: token }
            });
            setRankings(res.data);
        } catch (err) {
            // alert(err.response?.data?.message || "Lỗi khi tải ranking");
        }
    };

    const resetRanking = async () => {
        if (!window.confirm("Bạn có chắc muốn reset ranking không?")) return;

        try {
            const res = await axios.post("http://localhost:2109/api/ranking/reset", {}, {
                headers: { Authorization: token }
            });
            // alert(res.data.message);
            fetchRankings();
        } catch (err) {
            // alert(err.response?.data?.message || "Lỗi khi reset ranking");
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    return (
        <div className="p-4">
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
            
            <h2 className="mb-4">Bảng xếp hạng</h2>
            <Button 
                label="Reset Ranking" 
                icon="pi pi-refresh" 
                className="p-button-warning mb-3"
                onClick={resetRanking} 
            />
            <DataTable value={rankings} responsiveLayout="scroll">
                <Column field="rank" header="Rank" sortable />
                <Column field="username" header="Username" />
                <Column field="score" header="Score" sortable />
            </DataTable>
        </div>
    );
}
