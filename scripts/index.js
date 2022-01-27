// Get sidebar
var sidebarList = document.getElementById("sidebarList");
// Get items in sidebar
var sidebarListItems = sidebarList.getElementsByClassName("sidebarListItem");
// Loop through items, add active class to the current/clicked item
for (var i = 0; i < sidebarListItems.length; i++) {
    sidebarListItems[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        // Add active class to the current/clicked item
        this.className += " active";
    });
}

//**********//