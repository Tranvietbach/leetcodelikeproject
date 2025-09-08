import React, { useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import "primereact/resources/themes/lara-light-blue/theme.css";  
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const toast = useRef(null);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:2109/api/admin/login", {
        email,
        pass
      });

      localStorage.setItem("tokenAdmin", res.data.token);

      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đăng nhập thành công",
        life: 2000
      });

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: err.response?.data?.message || "Đăng nhập thất bại",
        life: 3000
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
