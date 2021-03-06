import React, { useState, useEffect } from "react";
import { Layout, Typography, Row, Select, Input, Col, DatePicker } from "antd";
import Table from "../common/table";
import Columns from "../common/columnTable";
import { Fetch } from "../common/actions";
import ToastHandling from "../common/toastify";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function RegisteredPeople() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState();

  const onChange = (value, dateString) => {
    if (value) {
      setFilter(`&&d=${dateString.toString()}`);
    } else {
      setFilter("");
    }
  };

  const handleChange = (event) => {
    if (Number(event) === 2) {
      setFilter("");
    } else {
      setFilter(`&&m=${event}`);
    }
  };

  const handleInput = (event) => {
    if (event.target.value.length === 14 && event.charCode === 13) {
      Fetch(`/complaints?id=${event.target.value}`).then((res) => {
        if (res.data.status) {
          let newData = res.data.data;
          setData([{
            ...newData,
            tripleNumber: `${newData.tribleNum.birth}/${newData.tribleNum.markaz}/${newData.tribleNum.serial}`,
          }]);
        } else {
          ToastHandling("error", res.data.message);
        }
      });
    }
  };

  useEffect(() => {
    Fetch(`/complaints?page=${page}${filter}`)
      .then((res) => {
        let Data = [];
        res.data.data.map((item) =>
          Data.push({
            ...item,
            tripleNumber: `${item.tribleNum.birth}/${item.tribleNum.markaz}/${item.tribleNum.serial}`,
          })
        );
        setPage(page);
        setCount(res.data.count);
        setData(Data);
      });
  }, [page, filter]);

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
    {
      label: "?????????? ??????????????",
      name: "tripleNumber",
    },
    {
      label: "??????????",
      name: "name",
    },
    {
      label: "???????????? ",
      name: "tagnidMedical",
    },
    {
      label: "????????????????",
      name: "gover",
    },
    {
      label: "????????????",
      name: "speci",
    },
    {
      label: "?????????? ????????????",
      name: "tagnidDate",
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
          ???????????????? ?????????????????????? ?????????????????? ?????? ????????
        </Title>

        <Row gutter={24}>
          <Col className="gutter-row" span={8}>
            <Input
              type="text"
              style={{
                padding: "14px 30px",
                fontSize: "20px",
                fontWeight: "600",
                border: "1px solid",
              }}
              onKeyPress={handleInput}
              name="nationalId"
              className="form-control"
              id="nationalId"
              placeholder="?????????? ???????????? ..."
            />
          </Col>
          <Col className="gutter-row" span={8}>
            <Select
              native
              style={{ width: "100%" }}
              onChange={handleChange}
              name="tagnidMedical"
              placeholder="???????????? ?????????? ????????????????"
            >
              <Option value={0}>???????? ????????</Option>
              <Option value={1}>???????? ????????</Option>
              <Option value={2}>???? ??????????????</Option>
            </Select>
          </Col>

          <Col className="gutter-row" span={8}>
            <RangePicker
              // showTime={{ format: "HH:mm" }}
              // placeholder="??????????????"
              format="YYYY-MM-DD"
              onChange={onChange}
            />
          </Col>
        </Row>
        <Table
          dataTable={data}
          table="compliants"
          Columns={Columns("compliants", columns)}
          options={Options}
        />
      </Content>
    </Layout>
  );
}
