import { Button, Table, Tag,Form,Input, message } from 'antd';
import React,{ useEffect,useState } from 'react';
import { ConnectProps, Dispatch, } from 'umi'
import { getMachines,delMachines } from '@/services/api'


interface indoorManagement extends ConnectProps {
  dispatch: Dispatch
  form: any
  account: any
  role: any
  loading: any
  user: any
  roles: any
  permissions: any
  route: any
  key: React.Key;
  Name: any;
  age: any;
  room: any;
  operate:any
}

const indoorManagement: React.FC = () => {

useEffect(()=>{
  const params = {
    pageNum:page,
    pageSize:pageSize
  }
  getMachines(params).then(res=>{
    res.results && setData(res.results);
    res.count && setTotal(res.count);
  });
  
  
},[])

const [data,setData] = useState([]);
const [page,setPage] = useState(1);
const [pageSize,setPageSize] = useState(10);
const [total,setTotal] = useState(0);
const [form] = Form.useForm()

function unBinding(item:{id:Number}){
  // console.log('解绑传参',item);
  delMachines(item.id).then(res=>{
    message.success('解绑成功')
    const values = form.getFieldsValue();
    const params = {
      ...values,
      pageNum:page,
      pageSize:pageSize
    };
    getMachines(params).then(res=>{
      res.results && setData(res.results);
      res.count && setTotal(res.count);
    });
    })
    .catch(e => {
    message.error('解绑失败',e)
  })
}

const onFinish = (values: any) => {
  const params = {
    ...values,
    pageNum:1,
    pageSize:pageSize
  };
  getMachines(params).then(res=>{
    res.results && setData(res.results);
    res.count && setTotal(res.count);
  });
};

const column :Array<Object> = [
  {title:'序号',dataIndex:'id'},
  {title:'序列号',dataIndex:'machineId'},
  {title:'绑定房间',dataIndex:'blockHomeName'},
  {title:'操作',dataIndex:'operate',render:(text:string, record:{onlineStatus:Number,id:Number})=>{
    return (
      <div>
      {
       <Button type="primary" onClick={()=>unBinding(record)}>解绑</Button>
      }
      </div>
    )
  }},
  {title:'绑定时间',dataIndex:'time'},
]

const handleTableChange = (pagination:any, filters:any, sorter:any) => {
  console.log('pagination',pagination);
  const values = form.getFieldsValue();
  const params = {
    ...values,
    pageNum:pagination.current,
    pageSize:pagination.pageSize
  };
  getMachines(params).then(res=>{
    res.results && setData(res.results);
    res.count && setTotal(res.count);
    setPageSize(pagination.pageSize);
    setPage(pagination.current);
  });
}

const paginationProps =  {
  showSizeChanger: true,
  showQuickJumper: true,
  current:page,
  pageSize:pageSize,
  total:total,
}

  return(
    <>
    <div style={{background:'white',marginBottom:15,padding:'20px 10px'}}>
      <Form
        form={form}
        name="basic"
        layout='inline'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="序列号" name="machineId">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
    <Table dataSource={data} columns={column} pagination={paginationProps} onChange={handleTableChange}/>
    {/* <Pagination {...pagination}/> */}
  </>
  )


    };

export default indoorManagement;