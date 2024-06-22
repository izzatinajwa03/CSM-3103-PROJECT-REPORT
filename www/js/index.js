document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

}

    document.addEventListener('DOMContentLoaded', function() {

    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('menu');
    const allNotesButton = document.getElementById('allNotesButton');
    const favouriteButton = document.getElementById('favouriteButton');
    const categoryButton = document.getElementById('categoryButton');
    const trashButton = document.getElementById('trashButton');
    const content = document.getElementById('content');
    const reminderIcon = document.getElementById('reminderIcon');
    const shareIcon = document.getElementById('shareIcon');
    const noteBoxesContainer = document.getElementById('noteBoxesContainer');
    const addNoteIcon = document.getElementById('addNoteIcon');
    
    const firebaseConfig = {
        apiKey: "AIzaSyDX4YzOoh8bggpRJqg2XkcnCy4OKu12bmo",
        authDomain: "notesproject-46bb0.firebaseapp.com",
        databaseURL: "https://notesproject-46bb0-default-rtdb.firebaseio.com",
        projectId: "notesproject-46bb0",
        storageBucket: "notesproject-46bb0.appspot.com",
        messagingSenderId: "90659896415",
        appId: "1:90659896415:web:d08bd9669dc05710efafea",
        measurementId: "G-ZPEX0X4F2Z"
      };

    const app = firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics();
    const database = firebase.database();

        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
        menuButton.addEventListener('click', function() {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        });
    
        allNotesButton.addEventListener('click', function() {
            content.innerHTML = '<h1>All Notes</h1><button onclick="goBack()">Back</button>';
        });
    
        favouriteButton.addEventListener('click', function() {
            window.location.href = 'favourite.html';
        });
        favouriteButton.addEventListener('click', function() {
            content.innerHTML = '<h1>Favourites</h1><button onclick="goBack()">Back</button>';
        });
    
        categoryButton.addEventListener('click', function() {
            content.innerHTML = '<h1>Categories</h1><ul><li>All</li><li>Home</li><li>Work</li></ul><button onclick="goBack()">Back</button>';
        });
    
        trashButton.addEventListener('click', function() {
            content.innerHTML = '<h1>Trash</h1><button onclick="goBack()">Back</button>';
        });
    
        reminderIcon.addEventListener('click', function() {
            content.innerHTML = '<h1>Reminders</h1><button onclick="goBack()">Back</button>';
        });
    
        shareIcon.addEventListener('click', function() {
            content.innerHTML = `
                <h1>Share as</h1>
                <div class="share-options">
                    <button id="shareText">Text Only</button>
                    <button id="sharePDF">PDF</button>
                    <button id="sharePicture">Picture</button>
                </div>
                <button onclick="goBack()">Back</button>
            `;
            
            document.getElementById('shareText').addEventListener('click', function() {
                shareText();
            });
    
            document.getElementById('sharePDF').addEventListener('click', function() {
                sharePDF();
            });
    
            document.getElementById('sharePicture').addEventListener('click', function() {
                sharePicture();
            });
        });
    
        // Function to handle adding notes to favourites and updating localStorage
       function addToFavourites(noteText) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites.push(noteText);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    saveNoteToFirebase(noteText);  // Save note to Firebase
    alert('Note added to favourites');
}

function addToTrash(noteText) {
    saveNoteToFirebase(noteText, 'trash');
    alert('Note added to trash');
}
    
        addNoteIcon.onclick = function() {
            const noteContainer = document.createElement('div');
            noteContainer.innerHTML = `
                <textarea class="note-box" placeholder="Write your note here..."></textarea>
                <div class="add-note-fav">
                    <button class="addtofav">Add to⭐</button>
                </div>
                <div class="add-note-trash">
                    <button class="addtotrash">Add to🗑️</button>
                </div><br>
            `;
            noteBoxesContainer.appendChild(noteContainer);

            // Add event listener to new buttons
            noteContainer.querySelector('.addtofav').addEventListener('click', function() {
                const noteText = noteContainer.querySelector('.note-box').value;
                addToFavourites(noteText);
            });

            noteContainer.querySelector('.addtotrash').addEventListener('click', function() {
                const noteText = noteContainer.querySelector('.note-box').value;
                addToTrash(noteText);
            });
        };

        function saveNoteToFirebase(noteText, category) {
        const dbRef = firebase.database().ref(`${category}/`);
        const newNoteRef = dbRef.push();
        newNoteRef.set({
            text: noteText,
            timestamp: Date.now()
        }).then(() => {
            console.log('Note saved to Firebase successfully!');
        }).catch((error) => {
            console.error('Error saving note to Firebase:', error);
        });
    }

    window.shareText = function() {
        alert('Sharing text...');
    };

    window.sharePDF = function() {
        alert('Sharing PDF...');
    };

    window.sharePicture = function() {
        alert('Sharing picture...');
    };

    window.goBack = function() {
        window.location.href = "example.html";
    };


        // Function to load notes from Firebase on page load
        function loadNotesFromFirebase() {
            const dbRef = firebase.database().ref('notes/');
            dbRef.on('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const noteData = childSnapshot.val();
                    displayNote(noteData.text);
                });
            });
        }

        function displayNote(noteText) {
        const noteContainer = document.createElement('div');
        noteContainer.innerHTML = `
            <textarea class="note-box" placeholder="Write your note here...">${noteText}</textarea>
            <div class="add-note-fav">
                <button class="addtofav">Add to⭐</button>
            </div>
            <div class="add-note-trash">
                <button class="addtotrash">Add to🗑️</button>
            </div><br>
        `;
        noteBoxesContainer.appendChild(noteContainer);

            noteContainer.querySelector('.addtofav').addEventListener('click', function() {
                addToFavourites(noteText);
            });
    
            noteContainer.querySelector('.addtotrash').addEventListener('click', function() {
                addToTrash(noteText);
            });
        }

        loadNotesFromFirebase();
    
        // Initialize favourites display on page load
        const favouriteNotesContainer = document.getElementById('favouriteNotes');
    
        favourites.forEach(note => {
            const noteElement = document.createElement('p');
            noteElement.textContent = note;
            favouriteNotesContainer.appendChild(noteElement);
        });
    });
