import React from 'react'
import EditProfile from './EditProfile'
import {useSelector} from "react-redux"
import UserCard from './UserCard'

export default function Profile() {
  const user=useSelector((store)=> store.user)
  return (
    user && 
    <div className="min-h-[calc(100vh-6rem)] flex justify-center px-4 py-10">
  <EditProfile user={user} />
</div>


  )
}
