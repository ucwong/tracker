```
git clone https://github.com/ucwong/tracker.git
```
```
cd tracker
```

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
```
source ~/.bashrc
```
```
nvm install --lts
```
```
npm install minimist
```
```
npm install bittorrent-tracker
```
```
./server.js --port 5008 --udp -q --interval 300000
```
