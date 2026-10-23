# REACTORIA — Open-World RPG 3D

Permainan pembelajaran Sains Tingkatan 5, Bab 4: Kadar Tindak Balas. Prototaip 3D boleh dimainkan dengan lima misi, soalan kuiz, simulasi maya ilustratif, XP, peta mini dan simpanan progres dalam pelayar.

## Struktur
- `index.html` — laman permainan
- `style.css` — reka bentuk dan responsif
- `main.js` — dunia 3D, kawalan dan misi
- `.nojekyll` — keserasian GitHub Pages

## Terbit di GitHub Pages
1. Cipta repository GitHub baharu, contohnya `reactoria-rpg`.
2. Muat naik **kandungan folder ini** ke root repository (pastikan `index.html` di root), kemudian commit.
3. Buka **Settings → Pages → Build and deployment**.
4. Pilih **Deploy from a branch**, branch `main`, folder `/(root)` dan **Save**.
5. Tunggu penerbitan, kemudian buka URL GitHub Pages yang dipaparkan.

Permainan memerlukan internet untuk memuatkan pustaka Three.js daripada CDN. Simulasi bukan eksperimen makmal sebenar; semua data masa adalah ilustratif. Progres disimpan setempat menggunakan localStorage, bukan dihantar kepada guru. Tiada pangkalan data atau papan pemuka guru dalam versi ini.

## Kawalan
WASD/anak panah: bergerak; Q/R: putar kamera; E: interaksi. Pada telefon gunakan D-pad dan butang interaksi.
