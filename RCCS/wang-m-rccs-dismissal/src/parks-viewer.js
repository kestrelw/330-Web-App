import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { increment, getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const unreleasedList = document.querySelector("#student-unreleased-list");
const releasedList = document.querySelector("#student-released-list");

// const firebaseConfig = {
//     apiKey: "AIzaSyBG8fgsc2a2aOHUrZUPeWeFxmCTwwmhQDQ",
//     authDomain: "park-likes-f9bcb.firebaseapp.com",
//     projectId: "park-likes-f9bcb",
//     storageBucket: "park-likes-f9bcb.appspot.com",
//     messagingSenderId: "741728139146",
//     appId: "1:741728139146:web:898b1b0a274bf240673a73",
//     //measurementId: "G-H7BXZCG2HZ"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCwZn_XlxwvfFiovRDOEufspsib7ohxlXs",
    authDomain: "rccs-demo-test-f1a44.firebaseapp.com",
    projectId: "rccs-demo-test-f1a44",
    storageBucket: "rccs-demo-test-f1a44.appspot.com",
    messagingSenderId: "24614923069",
    appId: "1:24614923069:web:90b13cdaae9087586ff354"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);// make sure firebase is loaded

const writeParkNameData = (name, id) => {
    const db = getDatabase();
    const favRef = ref(db, 'favorites/' + name, 'favorites/' + id);
    set(favRef, {
        name,
        id,
        likes: increment(1)
    });
    console.log("like added")
};

const deleteParkNameData = (name, id) => {
    const db = getDatabase();
    const favRef = ref(db, 'favorites/' + name, 'favorites/' + id);
    set(favRef, {
        name,
        id,
        likes: increment(-1)
    });
};
  
const favoritesChanged = (snapshot) => {
// TODO: clear #favoritesList
    //if(unreleasedList != null){


        // unreleasedList.innerHTML = "";
        // releasedList.innerHTML = "";
        // snapshot.forEach(fav => {
        //     const childKey = fav.key;
        //     const childData = fav.val();
        //     console.log(childKey,childData);
        //     // TODO: update #favoritesList
            
        //         const newStudent = document.createElement("a");
        //         newStudent.className = "panel-block";
        //         newStudent.innerHTML = `<span class="panel-icon">
        //                 <i class="fas fa-map-pin"></i>
        //             </span>
        //             ${childKey} (Grade: ${childData.grade}).......
        //                 <span class="is-pulled-right">
        //                     <button id="btn-add" class="button is-success">
        //                         <span class = "material-symbols-outlined">Add</span>
        //                     </button>
        //                 </span>
        //                 `;
        //         if(childData.status == "unreleased"){
        //             unreleasedList.appendChild(newStudent);
        //         }
        //         else{
        //             releasedList.appendChild(newStudent);
        //         }
                
            
            

        //     //     unreleasedList.appendChild(`<a class="panel-block">
        // //     <span class="panel-icon">
        // //         <i class="fas fa-map-pin"></i>
        // //     </span>
        // //     Stoneybrook State Park
        // // </a>`);
        // });


    //}
};
  
const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'Students/');
    onValue(favoritesRef,favoritesChanged);
};
  

init();

export{writeParkNameData, deleteParkNameData}