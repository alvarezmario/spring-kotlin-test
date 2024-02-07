import { Button, Form, Input, InputNumber, Modal } from "antd";

// eslint-disable-next-line react/prop-types
export default function ResultForm({ result, onClose, onFinish }) {
  const [form] = Form.useForm()

  const onHide = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open
      onCancel={onHide}
      footer={null}
      title={result?.id ? 'Update Test Result' : 'Create New Test Result'}
    >
      <Form
        initialValues={{ ...result }}
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="Test Id"
          name="testId"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Low Range"
          name="lowRange"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="High Range"
          name="highRange"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Result"
          name="value"
          rules={[{ required: true, message: 'Required' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <div className="flex justify-end gap-4">
          <Button onClick={onHide}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  )
}