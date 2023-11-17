# magewell-exporter

Prometheus exporter for Magewell AiOs.

Not all metrics are exported yet. Feel free to contribute.

This exporter was initially exclusively written for internal usage at [TV1](https://tv1.eu).

We based this upon the node implementation provided by [magewell](https://www.magewell.com/api-docs/ultra-encode-aio-api/get-start/demo-nodejs.html).

# Getting Started

Make sure you have Node 18 installed or newer

Create a .env file. Important: the passwords must be md5hashed. All variables are comma separated.

```
ENCODER_IPS=10.1.87.112,10.1.87.115
ENCODER_USERS=lxadmin,lxadmin
ENCODER_PASSS=md5hash1,md5hash2
```

Run the exporter

```
npm install
npm run build
npm run exec
```

# Notes

- On startup, the exporter logs in to all encoders to fetch the auth cookies. Subsequent requests are made with these cookies.
- CI automatically builds and pushes a docker image to gitlab.
- this repository is automatically synced to github https://github.com/TV1-EU/
