
import Login from './Login'
import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Home from './Home';
import Employee from './Employee';
import AddEmployee from './AddEmployee';
import EmployeeEdit from './EmployeeEdit';
import Start from './Start';
import EmployeeLogin from './EmployeeLogin';
import EmployeeDetail from './EmployeeDetail';
import FullEditEmp from './FullEditEmp';
import Forgot_pass from './Forgot_pass';
import Reset_pass from './Reset_pass';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route path='' element={<Home />}></Route>
          <Route path='/employee' element={<Employee />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/create' element={<AddEmployee />}></Route>
          <Route path='/employeeEdit/:id' element={<EmployeeEdit />}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/start' element={<Start />}></Route>
        <Route path="/employeeLogin" element={<EmployeeLogin/>}></Route>
        <Route path="/forgot_pass" element={<Forgot_pass />}></Route>
        <Route path="/employeedetail/:id" element={<EmployeeDetail/>}></Route>
        <Route path='/empEdit/:id' element={<FullEditEmp />}></Route>
        {/* <Route path='/reset_pass/:id/:token' element={<Reset_pass />}></Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
