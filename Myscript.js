let button = document.getElementById("my-button");
button.addEventListener("click", function()
{
    console.log("Hello world");
   document.getElementById("text").textContent = "Hello World";
   document.getElementById("title").innerHTML = "Moi Maalima";
});

let mybutton = document.getElementById("add-data");
let textarea = document.getElementById("my-textarea");
mybutton.addEventListener("click", function()
{
    let listItem = document.createElement("li");
    if (textarea.value.trim() === "") 
        {
            listItem.innerHTML = "Hello world";
        }
    
    else
    {
        listItem.innerHTML = textarea.value;
    }
    document.getElementById("my-list").appendChild(listItem);
});

