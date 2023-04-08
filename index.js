 // select  Elements
const form = document.querySelector('#itemForm');
const inputItem = document.querySelector('#itemInput');
const itemsList = document.querySelector('#itemList');
const filters = document.querySelectorAll('.nav-item');
const alertdiv = document.querySelector('#message');

// Create an empty item list
let todoItems  = [];

// <Step = 19>
// it is called inside the DOMcontent loader
const alertMessage = function(message, className){
 alertdiv.innerHTML = message;
 alertdiv.classList.add(className, "show");
 alertdiv.classList.remove("hide");

 setTimeout(()=>{
    alertdiv.classList.add("hide");
    alertdiv.classList.remove("show");
 }, 3000);
 return;
}


// <Step = 17>
// filter Items
const getItemsFilter = function (type){
   let filterItems = [];
   switch (type){
    case "todo":
    filterItems = todoItems.filter((item)=> !item.isDone);   // isDone == false ho wo wali
    break;
    case "done":
    filterItems = todoItems.filter((item)=> item.isDone); // isDone == true
    break;
    default:
    filterItems = todoItems;  // all items
    break;
}
// get list me jo filter ho k aye hai wo items pass krenge..
getList(filterItems);
};



// <Step = 13>
// Delete item
const removeItem = function(item){
const removeIndex = todoItems.indexOf(item);
//  splice ke use se koi item remove bhi kr sakte hai
todoItems.splice(removeIndex, 1);
}



// <step :9>
// update item
const  updateItem= function(currentItemIndex, value){
 const newItem = todoItems[currentItemIndex];
 newItem.name= value;
 todoItems.splice(currentItemIndex,1, newItem);
 setLocalStorage(todoItems);
};



// <step=5>
// here we are handaling events #Done #Edit  #Delete
const handleItem =function(itemData){

 const items= document.querySelectorAll(".list-group-item");
 items.forEach((item)=>{
    if(item.querySelector('.title').getAttribute('data-time')==itemData.addedAt){
//    done
//<step:6>
        item.querySelector('[data-done]').addEventListener('click', function(e){
            e.preventDefault();
            // alert("hello i am HandlerItem");
            const  itemIndex = todoItems.indexOf(itemData);
            const currentItem = todoItems[itemIndex];

    // for toggale use
           const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";  
    
           currentItem.isDone = currentItem.isDone ? false : true;
            todoItems.splice(itemIndex,1, currentItem);
            setLocalStorage(todoItems);

    // for toggale use
            const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
        
    // toggle create kiya hai 
        this.firstElementChild.classList.replace( currentClass, iconClass );
        
    // <Step = 18>
    // this we have added 4 instance change in the list when we select than it change imidiatly   FROM : todo to COMPLETED
        const filterType = document.querySelector("#tabValue").value;
        getItemsFilter(filterType);
        });
// ===========================
        // Edit   <step : 7>
        item.querySelector("[data-edit]").addEventListener("click", function (e) {
           e.preventDefault();
           inputItem.value = itemData.name;
           document.querySelector('#objIndex').value = todoItems.indexOf(itemData);
        });
// =========================
                                                              //   DELETE   <Step = 12>
item.querySelector("[data-delete]").addEventListener("click", function (e) {
    e.preventDefault();
    if(confirm("Are You Sure Want to remove this item")){
        itemsList.removeChild(item);

//  storage se remove krne ke liye 
            removeItem(item);
                                                            //    <Step=14>
//  remove krnwe k baad me todoItems ko  LocalStorage me set krwa dena hai 
          setLocalStorage(todoItems);
//  remove krne ka matlab hume isko apni list me bhi nhi rakha ,, and todo List me filter krwa ke remove kr diya hai..... <Step =15>
          return todoItems.filter((item) => item != itemData);
        }
 });

   }
 });
};


// <step = 4>
// jaise hi humare DOM content load , turant baad getItemLocalStorage call ho jayega  or jaise hi wo call hoga..
// agr array me kuch nhi hoga toh ("todoItems") wala array empty hi rahega. and agr local me kuch hai toh ..
// jaise hi humara DOMcontent load hota hai toh hi sabse pahle humare records aa jayege
// yaha hum wo hi kra rahe hai jaise hi humara DOM content load hota hai tab hi hume DOM content load krwana hai...
// jaise getLocalStorage call hoga .. usi ke turant baad hi hum GetList wale mathod ko call krwa lena hai..
const getList = function(todoItems){
    itemsList.innerHTML = "";
    if(todoItems.length > 0){
         todoItems.forEach((item) =>{
            const iconClass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle";
           itemsList.insertAdjacentHTML("beforeend", `<li class="list-group-item  d-flex justify-content-between align-item-center">
           <span class="title"  data-time="${item.addedAt}">${item.name}</span>
           <span>
               <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
               <a href="#" data-edit><i class="bi bi-pencil-square  blue"></i></a>
               <a href="#" data-delete><i class="bi bi-trash3 red" ></i></i></a>
           </span>
       </li>`
         );
         handleItem(item);
      });
    } else{
        itemsList.insertAdjacentHTML("beforeend", `<li class="list-group-item  d-flex justify-content-between align-item-center">
           <span>No Record Found..</span>
           </li>`);
    }
};


// <step=3>
// get localStorage from page
const getLocalStorage = function(){
    const todoStorage = localStorage.getItem("todoItems");
    if(todoStorage === "undefined" || todoStorage ===null){
        todoItems =[];
    }else{
        todoItems = JSON.parse(todoStorage);
    }
   console.log("items", todoItems);
     
   getList(todoItems);
};


// <step=2>
// Set in Local Storage
const setLocalStorage =function(todoItems){
localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// <step=1>
// form submit wala Event add krna hai
// or wo event kab hoga jab Document load ho jayega tab
document.addEventListener('DOMContentLoaded', ()=>{
    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if(itemName.length === 0){
            alertMessage("Please  Enter Name.","alert-danger");
        }else{
                                                                    // <Step : 8>
             const currentItemIndex = document.querySelector("#objIndex").value;
          if(currentItemIndex){
        //  update
              updateItem(currentItemIndex,  itemName);
              document.querySelector("#objIndex").value = "";
              alertMessage("New Item has been updated", "alert-success");    
            }else{
              const itemObj = {
              name : itemName,
              isDone:false,
              addedAt:new Date().getTime(),
              };         
              todoItems.push(itemObj);  
              setLocalStorage(todoItems);
              alertMessage("New Item has been Added", "alert-success");   
       }
    //    <Step =10>
       getList(todoItems);     
    }
    //    <Step =11>
    // ye is liye takki input area dubara se blank ho jaye, Edit krne k baad
    inputItem.value="";
});
// filter  tabs
// <step= 16>
filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      const tabType = this.getAttribute("data-type");
// active class ko remove krnege jo nav-link me hai html me usko waha se remove krwayege or new wale pe paste krwayenge 
     document.querySelectorAll(".nav-link").forEach((nav) =>{
       nav.classList.remove("active");
     });
// jispe  bhi hum click krenge uspe active class add ho jayegi
     this.firstElementChild.classList.add("active");
     getItemsFilter(tabType);
     document.querySelector('#tabValue').value = tabType
    });
});


    // local storage se pahle hum retrive kr ke le ayega ,, 
    // yaha is liye call kiya hai is method ko, k jaise hi humara DOM content load hota hain tabhi sabhi records aa jayenge...
    getLocalStorage();
});