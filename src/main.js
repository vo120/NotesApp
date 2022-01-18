//Reference to main application container
const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

//for every single note that exist in local storage, gets it and then inserts it before plus sign
getNotes().forEach(note =>{
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.insertBefore(noteElement, addNoteButton); //inserts note element before the plus sign
});

//EventListener for addNoteButton
addNoteButton.addEventListener("click", () => addNote());

//Retrieves all of the existing notes in the local storage from the clients browser
function getNotes(){
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]"); //gets all of the notes stores in app or default to array if its user's 1st time making notes
}

//Takes an array of notes, stringifies it as JSON, then saves the new notes to the local storage on the client's browser
function saveNotes(notes){
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

//Builds a new element(html element) to represent a note; provided with an id and the content for the note with that id
function createNoteElement(id, content){
    const element = document.createElement("textarea");

    element.classList.add("note");
    element.value = content;
    element.placeholder = "Empty Sticky Note";

    //adding an eventlistener for when user changes content in a note
    element.addEventListener("change", () =>{
        updateNote(id, element.value); //contains the most recently updated textarea contents
    });

    //adding an eventlistener for when user double clicks with intention of deleting note
    element.addEventListener("dblclick", () =>{
       const doDelete = confirm("Are you sure you wish to delete this sticky note?"); //checks if user actually intented to delete note

        if(doDelete){
            deleteNote(id, element);
        }
    });

    return element;
}

//Adds a new notes to the html & saves it to the local storage
function addNote(){
    const notes = getNotes(); //gets existing notes to add new note object to existing notes array & then resave the array
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton); //adding notes elements to page so it's visible to the user

    notes.push(noteObject); //pushes in the new note
    saveNotes(notes);
};

//Updates the notes;  provided with an id and the new content for the note with that id
function updateNote(id, newContent){
    const notes = getNotes();  //gets list of existing notes
    const targetNote = notes.filter(note => note.id == id)[0]; //if the note.id == the id which you're trying to pass in
    // then it's good; filtering out to provide notes with the same id as the one you pass in; index 0 to get 1st element

    targetNote.content = newContent;
    saveNotes(notes);
}

//Deletes notes; takes in an id & the html element for that particular note
function deleteNote(id, element){
    const notes = getNotes().filter(note => note.id != id); //filtering notes without same id as ones you're passing in

    saveNotes(notes);
    notesContainer.removeChild(element);  //physically removes notes or textarea from the page
}