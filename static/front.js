const Save = () => {
  alert("save");
};

async function test() {
  let response = await fetch("/test");

  if (response.ok) {
    let json = await response.json();
    alert(json);
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
}
