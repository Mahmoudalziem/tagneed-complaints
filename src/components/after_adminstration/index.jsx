import React, { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Select, DatePicker } from "antd";
import Table from "../common/table";
import Columns from "../common/columnTable";
import { Fetch } from "../common/actions";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function RegisteredPeople() {
  const [speci, setSpeci] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState();

  const onChange = (value, dateString) => {
    if (value) {
      setFilter(`&&d=${dateString.toString()}`);
      setPage(0);
    } else {
      setFilter("");
    }
  };

  const handleChangeGover = (event) => {
    if (Number(event) === 2) {
      setFilter("");
    } else {
      setFilter(`&&g=${event}`);
      setPage(0);
    }
  };

  const handleChangeComm = (event) => {
    if (Number(event) === 2) {
      setFilter("");
    } else {
      setFilter(`&&c=${event}`);
      setPage(0);
    }
  };
  useEffect(() => {
    Fetch(`/commission?page=${page}${filter}`)
      .then((res) => {
        let Data = [];
        res.data.data.map((item) =>
          Data.push({
            ...item,
            tripleNumber: `${item.tribleNum.birth}/${item.tribleNum.markaz}/${item.tribleNum.serial}`,
            procedures: item.procedures.toString(),
          })
        );
        setPage(page);
        setCount(res.data.count);
        return Data;
      })
      .then((data) => {
        setData(data);
      });
  }, [page, filter]);

  const columns = [
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
      label: "التخصص",
      name: "speci",
    },
    {
      label: "قرار المجلس الطبي",
      name: "commissionMedical",
    },
    {
      label: "الاشعة / الابحاث",
      name: "procedures",
    },
  ];

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
          كشـــــف الأسمــــاء المســـجل لجنة عليا / شكوي طبية
        </Title>

        <Row gutter={24}>
          <Col className="gutter-row" span={8}>
            <DatePicker
              format="YYYY-MM-DD"
              style={{
                width: "100%",
                padding: "14px 30px",
                fontSize: "20px",
                fontWeight: 600,
                border: "1px solid",
              }}
              onChange={onChange}
              name="date"
              className="form-control date-filter"
              id="date"
              placeholder="التاريخ"
            />
          </Col>
          <Col className="gutter-row" span={8}>
            <Select
              style={{ width: "100%" }}
              native
              onChange={handleChangeGover}
              name="gover"
              placeholder="المحافظة"
            >
              <Option value={1}>الشرقية</Option>
              <Option value={0}>مدن القناة</Option>
              <Option value={2}>كل المدن</Option>
            </Select>
          </Col>
          <Col className="gutter-row" span={8}>
            <Select
              style={{ width: "100%" }}
              native
              onChange={handleChangeComm}
              name="commissionMedial"
              placeholder="قرار المجلس الطبي"
            >
              <Option value={0}>لائق / تاجيل دورة</Option>
                  <Option value={1}>غير لائق</Option>
                  <Option value={2}>كل القرارات</Option>
            </Select>
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
}
