import axios from "axios";
import React from "react";
import {useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"


export default function AddEmployee() {

    axios.defaults.withCredentials=false;
    const [data,setData] = React.useState({
        name:'',
        email:'',
        password:'',
        salary:'',
        address:'',
        image:''
    })

    const navigate = useNavigate();

    function handleCreate(event){
        const {name,value,files,type} = event.target;
        setData(prevData=>{
            return{
                ...prevData,
                [name]:type==='file'?files[0]:value,
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        const formData=new FormData();
        formData.append("name",data.name);
        formData.append("email",data.email);
        formData.append("password",data.password);
        formData.append('salary',data.salary);
        formData.append("address",data.address);
        formData.append("image",data.image);
        
        
            axios.post('http://localhost:5000/send_mail',data)
            .then(res=>{
                axios.post('http://localhost:5000/create',formData)
                .then(res=>{
                    navigate('/employee');
                })
                .catch(err=>{
                    console.log(err)
                });
                console.log(res.data);
                toast.success("Successfuly Send");
            })
            .catch(err=>toast.error("Employee Not Created"));
        }
        
    

    return (
        <div>
            <ToastContainer position="bottom-center" limit={1} />
            <form className="form w-50 addemp-form" method="post" onSubmit={handleSubmit}>
            <h4 className="text-center pb-1">ADD Employee</h4>
                <div className="form-outline mb-4">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={data.name} onChange={handleCreate} placeholder='Enter Name' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={data.email} onChange={handleCreate} placeholder='Enter Email Address' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={data.password} onChange={handleCreate} placeholder='Enter Password' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="salary">Salary</label>
                    <input type="salary" className="form-control" id="salary" name="salary" value={data.salary} onChange={handleCreate} placeholder='Enter Salary' />
                </div>
                
                <div className="form-outline mb-4">
                    <label htmlFor="address">Address</label>
                    <input type="text" className="form-control" name="address" value={data.address} onChange={handleCreate} id="address" placeholder='4/1 Nagar' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="empImage">Select Image</label>
                    <input type="file" className="form-control" name="image" id="image" onChange={handleCreate} />
                </div>
                <button className="btn btn-primary">Create</button>
            </form>
        </div>
    )
}