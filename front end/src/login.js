import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post('http://localhost:2109/api/login', {
        username: values.username,
        password: values.password,
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        alert('Đăng nhập thành công!');
        navigate('/');
      } else {
        alert('Không nhận được token!');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('Tài khoản')) {
        alert('Tên đăng nhập không tồn tại!');
      } else if (errorMsg.includes('Mật khẩu')) {
        alert('Mật khẩu không đúng!');
      } else {
        alert('Đăng nhập thất bại!');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e8f5ee',
        padding: '24px',
      }}
    >
      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 500,
          width: '100%',
          backgroundColor: '#fff',
          padding: '40px 32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 style={{ textAlign: 'center', color: '#00a45a', marginBottom: 32 }}>
          Welcome Back
        </h2>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: '#00a45a',
              borderColor: '#00a45a',
              width: '100%',
              borderRadius: '6px',
            }}
          >
            Login
          </Button>
        </Form.Item>

        {/* ✅ Thêm phần chuyển sang trang Register */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: '#00a45a', fontWeight: 'bold' }}>
            Register nơw
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
