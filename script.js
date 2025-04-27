const CLIENT_ID = '752750464212-9846882gui0ok3l7msbn6g7506nt68c2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDNdSllJiBSOe8WJ-5kgzzs3OGtSxPSXHQ';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
let tokenClient;

const guruData = {
  "PENGAKAP": ["CIKGU SUHAILA ABDUL HALIP", "CIKGU MOHAMMAD HAFIZ SHAMSUDDIN", "CIKGU ZUBAIR KASSIM", "CIKGU YASMIN HUZAIMAH ALADDIN", "CIKGU MASZURA HASIM", "CIKGU HAMSIAH RAPAEE", "CIKGU WATI AHMAD"],
  "TKRS": ["CIKGU MOHAMAD NORIZAN MOHAMMAD", "CIKGU EDI HARIANTO SUYADI", "CIKGU DAUD AHMAD", "CIKGU MOHAMMAD NAJRI HAN", "USTAZ MUHAMMAD KHUSAIRI SENAN"],
  "PPIM": ["USTAZAH LAILA SYAFINAZ HASSAN", "USTAZAH IZZATI BAHIYAH SALIM", "CIKGU NURHASHIMAH NABILA ABDULLAH", "CIKGU MIMUT KHAIRIYAH KONGLI", "USTAZAH NORHIDAYATI WAHAB", "USTAZAH AZREEN KAMARUDIN", "USTAZAH SITI ZULAIKHA HJ TEMRIN"],
  "BSMM": ["CIKGU KHAIRUL NIZAM RAJALI", "CIKGU KHAIRUL NISA MOHAMMAD BASERI", "CIKGU SITI AISHAH MUHALADDIN", "CIKGU ARZURRA ZAINUDDIN", "CIKGU NURUL SYUHADA ABDUL MUTALIF"],
  "KELAB BAHASA MELAYU": ["CIKGU DAUD AHMAD", "CIKGU WATI AHMAD", "CIKGU HAMSIAH RAPAEE", "CIKGU MIMUT KHAIRIYAH KONGLI"],
  "KELAB BAHASA INGGERIS": ["CIKGU MASZURA HASIM", "CIKGU ZUBAIR KASSIM", "CIKGU EDI HARIANTO SUYADI"],
  "KELAB STEM": ["CIKGU NURHASHIMAH NABILA ABDULLAH", "CIKGU SUHAILA ABDUL HALIP", "USTAZAH LAILA SYAFINAZ HASSAN", "CIKGU SUZIE ABDULLAH"],
  "KELAB PENCINTA ALAM": ["CIKGU MOHAMMAD NAJRI HAN", "CIKGU HALUYAH HOP", "CIKGU MOHAMAD NORIZAN MOHAMMAD", "CIKGU NURUL SYUHADA ABDUL MUTALIF", "PUAN KEMUTING AYONG"],
  "KELAB SENI DAN KEBUDAYAAN": ["CIKGU WATI AHMAD", "CIKGU KHAIRUL NIZAM RAJALI", "CIKGU YASMIN HUZAIMAH ALADDIN", "CIKGU KHAIRUL NISA MOHAMMAD BASERI", "PUAN NOREETA ANAK MANDAU", "PUAN HAJIBAH SALLEH", "PUAN AINI DAMIT"],
  "KELAB PENDIDIKAN ISLAM": ["USTAZ MUHAMMAD KHUSAIRI SENAN", "USTAZAH NORHIDAYATI WAHAB", "USTAZAH AZREEN KAMARUDIN", "USTAZAH SITI ZULAIKHA HJ TEMRIN"],
  "KELAB SPBT": ["CIKGU ARZURRA ZAINUDDIN", "CIKGU SITI AISHAH MUHALADDIN", "CIKGU MOHAMMAD HAFIZ SHAMSUDDIN", "USTAZAH IZZATI BAHIYAH SALIM"],
  "BOLA SEPAK": ["CIKGU ZUBAIR KASSIM", "CIKGU MOHAMMAD NAJRI HAN", "CIKGU ABDUL JALIL SAIM"],
  "HOKI": ["CIKGU DAUD AHMAD", "CIKGU MOHAMMAD HAFIZ SHAMSUDDIN", "CIKGU MASZURA HASIM", "USTAZAH NORHIDAYATI WAHAB"],
  "BOLA JARING": ["USTAZAH AZREEN KAMARUDIN", "USTAZAH LAILA SYAFINAZ HASSAN", "CIKGU WATI AHMAD", "CIKGU MIMUT KHAIRIYAH KONGLI", "CIKGU HALUYAH HOP", "USTAZAH IZZATI BAHIYAH SALIM"],
  "OLAHRAGA": ["CIKGU KHAIRUL NIZAM RAJALI", "CIKGU ARZURRA ZAINUDDIN", "CIKGU NURUL SYUHADA ABDUL MUTALIF", "USTAZAH SITI ZULAIKHA HJ TEMRIN"],
  "MEMANAH": ["CIKGU HAMSIAH RAPAEE", "CIKGU YASMIN HUZAIMAH ALADDIN", "CIKGU NURUL SYUHADA ABDUL MUTALIF", "CIKGU EDI HARIANTO SUYADI"],
  "PINGPONG": ["CIKGU MOHAMAD NORIZAN MOHAMMAD", "USTAZ MUHAMMAD KHUSAIRI SENAN", "CIKGU SUHAILA ABDUL HALIP", "CIKGU SITI AISHAH MUHALADDIN"]
};

function updateGuru() {
  const organisasi = document.getElementById('organisasi').value;
  const guruField = document.getElementById('guru');
  guruField.value = guruData[organisasi]?.join('\n') || '';
}

function autoBullet(el) {
  if (el.value.slice(-1) === '\n') {
    el.value += '• ';
  }
}

function tambah() {
  alert('Tambah laporan baru.');
}

function padam() {
  if (confirm('Padam laporan ini?')) {
    document.getElementById('laporan').reset();
  }
}

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  });
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '',
  });
}

function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) throw (resp);
    alert('Login Google Berjaya!');
  };
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

async function uploadToDrive() {
  const laporanElement = document.getElementById('laporan');

  const opt = {
    margin: 0.5,
    filename: 'Laporan_Kokurikulum.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const pdfBlob = await html2pdf().set(opt).from(laporanElement).outputPdf('blob');

  const metadata = {
    name: 'Laporan_Kokurikulum.pdf',
    mimeType: 'application/pdf'
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', pdfBlob);

  const accessToken = gapi.client.getToken().access_token;

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form,
  }).then((res) => res.json())
    .then(function(val) {
      alert('Fail berjaya dihantar ke Google Drive! ID: ' + val.id);
    }).catch((err) => {
      console.error(err);
      alert('Gagal upload ke Google Drive.');
    });
}

window.onload = function() {
  gapiLoaded();
  gisLoaded();
};
