import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";


export default function Employee(){

    
    const [data,setData] = React.useState([]);

    useEffect(()=>{
        axios.get('http://localhost:5000/getEmployee')
        .then(res=>{
            if(res.data.status === "Success")
                setData(res.data.Result);
        })
        .catch(err=>console.log(err));
    },[])

    function handleDelete(id){
        axios.delete("http://localhost:5000/delete/"+id)
        .then(res=>{
            if(res.data.status === "Success")
                window.location.reload(true)
        })
        .catch(err=>console.log(err));
    }

    return(
        <div className="p-3 pt-4">
            <div className="d-flex justify-content-center">
                <h3>Employee List</h3>
            </div>
            <Link to='/create' className="btn btn-success" >Add Employee</Link>
            <div className="p-4">
                <table className="table text-center emp--data">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Email</th>
                            <th>Salary</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((ele,index)=>{
                            return (
                            <tr key={index}>
                                <td>{ele.name}</td>
                                <td className="td-image"><img src={`http://localhost:5000/images/${ele.image}`} className="emp--image" /></td>
                                <td>{ele.email}</td>
                                <td>{ele.salary}</td>
                                <td>{ele.address}</td>
                                <td>
                                    <Link to={`/employeeEdit/${ele.Id}`} className="btn btn-primary btn-sm">Edit</Link>
                                    <button onClick={()=>handleDelete(ele.Id)} className="btn btn-danger btn-sm mx-2">Delete</button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}