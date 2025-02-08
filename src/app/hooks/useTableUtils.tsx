import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnType } from "antd";
import { Button, Input, Space } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const useTableUtils = <T extends Record<string, unknown>>() => {
  const [searchStates, setSearchStates] = useState<Record<string, string>>({});
  const searchInput = useRef<InputRef>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: keyof T,
    onSearch: (
      searchStates: Record<string, string>,
      page: number,
      pageSize: number
    ) => Promise<void>
  ) => {
    confirm();
    const newSearchStates = {
      ...searchStates,
      [dataIndex]: selectedKeys[0],
    };
    setSearchStates(newSearchStates);
    setCurrentPage(1);
    await onSearch(newSearchStates, 1, pageSize);
  };

  const handleReset = async (
    clearFilters: () => void,
    dataIndex: keyof T,
    onSearch: (
      searchStates: Record<string, string>,
      page: number,
      pageSize: number
    ) => Promise<void>
  ) => {
    clearFilters();
    const newSearchStates = { ...searchStates };
    delete newSearchStates[dataIndex as string];
    setSearchStates(newSearchStates);
    await onSearch(newSearchStates, currentPage, pageSize);
  };

  const getColumnSearchProps = (
    dataIndex: keyof T,
    onSearch: (
      searchStates: Record<string, string>,
      page: number,
      pageSize: number
    ) => Promise<void>
  ): TableColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex, onSearch)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys as string[],
                confirm,
                dataIndex,
                onSearch
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, dataIndex, onSearch)
            }
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    render: (text: string) => {
      const searchText = searchStates[dataIndex as string];
      return searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      );
    },
  });

  return {
    getColumnSearchProps,
    searchStates,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
  };
};

export default useTableUtils;
