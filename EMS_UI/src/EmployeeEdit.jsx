import axios from "axios";
import React, { useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";



export default function EmployeeEdit() {

    
    const [data,setData] = React.useState({
        name:'',
        email:'',
        salary:'',
        address:'',
        
    })

    const {id} = useParams();
    
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`http://localhost:5000/get/${id}`)
        .then(res=>{
            if(res.data.status === "Success")
                setData({...data,
                    name:res.data.Result[0].name,
                    email:res.data.Result[0].email,
                    salary:res.data.Result[0].salary,
                    address:res.data.Result[0].address,
                });
            
        })
        .catch(err=>console.log(err));
    },[])

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
        
        axios.put(`http://localhost:5000/update/${id}`,data)
        .then(res=>{
            console.log(res);
            if(res.data.status === "Success")
                navigate('/employee');
        })
        .catch(err=>{
            console.log(err)
        });
    }

    return (
        <div>
            
            <form className="form w-50 addemp-form" method="post" onSubmit={handleSubmit}>
            <h4 className="text-center pb-1">Update Employee Detail</h4>
                <div className="form-outline mb-4">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={data.name} onChange={handleCreate} placeholder='Enter Name' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={data.email} onChange={handleCreate} placeholder='Enter Email Address' />
                </div>
                <div className="form-outline mb-4">
                    <label htmlFor="salary">Salary</label>
                    <input type="salary" className="form-control" id="salary" name="salary" value={data.salary} onChange={handleCreate} placeholder='Enter Salary' />
                </div>
                
                <div className="form-outline mb-4">
                    <label htmlFor="address">Address</label>
                    <input type="text" className="form-control" name="address" value={data.address} onChange={handleCreate} id="address" placeholder='4/1 Nagar' />
                </div>
               
                <button className="btn btn-secondary w-100">Update</button>
            </form>
        </div>
    )
}