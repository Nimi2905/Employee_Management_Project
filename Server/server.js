import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();



//middleware
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["http://localhost:5173","http://localhost:5173/create"],
        methods: ["POST", "GET", "PUT" , "DELETE"],
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"signup",
    multipleStatements:true,
})

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({
    storage:storage,
})

con.connect(function(err){
    if(err){
        console.log("Not connected");
    }
    else{
        console.log("Connected");
    }
})

//api

const verifyUser=(req,res,next)=>{
    const token =  req.cookies.token;
    if(!token){
        return res.json({Error:"You are not authenticated"});
    }
    else{
        jwt.verify(token , "jwt-secret-key", (err,decoded)=>{
            if(err) return res.json({status:"Error"});
            req.role=decoded.role;
            req.id=decoded.id;
            next();
        })
        
    }
}
app.get('/dashboard',verifyUser,(req,res)=>{
    
    return res.json({status:"Success",role:req.role,id:req.id});
})

app.get('/employee/:id',verifyUser,(req,res)=>{
    return res.json({status:"Success",role:req.role,id:req.id});
})

app.post('/login',(req,res)=>{
    const sql="Select * from users where email = ? AND password = ?";
    con.query(sql, [req.body.email,req.body.password],(err,result)=>{
        if(err) return res.json({status:"Error",error:"Problem in connection"});
        if(result.length > 0){
            const id = result[0].id;
            const token = jwt.sign({role:"admin"},"jwt-secret-key",{expiresIn:"1d"});
            res.cookie('token',token);
            return res.json({status: "Success"});
        }
        else{
            return res.json({status:"Error",error:"Invalid Credentials"});
        }
    })
})

app.post('/employeelogin',(req,res)=>{
    const sql="Select * from employee where email = ?";
    con.query(sql, [req.body.email],(err,result)=>{
        if(err) return res.json({status:"Error",error:"Problem in connection"});
        if(result.length > 0){
            bcrypt.compare(req.body.password.toString(), result[0].password , (err,response)=>{
                if(err) return res.json({status:"Error",error:"Wrong Password"});
                if(response){
                    const id = result[0].Id;
                    const token = jwt.sign({role:"employee",id :id},"jwt-secret-key",{expiresIn:"1d"});
                    res.cookie('token',token);
                    
                    return res.json({status: "Success",id : id});
                }
                else{
                    return res.json({status:"Error",error:"Wrong Email or Password"});
                }
            })
            
        }
        else{
            return res.json({status:"Error",error:"Invalid Credentials"});
        }
    })
})


app.get('/adminCount',(req,res)=>{
    const sql = "select count(Id) as admin from users";
    con.query(sql,(err,result)=>{
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success",result:result});
    })
})

app.get('/employeeCount',(req,res)=>{
    const sql = "select count(Id) as employee from employee";
    con.query(sql,(err,result)=>{
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success",result:result});
    })
})

app.get('/salarySum',(req,res)=>{
    const sql = "select sum(salary) as salary from employee";
    con.query(sql,(err,result)=>{
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success",result:result});
    })
})


app.post('/create',upload.single('image'),(req,res)=>{
    const sql = "Insert into employee (name,email,password,salary,address,image) Values (?)";
    bcrypt.hash(req.body.password.toString(),10,(err,hash)=>{
        if(err){
            return res.json({Error:"Error in hashing password"});
        }
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.salary,
            req.body.address,
            req.file.filename,
        ]
        con.query(sql,[values],(err,result)=>{
            if(err) return res.json({Error:"Inside signup query"});
            return res.json({status: "Success"});
        })
    })
})

//mail start

app.post('/send_mail',cors(),(req,res)=>{
    //let {text} = req.body;
    
    const transport = nodemailer.createTransport({
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT,
        secure: true,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS,
        }
    })
    
    transport.sendMail({
        from:process.env.MAIL_FROM,
        to:req.body.email,
        subject:"Employee User Id & Password",
        html:`<p>Dear ${req.body.name}</p>
              <p>Your Email Id: ${req.body.email} and password: ${req.body.password}</p>
        `,
    }, (err,body)=>{
        
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success"});
    })
})

//mail end
//password mail

app.post('/send_pas_mail',cors(),(req,res)=>{
    //let {text} = req.body;
    
    const sql = "Select * from employee where email=?";

    const transport = nodemailer.createTransport({
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT,
        secure: true,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS,
        }
    })

    con.query(sql,[req.body.email],(err,result)=>{
        if(err) return res.json({status:"Error"})
        if(result==0) return res.json({status:"Error",data:"Email is not registered"});
        const token = jwt.sign({email:result[0].email, id:result[0].Id},"jwt-secret-key",{expiresIn:"5m"});
        const link = `http://localhost:5000/reset_pass/${result[0].Id}/${token}`;
        
        transport.sendMail({
            from:process.env.MAIL_FROM,
            to:req.body.email,
            subject:"Employee User Id & Password",
            html:`<p>Dear ${result[0].name}</p>
                  <p>Clink on given link to reset password.:<br>${link}<br>
                  Link will expire in 10 minutes.
                  </p>
            `,
        }, (err,body)=>{
            
            if(err) return res.json({status:"Error"});
            return res.json({status:"Success"});
        }) 
    })
    
    
    
})

app.get('/reset_pass/:id/:token',(req,res)=>{
    const {id,token} = req.params;
    //console.log(req.params);
    const sql = "Select * from employee where Id=?";

    con.query(sql,[id],(err,result)=>{
        if(err) return res.json({status:"Error"});
        if(result==0) return res.json({status:"Error",data:"User is not registered"});
        else{
            jwt.verify(token , "jwt-secret-key", (err,decoded)=>{
            if(err) return res.json({status:"Error",data:"User Not Verified"});
            res.render("index",{email:decoded.email});
            });
        }
    })

})


app.post('/reset_pass/:id/:token',(req,res)=>{
    const {id,token} = req.params;
    const {password} =req.body;
    let sql = "Select * from employee where Id=?";

    con.query(sql,[id],(err,result)=>{
        if(err) return res.json({status:"Error"});
        if(result==0) return res.json({status:"Error",data:"User is not registered"});
        else{
            jwt.verify(token , "jwt-secret-key", (err,decoded)=>{
            if(err) return res.json({status:"Error",data:"User Not Verified"});
            sql = "update employee set password = ? where email = ?";
            bcrypt.hash(password.toString(),10,(err,hash)=>{
                if(err) return console.log("Error");
                con.query(sql,[hash,decoded.email],(err,result)=>{
                    if(err) return res.json({status:"error"});
                    return res.send("Your Password is succesfully Reset. You can Login Now");
                })
            })
            });
        }
    })

})
//end mail

app.get('/getEmployee',(req,res)=>{
    const sql = "Select * from employee";
    con.query(sql,(err,result)=>{
        if(err) return res.json({Error:"Error in fetching data"});
        return res.json({status:"Success",Result:result});
    })
})

app.get('/get/:id',(req,res)=>{
    const sql = "Select * from employee where Id = ?";
    con.query(sql,[req.params.id],(err,result)=>{
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success",Result:result});
    })
})

app.put('/update/:id',(req,res)=>{
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        id,
    ]
    
    const sql = "Update employee set name = ? , email = ? , salary = ? , address= ?  where Id = ?";
    con.query(sql , [...values], (err,result)=>{
        if(err) return res.json({status : "Error"});
        return res.json({status:"Success"});
    })
})

app.put('/updateEmp/:id',upload.single('image'),(req,res)=>{
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
    ]
    
    let sql;
    
    if(req.file==null)
        sql= "Update employee set name = ? , email = ? , salary = ? , address= ?  where Id = ?";
    else{
        sql= "Update employee set name = ? , email = ? , salary = ? , address= ? , image = ?  where Id = ?";
        values.push(req.file.filename);
    }
    con.query(sql , [...values,id], (err,result)=>{
        if(err) return res.json({status : "Error"});
        return res.json({status:"Success"});
    })
})
app.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    const sql="Delete from employee where id = ?";
    con.query(sql,[id],(err,result)=>{
        if(err) return res.json({status:"Error"});
        return res.json({status:"Success"});
    })
})

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    return res.json({status:"Success"});
})
app.listen(5000,()=>{
    console.log("Localhost at 5000");
})