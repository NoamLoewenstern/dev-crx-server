### Run:

```bash
npx github:NoamLoewenstern/dev-crx-server
```

### Run and load variables from .env file:

- Flags required will be shown

```bash
npx github:NoamLoewenstern/dev-crx-server --loadFromEnvFile .env
```

### Run tunnel:

- Will need github/goodle register and oauth verification on first run

```bash
    ssh -R your-dev-crx-server.serveo.net:80:localhost:8001 serveo.net
```

### Env example:

```.env
SRC_EXTENSION_DIR=./my-extension-src-dir
UPDATE_URL=https://dev-crx-server.serveo.net/
PRIVATE_KEY_PATH=./key.pem
DST_DIR=./serve-crx-dir
PORT=8001
HOT_RELOAD=1
EXTENSION_ID=
COMPILE_ON_START=1
```
