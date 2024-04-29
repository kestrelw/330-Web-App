import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { increment, getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const favList = document.querySelector("#favorites-like-list");

const firebaseConfig = {
    apiKey: "AIzaSyBG8fgsc2a2aOHUrZUPeWeFxmCTwwmhQDQ",
    authDomain: "park-likes-f9bcb.firebaseapp.com",
    projectId: "park-likes-f9bcb",
    storageBucket: "park-likes-f9bcb.appspot.com",
    messagingSenderId: "741728139146",
    appId: "1:741728139146:web:898b1b0a274bf240673a73",
    //measurementId: "G-H7BXZCG2HZ"
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
    favList.innerHTML = "";
    snapshot.forEach(fav => {
        const childKey = fav.key;
        const childData = fav.val();
        console.log(childKey,childData);
        // TODO: update #favoritesList

        const newPark = document.createElement("a");
        newPark.className = "panel-block";
        newPark.innerHTML = `<span class="panel-icon"><i class="fas fa-map-pin"></i></span>${childKey} (${childData.id}) - Likes: ${childData.likes}`;
        favList.appendChild(newPark);

        //     favList.appendChild(`<a class="panel-block">
    //     <span class="panel-icon">
    //         <i class="fas fa-map-pin"></i>
    //     </span>
    //     Stoneybrook State Park
    // </a>`);
    });
};
  
const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');
    onValue(favoritesRef,favoritesChanged);
};
  

init();

export{writeParkNameData, deleteParkNameData}