import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){

    axios.defaults.withCredentials=true;

    const [loginDetail,setLoginDetail] = React.useState({
        email:"",
        password:"",
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
        axios.post('http://localhost:5000/login',loginDetail)
        .then(res=>{
            if(res.data.status === "Error"){
                setError(res.data.error);
            }
            else{
                setError('');
                navigate('/');
            }
        })
        .catch(err=>console.log(err));

        
    }

    return(
        <div className='login--page'>
            
            <form  className='login--form  p-4' onSubmit={handleSubmit} method='post'>
                <h2 className='login--head mb-4'>Login</h2>
                <div className='login--error'>
                    {error}
                </div>
                <div className="form-outline mb-4">
                    <input type="email" className="form-control" name="email" value={loginDetail.email} onChange={handleChange} placeholder='Email Address' />
                    
                </div>

                
                <div className="form-outline mb-4">
                    <input type="password" className="form-control" name="password" value={loginDetail.password} onChange={handleChange} placeholder='Password'/>
                    
                </div>

                
                <div className="row mb-4">

                    <div className="col">
                    
                    <a href="#!" className='login-links'>Forgot password?</a>
                    </div>
                </div>

                
                <button className="btn btn-primary btn-block mb-4 login--btn">Login</button>

                
            </form>
        </div>
    )
}