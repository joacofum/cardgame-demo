// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: "AIzaSyCuKphV0--vq2IGR08y_2RT2W4yZZOtf50",
    authDomain: "cardgame-93e8f.firebaseapp.com",
    projectId: "cardgame-93e8f",
    storageBucket: "cardgame-93e8f.appspot.com",
    messagingSenderId: "283729887039",
    appId: "1:283729887039:web:6b2aa89b621b2f1980dd8a"
  },
  production: false,
  apiBase: "http://localhost:8080",
  socketBase: "ws://localhost:8081/retrieve/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
