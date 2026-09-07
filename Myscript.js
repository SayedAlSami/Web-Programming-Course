let button = document.getElementById("my-button");
button.addEventListener("click", function()
{
   document.getElementById("text").textContent = "Hello world"; 
   document.getElementById("title").innerHTML = "Moi Maalima";
});

let mybutton = document.getElementById("add-data");
let textarea = document.getElementById("my-textarea");
mybutton.addEventListener("click", function()
{
    let listItem = document.createElement("li");
    if (textarea.value.trim() === "") 
        {
            listItem.innerHTML = "New entry";
        }
    
    else
    {
        listItem.innerHTML = textarea.value;
    }
    document.getElementById("my-list").appendChild(listItem);
});

