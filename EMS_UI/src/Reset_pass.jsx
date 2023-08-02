import React,{useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function Reset_pass(){

    //axios.defaults.withCredentials=true;

    const [pwd,setPwd] = React.useState({
        password:"",
        cpassword:"",
    })

    const {id,token} =  useParams();
    const [error, setError]=React.useState('');

    const navigate = useNavigate();

    function handleChange(event){
        const {name,type,value} = event.target;
        setPwd(prevDetail=>{
            return {
                ...prevDetail,
                [name] : value,
            }
        })
    }

    useEffect(()=>{
        axios.get(`http://localhost:5000/reset_pass/${id}/${token}`)
        .then(res=>{
            if(res.data.status==="Error")
                setError(res.data.data);
        })
        .catch(err=>console.log(err));
    },[])

    /* function handleSubmit(event){
        event.preventDefault();
        
        axios.post(`http://localhost:5000/reset_pass/${id}/${token}`,loginDetail)
        .then(res=>{
            
            if(res.data.status === "Error"){
                setError(res.data.data);
                
            }
            else{
                setError('');
                //navigate('/employeedetail/'+res.data.id);
            }
        })
        .catch(err=>console.log(err));

        
    } */

    return(
        <div className='login--page'>    
                {   error!=''?
                    (<div className='login--error'>
                        {error}
                    </div>):
                    (
                    <form  className='login--form  p-4' onSubmit={handleSubmit} method='post'>
                    <h2 className='login--head mb-4'>Employee Login</h2>
                
                        <div className="form-outline mb-4">
                            <input type="password" className="form-control" name="password" value={pwd.password} onChange={handleChange} placeholder='Password' />
                            
                        </div>

                        
                        <div className="form-outline mb-4">
                            <input type="password" className="form-control" name="cpassword" value={pwd.cpassword} onChange={handleChange} placeholder='Confirm Password'/>
                            
                        </div>

                        <button className="btn btn-primary btn-block mb-4 login--btn">Reset</button>)
                    </form>)  

                }  
            
        </div>
    )
}