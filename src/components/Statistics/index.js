import React, { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Card } from "antd";
import Table from "../common/table";
import Columns from "../common/columnTable";
import BarChart from "../common/BarChart/BarChart";
import { Fetch } from "../common/actions";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Index = () => {
  const [data, setData] = useState([{ title: "Loading ..." }]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState();
  const [match, setMatch] = useState(0);
  const [notMatch, setNotMatch] = useState(0);

  useEffect(() => {
    Fetch(`/commission/statistics?page=${page}`).then((res) => {
      let Data = [],
        data = res.data.data;
      data.data.map((item) =>
        Data.push({
          ...item,
          tripleNumber: `${item.tribleNum.birth}/${item.tribleNum.markaz}/${item.tribleNum.serial}`,
          match : (item.commissionMedical === "غير لائق" ? "مخالف" : "تطابق")
        })
      );
      setPage(page);
      setMatch(data.match ? data.match : 0);
      setNotMatch(data.notMatch ? data.notMatch : 0);
      setCount(res.data.count);
      setData(Data);
    });
  }, [page]);

  const Options = {
    count: count,
    page: page,
    rowsPerPage: 10,
    filter: true,
    filterType: "dropdown",
    responsive: "sample",
    serverSide: true,
    onChangePage: (page) => {
      setPage(page);
    },
  };
  const columns = [
    // {
    //   label: "م",
    //   name: "id",
    // },
    {
      label: "الرقم الثلاثي",
      name: "tripleNumber",
    },
    {
      label: "الاسم",
      name: "name",
    },
    {
      label: "قرار المنطقة",
      name: "tagnidMedical",
    },
    {
      label: "قرار المجلس الطبي",
      name: "commissionMedical",
    },
    {
      label: "التطابق",
      name: "match",
    },
    {
      label: "اشعة / ابحاث",
      name: "procedures",
    },
  ];

  return (
    <Layout>
      <Content
        className="site-layout"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        <Title
          level={1}
          style={{ textAlign: "center", padding: "40px 0 40px" }}
        >
          تقارير الشكاوي الطبية
        </Title>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Card bordered={false}>
              <Title>قرار التطابق</Title>
              <Paragraph>{match}%</Paragraph>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card bordered={false} className="dec">
              <Title>قرار المخالفة</Title>
              <Paragraph>{notMatch}%</Paragraph>
            </Card>
          </Col>
          <Col className="gutter-row" span={12}>
            <BarChart match={match} notMatch={notMatch}/>
          </Col>
        </Row>

        <Table
          dataTable={data}
          table="commission"
          Columns={Columns("commission", columns)}
          options={Options}
        />
      </Content>
    </Layout>
  );
};

export default Index;
