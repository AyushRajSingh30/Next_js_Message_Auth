//this is method to redefine or modify next-auth modules and also a syntax
import 'next-auth'
import { DefaultSession } from 'next-auth';


//is method se hum log kisi bhi file ko redefine aur redecluare, modifi kar sakte hai kar sakte hai...
//jo file import kiye hai usi ke file ko modify kar sakte hai...

declare module 'next-auth' {
   //we redifine User Session We also add some new method
    interface User{
        _id?: string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string
    }

    interface Session{
        user:{
            _id?: string,
            isVerified?:boolean,
            isAcceptingMessages?:boolean,
            username?:string,
        } & DefaultSession['user']
    }
}

//second method for modify jwt 

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}


