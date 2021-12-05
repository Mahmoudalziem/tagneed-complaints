import { Formik } from "formik";
import { Form, Input, Select, FormItem, SubmitButton } from "formik-antd";
import { Layout, Typography, Row, Col } from "antd";
import React, { useState, Fragment, useEffect } from "react";
import governorates from "../../meta/governorate.json";
import { Create, Fetch } from "../common/actions";
import ToastHandling from "../common/toastify";
import moment from 'moment'
import * as yup from "yup";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Register = () => {
  const [birthDate, setBirthDate] = useState();
  const [gover, setGover] = useState();
  const [speci, setSpeci] = useState([]);
  const [decision, setDicision] = useState([]);
  const [birth, setBirth] = useState();
  const [data,setData] = useState({});
  const [markaz, setMarkaz] = useState();
  const [loading, setLoading] = useState(false);

  const caclBirthday = (nationalId) => {
    const year =
      (parseInt(nationalId.slice(0, 1)) + 17) * 100 +
      parseInt(nationalId.slice(1, 3));
    const month = nationalId.slice(3, 5);
    const day = nationalId.slice(5, 7);

    return `${year}-${month}-${day}`;
  };

  const nationalChange = (event) => {
    if (event.target.value.length === 14) {
      setBirthDate(caclBirthday(event.target.value));
      setGover(governorates[event.target.value.slice(7, 9)]);
    }
  };

  const handleChange = (value) => {
    value === "شكوي طبية"
      ? setDicision(["لائق"])
      : setDicision(["لجنة عليا"]);
  };

  useEffect(() => {
    setSpeci([
      "لجنة جراحة",
      "لجنة عظام",
      "لجنة بطنة",
      "لجنة جلدية",
      "لجنة انف",
      "لجنة رمد",
    ]);
  }, []);

  const initialValues = {
    name: data.name ? data.name : "",
    birth: data.tribleNum ? data.tribleNum.birth : "",
    markaz: data.tribleNum ? data.tribleNum.markaz : "",
    serial: data.tribleNum ? data.tribleNum.serial : "",
    nationalId: data.nationalId ? data.nationalId : "",
    dob: "",
    gover: "",
    speci: "",
    tagnidMedical: "",
    tagnidPosition: "",
    tagnidDate: "",
  };

  const validationSchema = yup.object({
    name: yup.string("ادخل الاسم رباعي").required("مطلوب"),
    birth: yup
      .string("ادخل سنة الميلاد")
      .min(4, "سنة الميلد يجب ان تتكون من 4 ارقام")
      .required("مطلوب"),
    markaz: yup
      .string("ادخل كود المركز")
      // .max(3, "كود المركز يجب الا يزيد عن 3 ارقام")
      .required("مطلوب"),
    serial: yup.string("ادخل الرقم المسلسل").required("مطلوب"),
    nationalId: yup.string("ادخل رقم الحضور").required("مطلوب"),
    speci: yup.string("التخصص مطلوب").required("مطلوب"),
    tagnidMedical: yup.string("ادخل الموقف الطبي بالمنطقة").required("مطلوب"),
    tagnidPosition: yup.string("ادخل قرار المنطقة").required("مطلوب"),
  });

  const getData = (event) => {
    if (event.charCode === 13) {
      event.preventDefault();
      if (birth && markaz && event.target.value) {
        Fetch(`/complaints/${birth}-${markaz}-${event.target.value}`).then(
          (res) => {
            if (res.data.status) {
              setData(res.data.data)
              setBirthDate(res.data.data.dob)
              setGover(res.data.data.gover)
            } else {
              ToastHandling("error", res.data.message);
              setData({});
              setBirthDate();
              setGover();
            }
          }
        );
      }
    }
  };

  const submitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    // setLoading(true);

    values.tribleNum = {
      birth: values.birth,
      markaz: values.markaz,
      serial: values.serial,
    };

    values.dob = birthDate;

    values.gover = gover;

    values.tagnidDate = moment(new Date()).format('YYYY-MM-DD');

    Create("/complaints", values).then((res) => {
      if (res.data.status) {
        setLoading(false);
        resetForm({});
        setData({});
        ToastHandling("success", res.data.message);
      } else {
        setLoading(false);
        ToastHandling("error", res.data.message);
      }
    });
  };

  return (
    <Layout>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitForm}
        >
          {(formik) => (
            <Fragment>
              <Title
                level={1}
                style={{ textAlign: "center", padding: "40px 0 40px" }}
              >
                ادخال الشكاوي / اللجنة الطبية العليا
              </Title>
              <Form>
                <Title level={2}>البيانات الاساسية</Title>

                <Title level={3} style={{ padding: 0, marginRight: "10px" }}>
                  الرقم الثلاثي
                </Title>

                <Row gutter={16}>
                  <Col className="gutter-row" span={4}>
                    <FormItem
                      name="birth"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="birth"
                        onChange={(event) => setBirth(event.target.value)}
                        className="form-control"
                        id="birth"
                        // placeholder="مواليد"
                      />
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" span={4}>
                    <FormItem
                      name="markaz"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="markaz"
                        // onKeyPress={(event) => event.preventDefault()}
                        onChange={(event) => {
                          setMarkaz(event.target.value);
                        }}
                        className="form-control"
                        id="markaz"
                        // placeholder="مركز"
                      />
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" span={4}>
                    <FormItem
                      name="serial"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="serial"
                        onKeyPress={getData}
                        className="form-control"
                        id="serial"
                        // placeholder="مسلسل"
                      />
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="name"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="name"
                        className="form-control"
                        // defaultValue={data.name ? data.name : ''}
                        // value={data.name ? data.name : ''}
                        id="name"
                        placeholder="الاسم"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col className="gutter-row" span={8}>
                    <FormItem
                      name="nationalId"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="nationalId"
                        min={14}
                        minLength={14}
                        onChange={nationalChange}
                        className="form-control"
                        id="nationalId"
                        placeholder="الرقم القومي"
                      />
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <FormItem
                      name="dob"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="dob"
                        disabled
                        value={birthDate}
                        defaultValue={birthDate}
                        className="form-control"
                        id="dob"
                        placeholder="تاريخ الميلاد"
                      />
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" span={8}>
                    <FormItem
                      name="gover"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        disabled
                        value={gover}
                        defaultValue={gover}
                        type="text"
                        name="gover"
                        className="form-control"
                        id="gover"
                        placeholder="المحافظة"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Title level={2}>بيانات الطبية</Title>

                <Row gutter={16} style={{ marginBottom: "15px" }}>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidMedical"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Select
                        native
                        style={{ width: "100%" }}
                        onChange={handleChange}
                        name="tagnidMedical"
                        placeholder="الموقف الطبي بالمنطقة"
                      >
                        <Option value={"لجنة عليا"}>لجنة عليا</Option>
                        <Option value={"شكوي طبية"}>شكوي طبية</Option>
                        {/* <Option value={"بدون موقف طبي"}>بدون موقف طبي</Option> */}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidPosition"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Select
                        native
                        style={{ width: "100%" }}
                        name="tagnidPosition"
                        placeholder="قرار المنطقة"
                      >
                        {decision.map((index, key) => {
                          return (
                            <Option key={index} value={index}>
                              {index}
                            </Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="speci"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Select
                        style={{ width: "100%" }}
                        native
                        name="speci"
                        placeholder="التخصص"
                      >
                        {speci.map((index, key) => {
                          return (
                            <Option key={key} value={index}>
                              {index}
                            </Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidDate"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="tagnidDate"
                        disabled
                        // 'DD/MM/YYYY'
                        value={new Date().toLocaleDateString("AR")}
                        defaultValue={new Date().toLocaleDateString("AR")}
                        className="form-control"
                        id="tagnidDate"
                        placeholder="تاريخ تسجيل الموقف الطبي"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <SubmitButton
                  name="push"
                  className="btn"
                  loading={loading}
                  disabled={false}
                >
                  تسجيل الفرد
                </SubmitButton>
              </Form>
            </Fragment>
          )}
        </Formik>
      </Content>
    </Layout>
  );
};

export default Register;
