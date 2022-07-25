import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ExploreAll from '../ExploreAll'
import Cookie from "js-cookie"
import Footer from '../Footer'
import Navbar from '../Navbar'
import SideBar from '../SideBar'
import PostSkeleton from '../Skeleton/PostSkeleton'


function LikedPost() {

  const [loading, setLoading] = useState(false)
  const [likePost, setLikePost] = useState([])

  const config ={
    headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${Cookie.get('token')}`
    }
  }

  useEffect(() => {
    const getPost = async() =>{
      try {
          const {data} = await axios.get("http://localhost:3001/api/post/liked/Post",config)
          setLoading(true)
          setLikePost(data)
      } catch (error) {
          console.log(error?.response?.data);
      }
    }
    getPost()
    
  },[] )

  return (
    <>
    <Navbar/>
    <div className='flex justify-between bg-[#2D3B58]'>
        <div>
          <SideBar/>
        </div>
       {!loading ?<div className='flex flex-col md:p-0  md:items-center h-[calc(100vh-4.3rem)]  md:h-[calc(100vh-2.7rem)] overflow-y-scroll md:border md:border-x-0 md:border-r-2 md:border-[#BED7F8] md:border-t-0 flex-auto mb-2 md:mb-0'>
            {likePost?.map((l) =>(
              <ExploreAll key={l._id} exploreAll={l}/>
            ))}
        </div>:<div className='flex flex-col md:p-0  md:items-center h-[calc(100vh-4.3rem)]  md:h-[calc(100vh-2.7rem)] overflow-y-scroll md:border md:border-x-0 md:border-r-2 md:border-[#BED7F8] md:border-t-0 flex-auto mb-2 md:mb-0'>
            {likePost?.map((l) =>(
              <PostSkeleton key={l._id}/>
            ))}
        </div>}
        
      </div>
    <Footer/>    
    </>
  )
}

export default LikedPost