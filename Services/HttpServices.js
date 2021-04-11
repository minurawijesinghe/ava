import {HttpClient,ApiClient} from './HttpClient'

function postquery(query) {
    return ApiClient.post(`projects/secret-rope-269306/agent/sessions/me:detectIntent`, {
    
        ...query

    })
}
function postImage(image){
return HttpClient.post('/Classification/',{
    content:image
})
}


export const HttpService = {
    postquery,
    postImage



}
