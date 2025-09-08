import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Col, Row, Modal, Progress, Card as AntCard, Form, Input, message, Statistic } from 'antd';
import { Image } from 'primereact/image';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'primereact/tooltip';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
    const [feedback, setFeedback] = useState('');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (user && user.badges) {
      setBadges(user.badges);
    }
  }, [user]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };
  const handleChangePassword = () => {
    navigate('/ChangePasswordForm');
  };
  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const token = localStorage.getItem("token");

      try {
        const response = await axios.put("http://localhost:2109/api/upload-avatar-json", {
          token: token,
          base64Image: base64String,
          fileName: avatarFile.name
        });

        console.log("Upload success:", response.data);
        message.success("Cập nhật ảnh đại diện thành công");
        setIsAvatarDialogOpen(false);
        axios.get(`http://localhost:2109/api/users/${localStorage.getItem("token")}`)
          .then(res => setUser(res.data))
          .catch(err => console.error(err));
      } catch (error) {
        console.error("Upload error:", error);
        message.error("Lỗi khi cập nhật ảnh");
      }
    };

    reader.readAsDataURL(avatarFile); // convert to base64
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Chưa có token, chưa đăng nhập");
      navigate("/login");
      return;
    }

    axios.post("http://localhost:2109/api/extract-user-id?token=" + token)
      .then((res) => {
        console.log("Token hợp lệ, userId:", res.data.id);
      })
      .catch(() => {
        alert("Token hết hạn hoặc không hợp lệ");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:2109/api/users/${localStorage.getItem("token")}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const updateUserProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put("http://localhost:2109/api/updateprofile", {
        token: token,
        username: updatedData.username,
        fullName: updatedData.fullName,
        avatarUrl: updatedData.avatarUrl,
        country: updatedData.country,
        githubUrl: updatedData.githubUrl,
        bio: updatedData.bio
      })
        ;
      if (response.status !== 200) {
        alert("update successfully");
        return;
      } else if (response.data.error) {
        alert(response.data.error);
        return;
      }



      message.success("Cập nhật thành công");
      setUser(prev => ({
        ...prev,
        username: updatedData.username,
        profile: {
          ...prev.profile,
          fullName: updatedData.fullName,
          avatar: updatedData.avatarUrl,
          country: updatedData.country,
          github: updatedData.githubUrl,
          bio: updatedData.bio,
        }
      }));
      setIsModalOpen(false);
    } catch (error) {
      message.error("Lỗi khi cập nhật");
      console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
    }
  };

  const handleOpenModal = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username || '',
        fullName: user.profile?.fullName || '',
        avatarUrl: user.profile?.avatar || '',
        country: user.profile?.country || '',
        githubUrl: user.profile?.github || '',
        bio: user.profile?.bio || ''
      });
      setIsModalOpen(true);
    }
  };

  if (!user) return <div>Loading...</div>;

  const name = user.profile?.fullName || user.username;
  const country = user.profile?.country || 'N/A';
  const avatar = user.profile?.avatar || 'https://via.placeholder.com/100';
  const roles = user.roles || [];
  const submissions = user.submissions || [];

  const tableData = submissions.map(sub => ({
    problem: sub.problemId,
    status: sub.status,
    statusDetail: sub.statusDetail,
    runtime: sub.runtime,
    memory: sub.memory,
    submittedAt: new Date(sub.submittedAt).toLocaleString(),
  }));

  const start = (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: '7rem' }}>
      <h2 style={{ color: '#00a45a', margin: 0 }}><b>PRIMEDEV</b></h2>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Menubar className="custom-menubar" style={{ color: 'black', border: 'none', background: 'none' }} model={[]} />
    </div>
  );
  const handleSendVerification = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2109/api/new/send-verification", {
        token: token, // ✅ Gửi token trong JSON body
      });

      message.success(response.data.message || "Mã xác minh đã được gửi.");
      navigate("/EmailVerificationForm");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Lỗi không xác định.";
      message.error(msg);
    }
  };


  return (
    <div className="min-h-screen bg-[#f4f6fa] px-[18%] py-10">
      <Menubar className="custom-menubar" style={{ border: 'none', background: 'none' }} start={start} end={end} />
      <Row style={{ padding: "0 18%" }} gutter={[24, 24]} justify="center" align="stretch">
<Col xs={24} md={12} lg={6}>
  <AntCard
    title={<span className="text-2xl font-bold text-gray-800">{name}</span>}
    className="shadow-xl rounded-2xl bg-white h-full"
  >
    {/* Avatar */}
    <div style={{ borderRadius: '20px', overflow: 'hidden', width: 160, height: 145, marginBottom: '1rem' }}>
      <Image
        src={avatar}
        alt="Avatar"
        width={160}
        height={145}
        preview
        style={{ objectFit: 'cover' }}
      />
    </div>

    {/* Buttons */}
    <Button
      label="Change profile picture"
      icon="pi pi-image"
      className="p-button-sm p-button-secondary mb-3"
      onClick={() => setIsAvatarDialogOpen(true)}
    />
    <Button
      label="Edit Profile"
      icon="pi pi-pencil"
      className="mb-6 p-button-sm p-button-outlined"
      onClick={handleOpenModal}
    />

    {/* Country */}
    <div className="mb-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">Country</h3>
      <p className="text-gray-600">{country}</p>
    </div>

    {/* Roles */}
    <div className="mb-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">Roles</h3>
      <div className="flex flex-wrap gap-2">
        {roles.map((role, idx) => (
          <Tag key={idx} value={role} severity="info" className="text-sm" />
        ))}
      </div>
    </div>

    {/* Bio */}
    <div className="mb-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">Bio</h3>
      <p className="text-gray-600">{user.profile?.bio || 'No bio provided.'}</p>
    </div>

    {/* GitHub */}
    <div className="mb-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">GitHub</h3>
      <a href={user.profile?.github} className="text-blue-500" target="_blank" rel="noreferrer">
        {user.profile?.github}
      </a>
    </div>

    {/* Ranking */}
    {user.ranking && (
      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-800 mb-1">Ranking</h3>
        <p className="text-gray-700">Rank: <span className="font-bold">{user.ranking.rank}</span></p>
        <p className="text-gray-700">Score: <span className="font-bold">{user.ranking.score}</span></p>
        {user.ranking.updatedAt && (
          <p className="text-gray-500 text-sm">Updated at: {new Date(user.ranking.updatedAt).toLocaleString()}</p>
        )}
      </div>
    )}

    {/* Mail / Change password */}
    <div className="mt-6">
      {user.statusmail === false ? (
        <Button
          label="Confirm email"
          icon="pi pi-envelope"
          className="p-button-sm p-button-warning"
          onClick={handleSendVerification}
        />
      ) : (
        <Button
          label="Change password"
          icon="pi pi-lock"
          className="p-button-sm p-button-primary"
          onClick={handleChangePassword}
        />
      )}
    </div>
  </AntCard>
</Col>

        <Col xs={24} md={12} lg={18}>
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24} md={12}>
              <AntCard title="Submission Stats" className="h-full">
                <div className="flex flex-col items-center gap-3">
                  <Progress
                    type="circle"
                    percent={(submissions.filter(s => s.status === 'PASSED').length / (submissions.length || 1)) * 100}
                    strokeColor="#00a45a"
                    format={percent => `${Math.round(percent)}% Passed`}
                    width={85}
                  />

                  {/* Statistic đẹp và rõ ràng */}
                  {user?.progress && (
                    <Statistic
                      title="Problems Solved"
                      value={user.progress.solved}
                      suffix={`/ ${user.progress.total}`}
                      valueStyle={{ color: '#3f8600', fontSize: 16 }}
                    />
                  )}
                </div>
              </AntCard>
            </Col>

            <Col xs={24} md={12}>
              <AntCard title="Recent Activity" className="h-full space-y-2">
                <p className="text-gray-600">Total submissions: {submissions.length}</p>

                <div>
                  <p className="text-gray-600 font-semibold mb-1">Badges:</p>
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Tag
                            value={badge.name}
                            severity="success"
                            className="text-sm"
                            data-pr-tooltip={badge.description}
                            data-pr-position="top"
                          />
                          <Tooltip target=".p-tag" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No badges earned yet.</p>
                  )}
                </div>
              </AntCard>
            </Col>

            <Col span={24}>
              <AntCard title="Submission Table" className="mt-4 shadow-xl rounded-2xl bg-white">
                <DataTable value={tableData} stripedRows responsiveLayout="scroll">
                  <Column field="problem" header="Problem" />
                  <Column field="status" header="Status" />
                  <Column field="statusDetail" header="Detail" />
                  <Column field="runtime" header="Runtime (ms)" />
                  <Column field="memory" header="Memory (KB)" />
                  <Column field="submittedAt" header="Submitted At" />
                </DataTable>
              </AntCard>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal cập nhật */}
      <Modal
        title="Updated Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          form
            .validateFields()
            .then(values => updateUserProfile(values))
            .catch(info => console.log('Validate Failed:', info));
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Avatar URL">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
          <Form.Item name="githubUrl" label="GitHub URL">
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update profile picture"
        open={isAvatarDialogOpen}
        onCancel={() => setIsAvatarDialogOpen(false)}
        onOk={uploadAvatar}
        okText="Tải lên"
        cancelText="Hủy"
      >
        <div className="flex flex-col items-center">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Preview"
              width={120}
              height={120}
              className="mb-4 rounded-full"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </Modal>


    </div>
  );
}
