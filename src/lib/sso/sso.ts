/**
 * Created by adam on 2016/12/30.
 */

let $ = require('jquery');

export class SSO {
    static login(casClientHost: string, returnUrl: string) {
        window.location.href = casClientHost + "login?returnUrl=" + returnUrl;
    }
    static logout(casClientHost: string, returnUrl: string, success: Function, error: any) {
        $.ajax({
            url: casClientHost + "logout",
            dataType: "json",
            success: function (data: any) {
                //$("#validate").text(data.status);
                if (success)
                    success();

                if (returnUrl)
                    window.location.href = returnUrl;

            },
            error: function (e: Error) {
                if (error)
                    error();

                console.log(e);
            }
        });
    }
}




// window.SSO = (function () {

//     var login = function (casClientHost, returnUrl) {
//         window.location.href = casClientHost + "login?returnUrl=" + returnUrl;
//     };

//     var logout = function (casClientHost, returnUrl, success, error) {
//         $.ajax({
//             url: casClientHost + "logout",
//             dataType: "json",
//             success: function (data) {
//                 //$("#validate").text(data.status);
//                 if (success)
//                     success();

//                 if (returnUrl)
//                     window.location.href = returnUrl;

//             },
//             error: function (e) {
//                 if (error)
//                     error();

//                 console.log(e);
//             }
//         });
//     };

//     return {
//         login: login,
//         logout: logout
//     };
// })();
