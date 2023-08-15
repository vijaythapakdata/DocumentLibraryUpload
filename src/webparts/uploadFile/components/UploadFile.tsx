import * as React from 'react';
import { IUploadFileProps } from './IUploadFileProps';
import {sp} from '@pnp/sp/presets/all';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
export default class UploadFile extends React.Component<IUploadFileProps, any> {
  constructor(props:any){
    super(props);
    this.state={
      FirstName:"",
      LastName:"",
      Department:"",
      EmploymentType:"",
      LastEmployer:"",
      JoiningDate:"",
      EmailID:"",
      PhoneNumber:"",
      Address:""
    };
    //Event handling binding
    this.handleChange=this.handleChange.bind(this);
    //resetform method binding
    this.resetform=this.resetform.bind(this);

  }
  //Event Handler
  private handleChange(event:any){
    const target=event.target;
    const value=target.value;
    const name=target.name;
    this.setState({[name]:value});
  }
  //Regular File Upload
  private regularFileUpload(myfile:File):Promise<void>{
    return sp.web.getFolderByServerRelativeUrl('/sites/VijayThapakSPFX/Shared%20Documents/')
    .files.add(myfile.name,myfile,true)
    .then((f)=>{
      console.log('File Uploaded');
      return f.file.getItem().then((item)=>{
        return item.update({
          Title:'Metadata Updated',
          FirstName:this.state.FirstName,
          LastName:this.state.LastName,
          Department:this.state.Department,
          EmploymentType:this.state.EmploymentType,
          LastEmployer:this.state.LastEmployer,
          EmailID:this.state.EmailID,
          PhoneNumber:this.state.PhoneNumber,
          Address:this.state.Address,
          JoiningDate:this.state.JoiningDate
        })
        .then((myUpdate)=>{
          console.log(myUpdate);
          console.log('Metadata Updated');
          alert(`Form Submitted successfully `);
        });
      });
    });
  }

  //Chunked File Upload
  private chunkedFileUpload(myfile:File):Promise<void>{
   return sp.web.getFolderByServerRelativeUrl('/sites/VijayThapakSPFX/Shared%20Documents/')
   .files.addChunked(myfile.name,myfile)
   .then(({file})=>file.getItem())
   .then((item:any)=>{
    return item.update({
      Title:'Metadata Updated',
      FirstName:this.state.FirstName,
      LastName:this.state.LastName,
      Department:this.state.Department,
      EmploymentType:this.state.EmploymentType,
      LastEmployer:this.state.LastEmployer,
      EmailID:this.state.EmailID,
      PhoneNumber:this.state.PhoneNumber,
      Address:this.state.Address,
      JoiningDate:this.state.JoiningDate
    })
    .then((myUpdate:any)=>{
      console.log(myUpdate);
      console.log('Metadata Updated');
      alert(`Form Submitted successfully `);
    });
   })
   .catch((err)=>{
    console.error('Error occurred');
    throw err;
   });
  }
//Save Files
private fileSave=()=>{
  const inputFile=document.querySelector('#newfile') as HTMLInputElement|null;
  if(inputFile && inputFile.files && inputFile.files.length>0){
    const files=inputFile.files;
    const uploadPromises:Promise<void>[]=[];
    for(let i=0;i<files.length;i++){
      const myfile=files[i];
      if(myfile.size<=10485760){
        uploadPromises.push(this.regularFileUpload(myfile));
      }
      else{
        uploadPromises.push(this.chunkedFileUpload(myfile));
      }
    }
    //Execute all Upload Promises Concurrently
    Promise.all(uploadPromises)
    .then(()=>{
      console.log('All Files Uplaoded Successfully');
    })
    .catch((error)=>{
      console.error('Error occurred during file upload');
      throw error;
    })
  }
}
//Reset Form
private resetform=()=>{
  this.setState({
    FirstName:"",
    LastName:"",
    Department:"",
    EmploymentType:"",
    LastEmployer:"",
      JoiningDate:"",
      EmailID:"",
      PhoneNumber:"",
      Address:""
  });
  const inputFile=document.querySelector('#newfile') as HTMLInputElement|null;
  if(inputFile){
    inputFile.value="";
  }
}
  public render(): React.ReactElement<IUploadFileProps> {
   

    return (
      <section>
        <h1 className='text-center fs-4 text-danger 'style={{ textDecoration: 'underline' }}>Programmers Pundits Onboarding Form</h1>
        <div className='row'>
          <div className='col'>
            <div className='form-group'>
              <label htmlFor='FirstName' className='form-label fs-6'>First Name:</label>
              <input type='text' id="FirstName" name="FirstName" value={this.state.FirstName}
              onChange={this.handleChange} className='form-control' placeholder='Vijay'/>
            </div>
          </div>
          <div className='col'>
            <div className='form-group'>
              <label htmlFor='LastName' className='form-label fs-6'>First Name:</label>
              <input type='text' id="LastName" name="LastName" value={this.state.LastName}
              onChange={this.handleChange} className='form-control' placeholder='Thapak'/>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <div className='form-group'>
              <label className='form-lable fs-6'>Employment Type</label>
              <div className='form-check'>
                <input type="radio" name="EmploymentType"
                value="Permanent"
                checked={this.state.EmploymentType==="Permanent"}
                onChange={this.handleChange}
                className='form-check-input'/>
                <label className="form-check-label">Permanent</label>
              </div>
              <div className='form-check'>
              <input type="radio" name="EmploymentType"
                value="Contract"
                checked={this.state.EmploymentType==="Contract"}
                onChange={this.handleChange}
                className='form-check-input'/>
<label className="form-check-label">Contract</label>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='form-group'>
              <label htmlFor='Department' className='form-label fs-6'>Department</label>
              <select 
              id="Department"
              name="Department"
              value={this.state.Department}
              onChange={this.handleChange}
              className='form-control'>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>

              </select>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <div className='form-group'>
              <label htmlFor='JoiningDate' className='form-label fs-6'>Joining Date</label>
              <input type='date' id="JoiningDate" name="JoiningDate" value={this.state.JoiningDate}
              onChange={this.handleChange} className='form-control'/>
            </div>
          </div>
          <div className='col'>
            <div className='form-group'>
              <label htmlFor='LastEmployer' className='form-label fs-6'>Last Company</label>
              <input type='text' name="LastEmployer" id="LastEmployer" value={this.state.LastEmployer}
              onChange={this.handleChange} className='form-control'/>
            </div>
          </div>
          </div>
          <div className='row'>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='EmailID' className='form-label fs-6'>Email Address</label>
                <input type='email' id="EmailID" name="EmailID" value={this.state.EmailID} 
                onChange={this.handleChange} className='form-control'/>
              </div>
            </div>
            <div className='col'>
              <div className='form-group'>
                <label htmlFor='PhoneNumber' className='form-label fs-6'>Personal Contact</label>
                <input type='number' id="PhoneNumber"
                name="PhoneNumber" value={this.state.PhoneNumber}
                onChange={this.handleChange}
                className='form-control'
                />
              </div>
            </div>
          </div>
          <div className='form-group'>
            <div className='mb-3'>
              <label htmlFor='Address' className='form-label fs-6'>Complete Address</label>
              <textarea name="Address" id="Address" value={this.state.Address}
              onChange={this.handleChange} className='form-control'
              rows={5}/>
            </div>
          </div>
<div className='form-group'>
  <div className='mb-3'>
    <label htmlFor='formfile' className='form-label fs-6'>Upload Document</label>
    <input type="file" id="newfile" name="myfile" className='form-control' multiple={true}/>
  </div>
</div>
<button onClick={this.fileSave} className='btn btn-success ' type="submit">Submit Form</button>
<button onClick={this.resetform} className='btn btn-danger ms-2' type="reset">Reset Form</button>
      </section>
    );
  }
}
