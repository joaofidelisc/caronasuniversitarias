import React, { createContext, useState} from 'react';

export const AuthContext = createContext({})

//ignorar essa tela
//estou testando context api

function AuthProvider({children}){
    return(
        <AuthContext.Provider value={{nome: "JOAO"}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;