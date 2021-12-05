import React, { useState } from "react";
import { Form, Select, FormItem } from "formik-antd";
import { Formik } from "formik";
import { Row, Col, Modal } from "antd";
import UploadFile from "./upload";
import { Create } from "../common/actions";
import ToastHandling from "../common/toastify";
import * as yup from "yup";

const { Option } = Select;

const Models = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();

  const initialValues = {
    tagnidMedical: "",
  };

  const validationSchema = yup.object({
    tagnidMedical: yup.string("ادخل الموقف الطبي بالمنطقة").required("مطلوب"),
  });

  const submitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);

    setLoading(true);

    if (file) {
      values.file = file;
    } else {
      ToastHandling("error", "الرجاء رفع الملف");
    }

    Create("/complaints/file", values).then((res) => {
      if (res.data.status) {
        setLoading(false);
        resetForm({});
        ToastHandling("success", res.data.message);
        props.onCancel();
      } else {
        setLoading(false);
        ToastHandling("error", res.data.message);
      }
    });
  };

  return (
    <div className="modal-container d-none">
      <Modal
        title={props.title}
        visible={props.visible}
        confirmLoading={loading}
        onCancel={props.onCancel}
        width={700}
        okButtonProps={{
          htmlType: "submit",
          key: "submit",
          string: "Ok",
          form: "addFile",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitForm}
        >
          {(formik) => (
            <Form id="addFile" className="addFile">
              <Row gutter={16} style={{ marginBottom: "15px" }}>
                <Col className="gutter-row" span={24}>
                  <FormItem
                    name="tagnidMedical"
                    hasFeedback={true}
                    showValidateSuccess={true}
                  >
                    <Select
                      native
                      style={{ width: "100%" }}
                      name="tagnidMedical"
                      placeholder="الموقف الطبي بالمنطقة"
                    >
                      <Option value={"لجنة عليا"}>لجنة عليا</Option>
                      <Option value={"شكوي طبية"}>شكوي طبية</Option>
                      <Option value={"بدون"}>بدون</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col className="gutter-row" span={24}>
                  <UploadFile
                    accept=".xlsx"
                    action="excel"
                    Import={(file) => setFile(file)}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Models;
