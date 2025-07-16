import React from "react";

export default function UserCard({user}) {
    console.log(user);
    const {firstname,lastname,About,age,gender,photoUrl}=user
    
  return (
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img
            src= {photoUrl}
            alt="pic"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstname + " " + lastname}</h2>
          {age && gender && <p>{age +", " + gender}</p>}
          {About && <p>{About}</p>}
          <div className="card-actions justify-center mt-3">
            <button className="btn btn-accent">Ignore</button>
            <button className="btn btn-primary">Intersted</button>
          </div>
        </div>
      </div>
  );
}
