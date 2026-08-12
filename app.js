// ===============================
// JSON 読み込み（GitHub Pages対応）
// ===============================
let rowData = [];

fetch("./output/latest.json")
  .then((res) => res.json())
  .then((data) => {
    rowData = data;
    initGrid();
    initFilters();
  })
  .catch((err) => {
    console.error("JSON 読み込みエラー:", err);
  });

// ===============================
// AG Grid の列定義
// ===============================
const columnDefs = [
  { field: "エリア", filter: true, width: 120 },
  { field: "店舗名", filter: true, width: 120 },
  { field: "実施月日", filter: true, width: 120 },
  { field: "曜日", width: 80 },
  { field: "開始時間", width: 100 },
  { field: "終了時間", width: 100 },
  { field: "実施時間", width: 100 },
  { field: "レッスン名", filter: true, width: 160 },
  { field: "映像", width: 80 },
  { field: "インストラクター", filter: true, width: 140 },
  {
    field: "空き",
    width: 90,
    cellStyle: (params) => {
      return params.value
        ? { backgroundColor: "#d4f7d4" }
        : { backgroundColor: "#f7d4d4" };
    },
  },
];

// ===============================
// AG Grid 初期化
// ===============================
function initGrid() {
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
    },
    animateRows: true,
  };

  const gridDiv = document.querySelector("#gridContainer");
  new agGrid.Grid(gridDiv, gridOptions);

  window.gridOptions = gridOptions;
}

// ===============================
// フィルタバー初期化
// ===============================
function initFilters() {
  const areaSelect = document.getElementById("filterArea");
  const storeSelect = document.getElementById("filterStore");
  const programSelect = document.getElementById("filterProgram");
  const instructorSelect = document.getElementById("filterInstructor");
  const videoSelect = document.getElementById("filterVideo");
  const availableSelect = document.getElementById("filterAvailable");

  // 店舗一覧
  const stores = [...new Set(rowData.map((r) => r["店舗名"]))].sort();
  stores.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    storeSelect.appendChild(opt);
  });

  // プログラム一覧
  const programs = [...new Set(rowData.map((r) => r["レッスン名"]))].sort();
  programs.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    programSelect.appendChild(opt);
  });

  // インストラクター一覧
  const instructors = [...new Set(rowData.map((r) => r["インストラクター"]))].sort();
  instructors.forEach((i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    instructorSelect.appendChild(opt);
  });

  areaSelect.onchange =
    storeSelect.onchange =
    programSelect.onchange =
    instructorSelect.onchange =
    videoSelect.onchange =
    availableSelect.onchange =
      applyFilters;
}

// ===============================
// フィルタ適用
// ===============================
function applyFilters() {
  const area = document.getElementById("filterArea").value;
  const store = document.getElementById("filterStore").value;
  const program = document.getElementById("filterProgram").value;
  const instructor = document.getElementById("filterInstructor").value;
  const video = document.getElementById("filterVideo").value;
  const available = document.getElementById("filterAvailable").value;

  const filtered = rowData.filter((r) => {
    if (area && r["エリア"] !== area) return false;
    if (store && r["店舗名"] !== store) return false;
    if (program && r["レッスン名"] !== program) return false;
    if (instructor && r["インストラクター"] !== instructor) return false;
    if (video && String(r["映像"]) !== video) return false;
    if (available && String(r["空き"]) !== available) return false;
    return true;
  });

  window.gridOptions.api.setRowData(filtered);
}
