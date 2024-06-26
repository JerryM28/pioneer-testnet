# About me
pioneer testnet adalah bot untuk mempermudah transaksi multi wallet

### Install 
need node.js install
>https://nodejs.org/en/download/
```
git clone https://github.com/JerryM28/pioneer-testnet

cd pioneer-testnet

npm install

node index.js
```
### set up rpc

edit file rpc.txt
```
https://eth-sepolia.g.alchemy.com/v2/xxxx
```
ada di menu api, di akun alchemy kalian pilih eth sepolia
lalu save

### set up privateKeys

edit file privateKeys.json
```
[
    "privateKey_1"
]
```
bisa memasukan 2 private key atau lebih
```
[
    "privateKey_1",
    "privateKey_2"
]
```
lalu save

# ini bisa dijalankan aplikasi termux
>install termux via fdroid jangan yang di playstore

```
pkg install git

pkg install nodejs
or
pkg install nodejs-lts

git clone https://github.com/JerryM28/pioneer-testnet

cd pioneer-testnet

npm install

ls

```
edit file rpc.txt dan privateKeys.json

```
nano rpc.txt
```
```
nano privateKeys.json
```
isi dengan benar, jika sudah save. ctrl+x+y

jalankan script
```
node index.js
```



