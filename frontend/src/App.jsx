import { useState } from 'react'
import './App.css'
import useAxios from "axios-hooks";
import {Button, Card, message, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from "axios";
import ResultForm from "./ResultForm.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [{ data = [] }] = useAxios('http://localhost:8080/builds')
  const [lotTypes, setLotTypes] = useState([])
  const [lotType, setLotType] = useState(null)
  const [results, setResults] = useState([])
  const [modalOpen, setModalOpen] = useState(null)

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:8080/results/${id}`)
    const { data } = await axios.get(`http://localhost:8080/results?lotType=${lotType.id}`)

    setResults(data);

    messageApi.info('Test Result Deleted Successfully')
  }

  const onFinishSubmit = async (values) => {
    if (modalOpen.id) {
      await axios.put(`http://localhost:8080/results/${modalOpen.id}`, values)
      const { data } = await axios.get(`http://localhost:8080/results?lotType=${lotType.id}`)

      setResults(data);
      messageApi.info('Test Result Updated Successfully')
    } else {
      const { data } = await axios.post(`http://localhost:8080/results?lotType=${lotType.id}`, values)

      setResults([
        ...results,
        data,
      ])

      messageApi.info('Test Result Created Successfully')
    }

    setModalOpen(null)
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Build Info',
      dataIndex: 'buildInfoVersion',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'otherBuildInfo',
      render: ({ manufacturer }) => manufacturer
    },
    {
      title: 'Release Date',
      dataIndex: 'otherBuildInfo',
      render: ({ releaseDate }) => releaseDate
    },
    {
      title: 'Total Lots',
      dataIndex: 'lots',
      align: 'center',
      render: (x) => x.length
    },
    {
      title: '',
      dataIndex: 'lots',
      align: 'center',
      render: (x, build) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setLotTypes(build.lots[0].lotTypes)
          }}
        />
      )
    }
  ];

  const chartData = {
    labels: results.map(x => x.testId) || [],
    datasets: [
      {
        label: lotType?.type,
        data: results.map(x => x.value),
        backgroundColor({ dataIndex }) {
          const { value, lowRange, highRange } = results[dataIndex];

          if(value >= lowRange && value <= highRange) {
            return '#16a34a'
          }

          return '#dc2626'
        },
      },
    ],
  };

  return (
    <div className="container mx-auto mt-4">
      {contextHolder}

      <div className="grid grid-cols-2 gap-4">
        <Card title="Builds" styles={{body: {padding: 0}}}>
          <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            pagination={false}
            size="middle"
          />
        </Card>

        {lotTypes.length > 0 && (
          <Card
            title="Lot Types"
            styles={{body: {padding: 0}}}
          >
            <Table
              rowKey="id"
              dataSource={lotTypes}
              columns={[
                { title: 'Type', dataIndex: 'type' },
                {
                  title: '',
                  dataIndex: 'results',
                  align: 'center',
                  render: (r, type) => (
                    <Space>
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          setLotType(type)
                          setResults(r)
                        }}
                      />
                    </Space>
                  )
                }
              ]}
              pagination={false}
              size="middle"
            />
          </Card>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 my-4 gap-4 items-center">
          <div className="h-80">
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
              data={chartData}
            />
          </div>

          <Card
            title="Results"
            styles={{body: {padding: 0}}}
            extra={(
              <Button
                icon={<PlusOutlined/>}
                onClick={() => {
                  setModalOpen({})
                }}
              />
            )}
          >
            <Table
              rowKey="id"
              dataSource={results}
              columns={[
                {title: 'Test ID', dataIndex: 'testId'},
                {title: 'Value', dataIndex: 'value'},
                {title: 'Low Range', dataIndex: 'lowRange'},
                {title: 'High Range', dataIndex: 'highRange'},
                {
                  title: '',
                  align: 'center',
                  render: (r, result) => (
                    <Space>
                      <Button
                        size="small"
                        icon={<EditOutlined/>}
                        onClick={() => {
                          setModalOpen(result)
                        }}
                      />
                      <Popconfirm
                        title="Delete Test Result"
                        description="Are you sure?"
                        onConfirm={async () => {
                          await onDelete(result.id)
                        }}
                      >
                        <Button
                          size="small"
                          type="primary"
                          danger
                          icon={<DeleteOutlined/>}
                        />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
              pagination={false}
              size="middle"
            />
          </Card>
        </div>
      )}

      {modalOpen && (
        <ResultForm
          result={modalOpen}
          onClose={() => {
            setModalOpen(null)
          }}
          onFinish={onFinishSubmit}
        />
      )}
    </div>
  )
}

export default App
