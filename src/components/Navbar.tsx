"use client";
// useSession is frontend hook method for access session in fronted we also used getSession()
import React from "react";
import Link from "next/link";
import { useSession, signOut, getSession } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
//User authincation hai to session User ke under hota hai
function Navbar() {
  const { data: session } = useSession();

  //as User mean Acresion its mean we give defenatly User
  //beter understandion about session (https://next-auth.js.org/getting-started/client) || next auth
  const user: User = session?.user as User;
  // console.log("session",session);
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
