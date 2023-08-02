import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


export default function EmployeeDetail(){
    axios.defaults.withCredentials=true;
    const {id}=useParams();
    const [emp,setEmp] =React.useState({});
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get("http://localhost:5000/employee/"+id)
        .then(
            res=>{
                
                if(res.data.status === "Success"){
                    if(res.data.role === 'employee'){}
                    else{
                        navigate('/')
                    }
                }
                else{
                    navigate('/start');
                }
            }
        )
        .catch(err=>console.log(err));
        
        axios.get("http://localhost:5000/get/"+id)
        .then(res=>{
            setEmp(res.data.Result[0]);
        })
        .catch(err=>console.log(err));
    },[])

    function handleEmpLogout(){
        axios.get("http://localhost:5000/logout")
        .then(res=>{
            if(res.data.status==="Success")
                navigate('/start')
        })
        .catch(err=>console.log(err));
    }

    return(
        <div>
            <img src={`http://localhost:5000/images/${emp.image}`} className='empImg' />
            <div className="text-center">
                <h4>{emp.name}</h4>
                <h4>{emp.address}</h4>
                <h4>Salary: {emp.salary}</h4>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-3 text-center">
                <Link to={`/empEdit/${emp.Id}`} className="btn btn-sm btn-primary">Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={handleEmpLogout}>Logout</button>
            </div>
        </div>
    )
}