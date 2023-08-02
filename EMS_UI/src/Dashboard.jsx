import React, { useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Dashboard(){

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get("http://localhost:5000/dashboard")
        .then(
            res=>{
                if(res.data.status === "Success"){
                    if(res.data.role === 'admin'){

                    }
                    else{
                        navigate('/employeedetail/'+res.data.id)
                    }
                }
                else{
                    navigate('/start');
                }
            }
        )
        .catch(err=>console.log(err));
    },[])

    function handleLogout(){
        axios.get("http://localhost:5000/logout")
        .then(res=>{
            if(res.data.status==="Success")
                navigate('/start');
        })
        .catch(err=>console.log(err));
    }

    return(
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <h1 className="fs-5 d-none d-sm-inline">ADMIN Dashboard</h1>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </Link>
                            </li>
                            <li>
                                <Link to="/employee" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Employee</span></Link>
                            </li>
                            
                            <li>
                                <Link to="/Profile" className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Profile</span> </Link>
                            </li>
                            <li onClick={handleLogout}>
                                <Link className="nav-link px-0 align-middle text-white">
                                    <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span> </Link>
                            </li>
                        </ul>
                        
                        
                    </div>
                </div>
                
                <div className="col py-3">
                    <div className="p-2 shadow d-flex justify-content-center">
                        <h4>Employee Management System</h4>
                    </div>   
                    <Outlet /> 
                </div>
            </div>
        </div>
    )
}