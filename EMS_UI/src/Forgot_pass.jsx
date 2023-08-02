import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"


export default function Forgot_pass(){

    //axios.defaults.withCredentials=true;

    const [loginDetail,setLoginDetail] = React.useState({
        email:"",
    })
    const [error, setError]=React.useState('');

    const navigate = useNavigate();

    function handleChange(event){
        const {name,type,value} = event.target;
        setLoginDetail(prevDetail=>{
            return {
                ...prevDetail,
                [name] : value,
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        
        axios.post('http://localhost:5000/send_pas_mail',loginDetail)
        .then(res=>{
            console.log(res)
            if(res.data.status === "Error"){
                setError(res.data.data);
                
            }
            else{
                setError('');
                toast.success("Check Your Mail");
            }
        })
        .catch(err=>toast.error("Error. Try Again"));

        
    }

    return(
        <div className='login--page'>
           <ToastContainer position='bottom-center' limit={1} /> 
            <form  className='login--form  p-4' onSubmit={handleSubmit} method='post'>
                <h2 className='login--head mb-4'>Employee Login</h2>
                <div className='login--error'>
                    {error}
                </div>
                <div className="form-outline mb-4">
                    <input type="email" className="form-control" name="email" value={loginDetail.email} onChange={handleChange} placeholder='Email Address' />
                    
                </div>


                
                <button className="btn btn-primary btn-block mb-4 login--btn">Login</button>

                
            </form>
        </div>
    )
}