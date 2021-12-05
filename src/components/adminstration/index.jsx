import { Formik } from "formik";
import {
  Form,
  Input,
  FormItem,
  SubmitButton,
  Select,
  Checkbox,
} from "formik-antd";
import { Layout, Typography, Row, Col } from "antd";
import { Update, Fetch } from "../common/actions";
import moment from "moment";
import ToastHandling from "../common/toastify";
import React, { useState, Fragment, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import * as yup from "yup";

/// icons

import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
  dob: yup.string("ادخل تاريخ الميلاد").required("مطلوب"),
  gover: yup.string("ادخل المحافظة").required("مطلوب"),
  tagnidDate: yup.string("ادخل تاريخ القرار بالمنطقة").required("مطلوب"),
  tagnidMedical: yup.string("ادخل الموقف الطبي بالمنطقة").required("مطلوب"),
  tagnidPosition: yup.string("ادخل قرار المنطقة").required("مطلوب"),
  commissionMedical: yup.string("ادخل الموقف الطبي للدارة").required("مطلوب"),
  procedures: yup.lazy((val) =>
    Array.isArray(val) ? yup.array().of(yup.string()) : yup.string()
  ),
});

const Register = () => {
  const [images, setImages] = useState([]);
  const [speci, setSpeci] = useState([]);
  const [loading, setLoading] = useState(false);
  const [birth, setBirth] = useState();
  const [data, setData] = useState({});
  const [markaz, setMarkaz] = useState();
  const [count,setCount] = useState([]);

  const initialValues = {
    name: data.name ? data.name : "",
    birth: data.tribleNum ? data.tribleNum.birth : "",
    markaz: data.tribleNum ? data.tribleNum.markaz : "",
    serial: data.tribleNum ? data.tribleNum.serial : "",
    nationalId: data.nationalId ? data.nationalId : "",
    dob: data.dob ? data.dob : "",
    gover: data.gover ? data.gover : "",
    tagnidMedical: data.tagnidMedical ? data.tagnidMedical : "",
    tagnidPosition: data.tagnidPosition ? data.tagnidPosition : "",
    tagnidDate: data.tagnidDate ? data.tagnidDate : "",
    commissionMedical: "",
    commissionDate: moment(new Date()).format("YYYY-MM-DD"),
    procedures: [],
  };

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const getData = (event) => {
    if (event.charCode === 13) {
      event.preventDefault();
      if (birth && markaz && event.target.value) {
        Fetch(`/complaints/${birth}-${markaz}-${event.target.value}`).then(
          (res) => {
            if (res.data.status) {
              setData(res.data.data);
              setImages([]);
            } else {
              ToastHandling("error", res.data.message);
              setData({});
            }
          }
        );
      }
    }
  };

  const submitForm = (values, { setSubmitting, resetForm }) => {

    setSubmitting(false);

    if (images[0] === undefined) {

      ToastHandling("error", "ادخل 72 جند");

    } else {

      // setLoading(true);

      values.commissionDate = moment(new Date()).format("YYYY-MM-DD");

      values.image = images[0].data_url;

      Update("/complaints", values,`${birth}-${markaz}-${values.serial}`).then((res) => {
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
    }
  };

  const optionsWithDisabled = [
    { label: "اشعة", value: "اشعة" },
    { label: "ابحاث", value: "ابحاث" },
  ];

  useEffect(() => {
    Fetch('/complaints/count').then((res) => {
      if (res.data.status) {
        setCount(res.data.data)
      } else {
        ToastHandling("error", res.data.message);
      }
    })
    setSpeci(["لائق", "تاجيل دورة", "غير لائق"]);
  }, []);

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
                تسجيل القرار بعد العرض الطبي بالادارة
              </Title>
              <Title
                level={1}
                style={{  padding: "40px 0 40px",color:"red" }}
              >
                ( {count} )  الناس المســـجل لهم اليوم 
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
                        className="form-control"
                        onChange={(event) => setBirth(event.target.value)}
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
                        disabled
                        className="form-control"
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
                        disabled
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
                        // value={birthDate}
                        disabled
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
                        type="text"
                        name="gover"
                        // value={gover}
                        className="form-control"
                        id="gover"
                        placeholder="المحافظة"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginBottom: "15px" }}>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidMedical"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        disabled
                        type="text"
                        name="tagnidMedical"
                        className="form-control"
                        id="tagnidMedical"
                        placeholder="الموقف الطبي بالمنطقة"
                      />
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidPosition"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        disabled
                        type="text"
                        name="tagnidPosition"
                        className="form-control"
                        id="tagnidPosition"
                        placeholder="الموقف الطبي بالمنطقة"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Title level={2}>قرار المجلس الطبي بادارة التجنيد</Title>

                <Row gutter={16} style={{ marginBottom: "15px" }}>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="tagnidMedical"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        disabled
                        type="text"
                        name="tagnidMedical"
                        className="form-control"
                        id="tagnidMedical"
                        placeholder="الموقف الطبي بالمنطقة"
                      />
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
                        className="form-control"
                        id="tagnidDate"
                        placeholder="تاريخ تسجيل الموقف الطبي"
                      />
                    </FormItem>
                  </Col>
                </Row>

                <Row
                  gutter={16}
                  style={{ marginBottom: "15px", alignSelf: "self-end" }}
                >
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="procedures"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Checkbox.Group
                        name="procedures"
                        options={optionsWithDisabled}
                        // defaultValue={['Apple']}
                        // onChange={onChange}
                      />
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <ImageUploading
                      multiple={false}
                      value={images}
                      onChange={onChange}
                      dataURLKey="data_url"
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageUpdate,
                        onImageRemove,
                        dragProps,
                      }) => (
                        <div className="upload__image-wrapper">
                          <PhotoCameraIcon
                            onClick={onImageUpload}
                            {...dragProps}
                          />
                          {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                              <img src={image.data_url} alt="" width="100" />
                              <div className="image-item__btn-wrapper">
                                <EditIcon
                                  onClick={() => onImageUpdate(index)}
                                />
                                <DeleteIcon
                                  onClick={() => onImageRemove(index)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ImageUploading>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col className="gutter-row" span={12}>
                    <FormItem
                      name="commissionMedical"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Select
                        native
                        style={{ width: "100%" }}
                        name="commissionMedical"
                        id="commissionMedical"
                        placeholder="قرار المجلس الطبي"
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
                      name="commissionDate"
                      hasFeedback={true}
                      showValidateSuccess={true}
                    >
                      <Input
                        type="text"
                        name="commissionDate"
                        disabled
                        className="form-control"
                        id="commissionDate"
                        placeholder="تاريخ تسجيل المجلس الطبي"
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
