import React,{useState,useContext,useEffect} from 'react'
import { StyleSheet, Text, View,Image } from 'react-native'
import * as yup from 'yup'; 
import jwt_decode from "jwt-decode";


import Screen from "../Components/Screen"
import AppForm from '../Components/AppForm'
import AppFormField from '../Components/AppFormField'
import SubmitBtn from '../Components/AppFormSubmitBtn'
import AppErrorMessage from '../Components/AppErrorMessage';
import authApi from "../api/auth"
import AuthContext from '../auth/authContext';
import authStore from "../auth/authStore"
import useAuth from "../auth/useAuth"
import useApi from "../hooks/useApi"

export default function LoginScreen() {

    const [loginFailed,setLoginFailed]=useState(false)
    const {user,setUser,logIn} = useAuth();
    const loginApi=useApi(authApi.login);

    let loginSchema = yup.object().shape({
        email: yup.string().required("Email is a required field.").email("Email must be valid."),
        password:yup.string().required("Password is a required field.").min(5,"Password must be at least 6 characters.")
    });

    const handleSubmit=async ({email,password})=>{
    
        const response=await loginApi.request(email,password)
        if(!response.ok) return setLoginFailed(true)
        setLoginFailed(false)
        logIn(response)
        
    }
    return (
        <Screen>
            <View style={styles.container}>
                <Image source={require('../assets/logo-red.png')} style={styles.logo}/>
                <AppErrorMessage error="Email or Password not valid" visible={loginFailed} style={{marginBottom:5}}/>
                <AppForm initialValues={{email: '',password:''}} schema={loginSchema} onSubmit={handleSubmit}>
                    <AppFormField
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="email"
                        autoCapitalize="none"
                        autoCompleteType="off" 
                        autoCorrect={false}
                        keyboardType= "email-address"
                    />   
                    <AppFormField
                        name="password"
                        placeholder="Password"
                        icon="lock"
                        autoCapitalize="none"
                        autoCompleteType="off" 
                        secureTextEntry
                    />   
                    <SubmitBtn/>
                </AppForm>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:15
    },
    logo:{
        width:70,
        height:70,
        alignSelf:"center",
        marginVertical:20
    }
})
