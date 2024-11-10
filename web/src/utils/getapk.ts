'use client';

export default function getAPK() {
  const apkUrl = '/client.apk';
  const fileName = 'area.apk';
  const a = document.createElement('a');

  a.style.display = 'none';
  a.href = apkUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
