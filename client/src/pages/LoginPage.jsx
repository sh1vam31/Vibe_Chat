import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
// import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    // const navigate = useNavigate(); 

    const [currState,setCurrState] = useState("Sign up")
    const [fullName,setfullName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [bio,setBio] = useState("")
    const [isDataSubmitted,setIsDataSubmitted] = useState(false)

    const {login} = useContext(AuthContext)

    const onSubmitHandler = async (event) => {
     event.preventDefault();

     if(currState === 'Sign up' && !isDataSubmitted){
        setIsDataSubmitted(true)
        return;
     }
      try {
      await login(currState === 'Sign up' ? 'signup' : 'login', {
        fullName,
        email,
        password,
        bio,
      });

    //   navigate('/'); // ✅ Step 3: Navigate after successful login/signup
    } catch (error) {
      console.error('Login error:', error.message);
      // optionally show error message to user
    }
    }
    
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

        {/* ---------left--------- */}
        <img src={assets.logo_icon} alt="" className='w-[min(30vw,250px)] max-w-44 aspect-square  mx-10 max-sm:mt-10 transition-transform duration-300 ease-in-out hover:scale-150 hover:rotate-1 hover:shadow-xl ' />

        {/* ---------- Right ----------- */}
        
        <form onSubmit={onSubmitHandler} action="" className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
            {currState }
            {isDataSubmitted &&  <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='cursor-pointer w-5' />  }
           
        </h2>


        {currState === "Sign up" && (
             <input onChange={(e)=> setfullName(e.target.value)} value={fullName}
              type="text"className='p-2 border border-gray-500 rounded-md focus:outline-none focus:rinf-2 focus:ring-indigo-500' placeholder='Full Name' required />)}

   {/* ---------------       Directly create Login too with email and password because in span isDataSubmitted = false --------------- */}

        {!isDataSubmitted && (
            <>
            <input onChange={ (e)=> setEmail(e.target.value) }  value={email}
             type="email" placeholder='Email ' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:rinf-2 focus:ring-indigo-500' />

             <input onChange={ (e)=> setPassword(e.target.value) }  value={password}
             type="password" placeholder='password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:rinf-2 focus:ring-indigo-500' />

            </>
        )}  
        {
            currState === "Sign up" && isDataSubmitted && (
                <textarea onChange={ (e)=> setBio(e.target.value)} value={bio}
                 rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:rinf-2 focus:ring-indigo-500'></textarea>
            )
        }  
        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer' >
            {currState === "Sign up"? "Create Account" : "Login Now"}
            </button> 
            
            <div className='flex items-center gap-2 text-sm text-gray-500' >
                <input type="checkbox" required/>
                <p>Agree to the terms of use & privacy policy .</p>
            </div>
            <div className='flex flex-col gap-2'>
                {currState ==='Sign up' ? (
                    <p className='text-sm text-gry-600'> Already have an Account <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)} } className='font-medium text-violet-500 cursor-pointer'>Login here...</span></p>
                ):(
                    <p className='text-sm text-gry-600'> Create an Account <span onClick={ ()=> {setCurrState("Sign up"); }} className='font-medium text-violet-500 cursor-pointer'>Sign Up here </span></p>
                ) }
            </div>
        </form>

    </div>
  )
}

export default LoginPage