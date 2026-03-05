let total = 0;

function goToMenu() {
  let table = document.getElementById("tableNo").value;
  if (table === "") {
    alert("Enter table number");
    return;
  }
  document.getElementById("showTable").innerText = table;
  document.getElementById("tablePage").classList.add("hidden");
  document.getElementById("menuPage").classList.remove("hidden");
}

function addItem(price) {
  total += price;
  document.getElementById("total").innerText = total;
}

function removeItem(price) {
  if (total >= price) {
    total -= price;
    document.getElementById("total").innerText = total;
  }
}

function filterItems(type) {
  let items = document.querySelectorAll(".item");
  items.forEach(item => {
    if (type === "all") {
      item.style.display = "block";
    } else if (item.classList.contains(type)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}