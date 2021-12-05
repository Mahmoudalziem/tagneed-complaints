import React from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const UploadFile = (props) => {
  const UploadImages = {
    multiple: false,
    maxCount: 1,
    accept: props.accept,
    beforeUpload: (file) => {
      return false;
    },
    onChange: (file) => {
      if (file.fileList[0]) {
        const Reader = new FileReader();
        Reader.onload = (file) => {
          return props.Import(
            file.target.result.replace(
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
              ""
            )
          );
        };
        return Reader.readAsDataURL(file.file);
      } else {
        return false;
      }
    },
  };
  return (
    <Dragger {...UploadImages} name="file">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">ادرج الملف هنا</p>
      <p className="ant-upload-hint"></p>
    </Dragger>
  );
};

export default UploadFile;
