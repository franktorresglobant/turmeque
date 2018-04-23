<template>
    <div id="app">
        <div id="gSignInWrapper">
            <span class="label">Sign in with:</span>
            <div id="customBtn" class="customGPlusSignIn" @click="startApp()">
            <span class="icon"></span>
            <span class="buttonText">Google</span>
            </div>
        </div>
        <div id="name"></div>
    </div>
</template>

<script>
export default {
  data(){
      return{
          test: "working",
          notCredentials: true,
          auth2: {}
      }
  },
  created: function(){
        this.doAutoLogin();
        // this.startApp();
  },
  methods: {
      doAutoLogin: function(){
          window.onGoogleYoloLoad = (googleyolo) => {
            const hintPromise = googleyolo.hint({
                supportedAuthMethods: [
                    "https://accounts.google.com"
                ],
                supportedIdTokenProviders: [{
                    uri: "https://accounts.google.com",
                    clientId: "502255920374-0302cci9apl0caelera22fbug6ulckm0.apps.googleusercontent.com"
                }],
                context: 'signIn'
            })

            hintPromise.then((credential) => {
                if (credential.idToken) {
                    // Send the token to your auth backend.
                    useGoogleIdTokenForAuth(credential.idToken);
                }
                }, (error) => {
                switch (error.type) {
                    case "userCanceled":
                        // The user closed the hint selector. Depending on the desired UX,
                        // request manual sign up or do nothing.
                        console.log("userCanceled");
                    break;
                    case "noCredentialsAvailable":
                    // No hint available for the session. Depending on the desired UX,
                    // request manual sign up or do nothing.
                        console.log("noCredentialsAvailable");
                        var self = this;
                        this.notCredentials = true;
                        this.startApp();
                    break;
                    case "requestFailed":
                    // The request failed, most likely because of a timeout.
                    // You can retry another time if necessary.
                        console.log("requestFailed");
                    break;
                    case "operationCanceled":
                    // The operation was programmatically canceled, do nothing.
                    break;
                    case "illegalConcurrentRequest":
                    // Another operation is pending, this one was aborted.
                        console.log("illegalConcurrentRequest");
                    break;
                    case "initializationError":
                    // Failed to initialize. Refer to error.message for debugging.
                        console.log("initializationError");
                    break;
                    case "configurationError":
                    // Configuration error. Refer to error.message for debugging.
                        console.log("initializationError");
                    break;
                    default:
                    // Unknown error, do nothing.
                }
            });
        }
    },
    doLogin: function(googleUser){
        console.log("doLogin");
        var profile = googleUser.getBasicProfile();
        console.log(profile.getId());
    },
    startApp: function(){
        var self = this;
        gapi.load('auth2', function(){
            self.auth2 = gapi.auth2.init({
                client_id: '502255920374-0302cci9apl0caelera22fbug6ulckm0.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin'
            });
            self.attachSignin(document.getElementById('customBtn'));
        });
    },
    attachSignin(element){
        this.auth2.attachClickHandler(element, {},
            function(googleUser){
                document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
            }, function(error){
                console.log(JSON.stringify(error, undefined, 2));
            });
    }
  }
}
</script>
<style type="text/css">
    #customBtn {
      display: inline-block;
      background: white;
      color: #444;
      width: 190px;
      border-radius: 5px;
      border: thin solid #888;
      box-shadow: 1px 1px 1px grey;
      white-space: nowrap;
    }
    #customBtn:hover {
      cursor: pointer;
    }
    span.label {
      font-family: serif;
      font-weight: normal;
    }
    span.icon {
      background: url('/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
      display: inline-block;
      vertical-align: middle;
      width: 42px;
      height: 42px;
    }
    span.buttonText {
      display: inline-block;
      vertical-align: middle;
      padding-left: 42px;
      padding-right: 42px;
      font-size: 14px;
      font-weight: bold;
      /* Use the Roboto font that is loaded in the <head> */
      font-family: 'Roboto', sans-serif;
    }
  </style>