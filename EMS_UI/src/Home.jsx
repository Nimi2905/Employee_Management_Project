import axios from "axios";
import React from "react";

export default function Home() {

    const [adminCount,setAdminCount] = React.useState()
    const [employeeCount,setEmployeeCount] = React.useState()
    const [sumSalary,setSumSalary] = React.useState();
    React.useEffect(()=>{
        axios.get("http://localhost:5000/adminCount")
        .then(res=>{
            if(res.data.status==="Success")
                setAdminCount(res.data.result[0].admin);
                
        }).catch(err=>console.log(err));

        axios.get("http://localhost:5000/employeeCount")
        .then(res=>{
            if(res.data.status==="Success")
                setEmployeeCount(res.data.result[0].employee);
            
        }).catch(err=>console.log(err));

        axios.get("http://localhost:5000/salarySum")
        .then(res=>{
            if(res.data.status==="Success")
                setSumSalary(res.data.result[0].salary);
            
        }).catch(err=>console.log(err));
    
    },[])
    React.useEffect(()=>{
        
    },[])
    
    return (
        <div>
            <div className="p-3 d-flex justify-content-around mt-3">
                <div className="border shadow p-3 w-25 mt-4">
                    <div className="text-center">
                        <h4>Admin</h4>
                    </div>
                    <hr />
                    <div className="text-center">
                        <h5>Total : {adminCount}</h5>
                    </div>
                </div>
                <div className="border shadow p-3 w-25  mt-4">
                    <div className="text-center">
                        <h4>Employee</h4>
                    </div>
                    <hr />
                    <div className="text-center">
                        <h5>Total : {employeeCount}</h5>
                    </div>
                </div>
                <div className="border shadow p-3 w-25  mt-4">
                    <div className="text-center">
                        <h4>Salary</h4>
                    </div>
                    <hr />
                    <div className="text-center">
                        <h5>Total : {sumSalary}</h5>
                    </div>
                </div>
            </div>
            {/*List of Admins */}
            <div className="px-5 mt-5 pt-3"> 
                <h3>List Of Admins</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}