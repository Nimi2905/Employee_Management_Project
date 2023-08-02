import React from "react";
import { useNavigate } from "react-router-dom";

export default function Start(){
    const navigate = useNavigate();
    return(
        <div className='login--page'>
            
            <form  className='login--form  p-4 text-center '  method='post'>
                <h2 className='login--head mb-4'>Login As</h2>
                <div className="d-flex justify-content-between mt-5">
                    <button className="btn btn-primary btn-lg" onClick={()=>navigate('/employeeLogin')}>Employee</button>
                    <button className="btn btn-success  btn-lg" onClick={()=>navigate('/login')}>Admin</button>
                </div>
           </form>
        </div>
    )
}