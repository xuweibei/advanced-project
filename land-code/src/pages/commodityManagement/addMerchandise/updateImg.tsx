import React, { useState,useEffect } from 'react';
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { UPLOAD_SERVICE_URL } from '@/services/api'//文件上传
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const App: React.FC<any> = (props:any) => {
  const {getbeaseurl,backShow,form} = props
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  
  //set地址图片
  useEffect(()=>{
    setFileList(backShow)
  },[backShow])
  //set地址图片
  useEffect(()=>{
    getbeaseurl(fileList)
    if(backShow){
      onCheck()
    }
  },[fileList])

const beforeUpload= (file :any) => {
	  handleFilebeforeUpload(file)
	     .then(() => {
	       message.success(`上传成功`);
	     })
	     .catch(() => {
        let del = JSON.parse(JSON.stringify(fileList))
        del.slice(0,del.length-1)
        setFileList(del)
	       Modal.error({
	         title: "上传图片的宽高不符合要求，请重传！（宽高必须是750*400）"
	       });
	     });
 }


  // 上传图片尺寸限制
const checkImageWH = (file:any, width:any, height:any)=> { // 参数分别是上传的file，想要限制的宽，想要限制的高
     return new Promise(function(resolve:any, reject:any) {
       let filereader = new FileReader();
       filereader.onload = e => {
        // console.log(filereader,888)
         let src =e.target && e.target.result;
         let image = new Image();
        
         image.onload = (e)=> {
          console.log(image.height !== height,image.width !== width)
           if (image.width == width && image.height == height) { // 上传图片的宽高与传递过来的限制宽高作比较，超过限制则调用失败回调
             resolve();
           } else {
             reject();
           }
         };
         image.onerror = reject;
         image.src = src
       };

       filereader.readAsDataURL(file);
     });
   }
 
   const handleFilebeforeUpload =( file :any)=> checkImageWH(file,750,400);

  // //自定义校验(由于Upload封装成子组件后无法检验,通过form.setFieldsValue()回填数据)
  const onCheck = async () => {
    form.setFieldsValue({
      nbGoodsPictureDtoList: fileList&&fileList,
    })
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
    
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }} ></div>
    </div>
  );
 
  return (
    <>
      <Upload
        name='file'
        action={UPLOAD_SERVICE_URL}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={3}
        beforeUpload={beforeUpload}
      >
        {/* {fileList&&fileList.map((item)=>{ */}
            {/* {<img src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' } alt="avatar" style={{ width: '100%' }} /> } */}
        {/* )} */}
        {fileList.length >= 3 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default App;