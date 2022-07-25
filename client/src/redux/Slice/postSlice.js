import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allpost: null,
  followerPost:null,
  loading:false,
  likePost:null,
  bookmarkPost:null,
  error:false
}


export const PostSlice = createSlice({
      name: 'post',
      initialState,
      reducers: {
    postStart:(state) =>{
          state.loading=true
    },
    postSuccess:(state,action) =>{
        state.loading=false
        state.allpost= action.payload
    },
    postError:(state) =>{
        state.loading=false
        state.error=true
    },
    followerPostStart:(state) =>{
        state.loading=true
    },
    followerPostSuccess:(state,action) =>{
        state.loading=false
        state.followerPost= action.payload
    },
    followerPostError:(state) =>{
        state.loading=false
        state.error=true
    },
    likepostStart:(state) =>{
        state.loading=true
    },
    likepostSuccess:(state,action) =>{
        state.loading=false
        state.likePost= action.payload
    },
    likepostError:(state) =>{
        state.loading=false
        state.error=true
    },
    bookmarkedpostStart:(state) =>{
        state.loading=true
    },
    bookmarkedpostSuccess:(state,action) =>{
        state.loading=false
        state.bookmarkPost= action.payload
    },
    bookmarkedpostError:(state) =>{
        state.loading=false
        state.error=true
    }
},
})
    
export const { postStart,postSuccess,postError,followerPostStart,followerPostSuccess,followerPostError,likepostError,likepostStart,likepostSuccess,bookmarkedpostError,bookmarkedpostStart,bookmarkedpostSuccess} = PostSlice.actions


export default PostSlice.reducer    