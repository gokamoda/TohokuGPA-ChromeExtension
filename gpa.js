function getGPA() {
  var l = document
    .getElementById("content")
    .getElementsByTagName("form")[0]
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");
  let category = null;
  gpas = {
    total: { cred: 0, point: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0},
  };
  for (let i = 0; i < l.length; i++) {
    if (l[i].className == "column_even") {
      td = l[i].getElementsByTagName("td")[0];
      if (!td.innerHTML.includes("&nbsp")) {
        text = td.getElementsByTagName("strong")[0].textContent;
        if (text.includes("全学")) {
          category = "0 一般";
        } else if (text.includes("専門")) {
          category = "1 専門";
        } else {
          category = "2 その他";
        }
      }
    } else if (l[i].className == "column_odd") {
      t = l[i].getElementsByTagName("td"); //list of tds
      /*
          t[0]: subject
          t[1]: teacher
          t[2]: mandatory/optional
          t[3]: credits
          t[4]: score
          t[5]: grade
          t[6]: year
          t[7]: Semester/Quarter
          */
      time_span = t[6].textContent + t[7].textContent.trim().substr(0, 2);
      cred = t[3].textContent;
      cred = Number(cred);
      grade = t[5].textContent.replace(/\s/g, "");
      grade = 65315 - grade.charCodeAt(0) + grade.length;
      point = grade * cred;
      if(grade<-1 || grade > 4){
        grade = 5
        point = 0
      }
      if (!isNaN(grade) && grade >= 0) {
        if (time_span in gpas) {
          gpas[time_span]["cred"] += cred;
          gpas[time_span]["point"] += point;
          gpas[time_span][grade] += cred;
        } else {
          gpas[time_span] = { cred: 0, point: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
          gpas[time_span]["cred"] += cred;
          gpas[time_span]["point"] += point;
          gpas[time_span][grade] += cred;
        }

        if (category in gpas) {
          gpas[category]["cred"] += cred;
          gpas[category]["point"] += point;
          gpas[category][grade] += cred;
        } else {
          gpas[category] = { cred: 0, point: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
          gpas[category]["cred"] += cred;
          gpas[category]["point"] += point;
          gpas[category][grade] += cred;
        }
        gpas["total"]["cred"] += cred;
        gpas["total"]["point"] += point;
        gpas["total"][grade] += cred;
      }
    }
  }
  return gpas;
}

function sortDict(dict) {
  arr = Object.keys(dict).map((k) => ({ key: k, value: dict[k] }));
  arr = arr.sort((a, b) => {
    if (a.key < b.key) return -1;
    else if (a.key > b.key) return 1;
    return 0;
  });
  return arr;
}

function getNewTd() {
  let td = document.createElement("td");
  td.setAttribute("style", "text-align:center;");
  return td;
}

function getNewTh() {
  let th = document.createElement("th");
  th.setAttribute("style", "text-align:center;");
  return th;
}

window.onload = function () {
  console.log("loaded");
  gpa_dict = getGPA();
  ordered_gpa = sortDict(gpa_dict);
  console.log(ordered_gpa);

  let table = document.createElement("table");
  table.setAttribute(
    "style",
    "margin: 10px 10px; width: 600px;table-layout:fixed; border-collapse: collapse;border: 2px solid black;"
  );
  table.setAttribute("border", 1);
  //   table.setAttribute("border", 1);

  let thead = document.createElement("thead");
  let tr = document.createElement("tr");
  let th1 = getNewTh();
  th1.innerHTML = "";
  let th2 = getNewTh();
  th2.innerHTML = "GPA";
  let th3 = getNewTh();
  th3.innerHTML = "単位数";
  let th4 = getNewTh();
  th4.innerHTML = "AA";
  let th5 = getNewTh();
  th5.innerHTML = "A";
  let th6 = getNewTh();
  th6.innerHTML = "B";
  let th7 = getNewTh();
  th7.innerHTML = "C";
  let th8 = getNewTh();
  th8.innerHTML = "D";
  let th9 = getNewTh();
  th9.innerHTML = "他";
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  tr.appendChild(th6);
  tr.appendChild(th7);
  tr.appendChild(th8);
  tr.appendChild(th9);
  thead.appendChild(tr);

  let tbody = document.createElement("tbody");

  for (let term of ordered_gpa) {
    let tr = document.createElement("tr");
    let td1 = getNewTd();
    td1.innerHTML = term["key"];
    let td2 = getNewTd();
    td2.innerHTML = (term["value"]["point"] / (term["value"]["cred"] - term["value"][5])).toFixed(3);
    let td3 = getNewTd();
    td3.innerHTML = term["value"]["cred"];
    let td4 = getNewTd();
    td4.innerHTML = term["value"][4];
    let td5 = getNewTd();
    td5.innerHTML = term["value"][3];
    let td6 = getNewTd();
    td6.innerHTML = term["value"][2];
    let td7 = getNewTd();
    td7.innerHTML = term["value"][1];
    let td8 = getNewTd();
    td8.innerHTML = term["value"][0];
    let td9 = getNewTd();
    td9.innerHTML = term["value"][5];

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  let footnote = document.createElement("p");
  footnote.setAttribute(
    "style",
    "margin: 10px 10px; width: 600px; text-align: right;"
  );
  
  footnote.innerHTML = "v1.2.1 <a href='https://twitter.com/go2oo2/status/1606868872946409472', style='color: blue'>about this tool</a>"

  document.getElementsByClassName("caption")[0].appendChild(table);
  document.getElementsByClassName("caption")[0].appendChild(footnote);
};
