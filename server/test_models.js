async function run() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDW1l6676w4uTjtteay7pDrNt9U82Mm85Q';
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      data.models.forEach(model => console.log(model.name));
    } else {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
