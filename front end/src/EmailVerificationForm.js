import React, { useState } from "react";
import { Card } from "primereact/card";
import { Input, Button, message } from "antd";
import { motion } from "framer-motion";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerificationForm = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async () => {
    const finalCode = code.join("");
    if (finalCode.length < 6) {
      message.error("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    setLoading(true);
    setError(false);
    setVerified(false);

    try {
const response = await axios.post("http://localhost:2109/api/new/confirm-verification", {
  token: localStorage.getItem("token"),
  code: finalCode,
});

      if (response.data.verified) {
        setVerified(true);
        message.success("✅ Xác minh thành công!");
        navigate("/login");

      } else {
        setError(true);
        message.error("❌ Mã không hợp lệ");
      }
    } catch (err) {
      console.error(err);
      setError(true);
      const msg = err.response?.data?.error || "Lỗi không xác định";
      message.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="verify-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}
    >
      <Card
        title="🔐 Xác minh Email"
        subTitle="Nhập mã 6 chữ số gửi tới email của bạn"
        style={{
          width: "360px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          textAlign: "center",
          paddingBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginBottom: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {code.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              style={{
                width: "40px",
                height: "45px",
                textAlign: "center",
                fontSize: "1.4rem",
                borderRadius: "6px",
                borderColor: error ? "#ff4d4f" : "#00a45a",
              }}
            />
          ))}
        </div>

        <Button
          type="primary"
          loading={loading}
          block
          size="middle"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#00a45a",
            borderColor: "#00a45a",
            fontWeight: 600,
            fontSize: "1rem",
            height: "38px",
          }}
        >
          Xác nhận mã
        </Button>

        <div style={{ marginTop: "1rem", minHeight: "24px" }}>
          {verified && (
            <div style={{ color: "#52c41a", fontWeight: 500 }}>
              <CheckCircleOutlined style={{ marginRight: "6px" }} />
              Email đã xác minh thành công
            </div>
          )}
          {error && (
            <div style={{ color: "#ff4d4f", fontWeight: 500 }}>
              <CloseCircleOutlined style={{ marginRight: "6px" }} />
              Mã không đúng hoặc đã hết hạn
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmailVerificationForm;
