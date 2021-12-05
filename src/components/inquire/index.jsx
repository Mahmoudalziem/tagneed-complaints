import React, { useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Input,
  Card,
  Button,
  Image,
  Empty,
} from "antd";
import { Fetch } from "../common/actions";
import ToastHandling from "../common/toastify";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Index = () => {
  const [markaz, setMarkaz] = useState();
  const [birth, setBirth] = useState();
  const [serial, setSerial] = useState();
  const [data, setData] = useState();

  const handleClick = () => {
    if (birth && markaz && serial) {
      Fetch(`/commission/${birth}-${markaz}-${serial}`).then((res) => {
        const Data = res.data.data;

        if (res.data.status) {
          setData({
            ...Data,
            tripleNumber: `${Data.tribleNum.birth}/${Data.tribleNum.markaz}/${Data.tribleNum.serial}`,
          });
          
        } else {
          ToastHandling("error", res.data.message);
          setData();
        }
      });
    }
  };

  return (
    <Layout>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", margin: "64px 0" }}
      >
        <Title
          level={1}
          style={{
            textAlign: "center",
            padding: "40px 0 40px",
            fontSize: "50px",
          }}
        >
          الاستعلام
        </Title>

        <Title level={3} style={{ padding: 0, marginRight: "10px" }}>
          الرقم الثلاثي
        </Title>

        <Row gutter={24}>
          <Col className="gutter-row" span={7}>
            <Input
              style={{
                padding: "14px 30px",
                fontSize: "20px",
                fontWeight: 600,
                border: "1px solid #3a6351",
              }}
              type="text"
              name="birth"
              onChange={(event) => setBirth(event.target.value)}
              className="form-control"
              id="birth"
              // placeholder="مواليد"
            />
          </Col>

          <Col className="gutter-row" span={7}>
            <Input
              style={{
                padding: "14px 30px",
                fontSize: "20px",
                fontWeight: 600,
                border: "1px solid #3a6351",
              }}
              type="text"
              name="markaz"
              onChange={(event) => setMarkaz(event.target.value)}
              className="form-control"
              id="markaz"
              // placeholder="مركز"
            />
          </Col>

          <Col className="gutter-row" span={7}>
            <Input
              style={{
                padding: "14px 30px",
                fontSize: "20px",
                fontWeight: 600,
                border: "1px solid #3a6351",
              }}
              type="text"
              name="serial"
              className="form-control"
              onChange={(event) => setSerial(event.target.value)}
              id="serial"
              // placeholder="مسلسل"
            />
          </Col>

          <Col className="gutter-row" span={3}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleClick}
              style={{
                // padding: "14px 30px",
                width: "100%",
                height: "100%",
                fontSize: "25px",
                fontWeight: 600,
                background: "#3a6351",
                color: "#fff",
              }}
            >
              بحث
            </Button>
          </Col>
        </Row>

        {data ? (
          <Row gutter={24} className="inquire-container">
            <Col className="gutter-row" span={12}>
              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}>الاسم :</Title>
                <Paragraph>{data.name}</Paragraph>
              </Card>

              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}>الرقم الثلاثي :</Title>
                <Paragraph>{data.tripleNumber}</Paragraph>
              </Card>

              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}>القرار الطبي (الادارة) :</Title>
                <Paragraph>{data.commissionMedical}</Paragraph>
              </Card>
              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}> رقم الكشف :</Title>
                <Paragraph>456</Paragraph>
              </Card>
              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}> المحافظة :</Title>
                <Paragraph>{data.gover}</Paragraph>
              </Card>
              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}> الكشف بالمنطقة : </Title>
                <Paragraph>{data.tagnidDate}</Paragraph>
              </Card>
              <Card bordered={false} style={{ width: 300 }}>
                <Title level={2}> الكشف بالادارة : </Title>
                <Paragraph>{data.commissionDate}</Paragraph>
              </Card>
            </Col>
            <Col className="gutter-row" span={12}>
              <Image src={data.image} />
            </Col>
          </Row>
        ) : (
          <Empty
            description="لا يوجد بيانات"
            style={{ width: "100%", padding: "100px", fontSize: "30px" }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default Index;
