"use client";

import { Table } from "antd";
import { useState, useEffect } from "react";
import useTableUtils from "../hooks/useTableUtils";
import { ColumnType } from "antd/es/table/interface";

const SHEET_ID = "1SB3HlYK_LfvQDkPNiRHmfAoSasnEEsFjKCT3AuaIyZ0"; // Ganti dengan Spreadsheet ID
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

interface Talent extends Record<string, unknown> {
  key: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  yoe: number;
  educationDegree: string;
  educationInstitution: string;
  educationGraduationYear: number;
  careerLevel: string;
  status: string;
  cvUrl: string;
  email: string;
}
interface Cell {
  v: string | number | null;
}

interface Row {
  c: Cell[];
}
export default function TalentList() {
  const [data, setData] = useState<Talent[]>([]);
  const [allData, setAllData] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const {
    getColumnSearchProps,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  } = useTableUtils<Talent>();

  const fetchData = async () => {
    setLoading(true);
    try {
      fetch(SHEET_URL)
        .then((res) => res.text())
        .then((text) => {
          const json = JSON.parse(text.substring(47, text.length - 2));
          const rows: Row[] = json.table.rows;

          const formattedData: string[][] = rows.map((row) =>
            row.c.map((cell) => (cell?.v !== null ? String(cell?.v) : ""))
          );

          const mapData = formattedData.map((row: string[], index) => {
            const [
              name,
              jobTitle,
              department,
              location,
              yoe,
              educationDegree,
              educationInstitution,
              educationGraduationYear,
              careerLevel,
              status,
              cvUrl,
              email,
            ] = row;

            return {
              key: (index + 1).toString(),
              name,
              jobTitle,
              department,
              location,
              yoe: Number(yoe),
              educationDegree,
              educationInstitution,
              educationGraduationYear: Number(educationGraduationYear),
              careerLevel,
              status,
              cvUrl,
              email,
            };
          });
          setAllData(mapData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } finally {
      setLoading(false);
    }
  };

  const filterData = async (
    searchStates: Record<string, string> = {},
    page: number = currentPage,
    size: number = pageSize
  ) => {
    let filteredData = allData;
    Object.entries(searchStates).forEach(([column, value]) => {
      if (value) {
        filteredData = filteredData.filter((item) =>
          String((item as Record<string, unknown>)[column])
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    const start = (page - 1) * size;
    const paginatedData = filteredData.slice(start, start + size);

    setData(paginatedData);
    setTotal(filteredData.length);
  };

  useEffect(() => {
    if (allData.length > 0) {
      filterData({}, currentPage, pageSize);
    } else {
      fetchData();
    }
  }, [currentPage, pageSize, allData]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Talent) => (
        <div>
          <strong>{record.name}</strong>
        </div>
      ),
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      ...getColumnSearchProps("jobTitle", filterData),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      ...getColumnSearchProps("department", filterData),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Yoe",
      dataIndex: "yoe",
      key: "yoe",
      sorter: (a: Talent, b: Talent) => a.yoe - b.yoe,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Degree",
      dataIndex: "educationDegree",
      key: "educationDegree",
    },
    {
      title: "Education Institution",
      dataIndex: "educationInstitution",
      key: "educationInstitution",
    },
    {
      title: "Graduation Year",
      dataIndex: "educationGraduationYear",
      key: "educationGraduationYear",
    },
    {
      title: "Career Level",
      dataIndex: "careerLevel",
      key: "careerLevel",
    },

    {
      title: "Actions",
      key: "actions",
      render: () => <span style={{ cursor: "pointer" }}>☰</span>,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <Table
        columns={columns as ColumnType<Talent>[]}
        dataSource={data}
        loading={loading}
        pagination={{
          total: total,
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            filterData({}, page, size);
          },
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        scroll={{ x: "max-content" }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <p style={{ margin: 0 }}>
                CV Link:{" "}
                <a href={record.cvUrl} target="_blank">
                  {record.cvUrl ? "View" : "No CV"}
                </a>
              </p>
              <p style={{ margin: 0 }}>
                Email:{" "}
                <a href={`mailto:${record.email}`} target="_blank">
                  {record.email}
                </a>
              </p>
            </>
          ),
        }}
      />
    </div>
  );
}
