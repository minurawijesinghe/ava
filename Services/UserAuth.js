import { Auth } from 'aws-amplify';
import HttpClient from './HttpClient';

export function UserSignIn(username, password) {
    return Auth.signIn(username, password)
}

export function UserSignUp(username, password, name) {
    return Auth.signUp({
        username,
        password,
        attributes: { name: name, phone_number: username, "custom:status": "PENDING", "custom:type": "SALON" },
        validationData: []  //optional
    })
}

export function UserSignOut() {
    return Auth.signOut()
        .then(data => {
            return data
        })
        .catch(err => { });
}

export function UserVerification(phone_number, code) {
    return HttpClient.put('/util/otp', {

        phoneNumber: phone_number,
        code: code
    })
}

export function CreateUser(cogId, name, phone_number, email, address1, address2, city, logo, cover, midlat, midlng, description, number2) {
    return HttpClient.post('/salon/', {
        country: "Sri Lanka",
        lng: midlng,
        city: city,
        address2: address2,
        salonName: name,
        companyLogo: logo,
        address1: address1,
        phoneNumber1: phone_number,
        phoneNumber2: number2,
        description: description,
        cognitoUserId: cogId,
        companyCoverImage: cover,
        email: email,
        lat: midlat
    })
}

export function ChangePassword(oldPassword, newPassword) {
    return Auth.currentAuthenticatedUser()
        .then(user => {
            return Auth.changePassword(user, oldPassword, newPassword);
        })
    
}
export function userOTPvalidation(phone_number, code) {
    return HttpClient.post('/util/validate/otp', {
        phoneNumber: phone_number,
        code: code
    })
}

export function resendOTP(phone_number) {
    return HttpClient.get('/util/resend/otp',{
        params:{
            phoneNumber:phone_number
        }
    })
}

export function UpdatePassword(phone_number,code,passwordHash,type) {
    return HttpClient.put('/util/update/password', {
        phoneNumber:phone_number,
        code:code,
        passwordHash:passwordHash,
        type:type
    })
}

