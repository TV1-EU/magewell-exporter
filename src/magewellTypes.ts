export interface MagewellStatus {
    result: number;
    "cur-status": number;
    "last-rec-status": number;
    "last-rec-status2": number;
    "cur-time": Date;
    "box-name": string;
    "input-source": number;
    "input-device": number;
    "cpu-temperature": number;
    "enable-multi-protocol": number;
    "enable-ndi-hx3": number;
    web: Web;
    "3d-output": The3DOutput;
    codec: Codec;
    sysstat: { [key: string]: number };
    "ndi-tally": NdiTally;
    "live-status": LiveStatus;
    "upgrade-status": UpgradeStatus;
    "enable-auto-rec": number;
    "rec-status": RecStatus;
    "format-status": FormatStatus;
    "disk-test": DiskTest;
    nas: any[];
    "living-test": LivingTest;
    "check-upgrade": CheckUpgrade;
    "conn-wifi": ConnWifi;
    "send-file-test": SendFileTest;
    "send-file": SendFile;
    "input-signal": InputSignal;
    "disk-info": DiskInfo[];
    wifi: Softap;
    softap: Softap;
    eth: Eth;
    mobile: Mobile;
    rndis: Rndis;
    upgrade: Grade;
    downgrade: Grade;
    "message-infos": any[];
    "message-warns": any[];
    "message-errors": any[];
    "channel-count": number;
    vumeters: number[];
}

export interface The3DOutput {
    result: number;
}

export interface CheckUpgrade {
    result: number;
    "client-id": string;
}

export interface Codec {
    "main-stream": { [key: string]: number };
    "sub-stream": { [key: string]: number };
    audio: Audio;
}

export interface Audio {
    channels: number;
    kbps: number;
    "cur-bps": number;
    "i-frame-count": number;
    "o-frame-count": number;
}

export interface ConnWifi {
    name: string;
    result: number;
    "client-id": string;
}

export interface DiskInfo {
    "disk-status": number;
    "disk-type": number;
    "total-size": number;
    "used-size": number;
    "free-size": number;
    "resv-size": number;
    "block-size": number;
    usage: number;
    "sys-path": string;
    "fs-type": string;
    "mount-path": string;
    "fs-label": string;
    "write-bps": number;
    "read-bps": number;
    "free-sec": number;
    "file-count": number;
    "beign-time": string;
    "end-time": string;
    "total-cache-time": number;
    id: number;
    "rec-mode": number;
    "stream-idx": number;
    "conn-state"?: number;
}

export interface DiskTest {
    type: number;
    "read-bps": number;
    "write-bps": number;
    percent: number;
    result: number;
    "client-id": string;
}

export interface Grade {
    ver: string;
    date: string;
    "size-byte": number;
    info: any[];
}

export interface Eth {
    "link-speed": number;
    "is-dhcp": number;
    ip: string;
    mask: string;
    router: string;
    dns: string;
}

export interface FormatStatus {
    type: number;
    percent: number;
    result: number;
    "client-id": string;
}

export interface InputSignal {
    status: number;
    cx: number;
    cy: number;
    interlaced: number;
    "interlaced-scale": number;
    "frame-rate": number;
    "channel-valid": number;
    "is-lpcm": number;
    "bits-per-sample": number;
    "sample-rate": number;
    hdmi?: InputSignal;
    sdi?: InputSignal;
}

export interface LiveStatus {
    result: number;
    "run-ms": number;
    live: Live[];
}

export interface Live {
    id: number;
    type: number;
    "is-use": number;
    "is-skd-runnung": number;
    name: string;
    "run-ms": number;
    result: number;
    "stream-index": number;
    "rrt-ms": number;
    "pkt-sent-total": number;
    "pkt-loss-total": number;
    "pkt-retrans-total": number;
    "buf-ms": number;
    "inst-bps": number;
    net: number;
    "ip-addr": string;
    port: number;
    "video-frame-count": number;
    "audio-frame-count": number;
    "last-video-pts": number;
    "last-audio-pts": number;
}

export interface LivingTest {
    id: number;
    "upload-bps": number;
    percent: number;
    result: number;
    net: number;
    "client-id": string;
}

export interface Mobile {
    ip: string;
    mask: string;
    router: string;
    dns: string;
}

export interface NdiTally {
    id: number;
    "on-preview": boolean;
    "on-program": boolean;
}

export interface RecStatus {
    result: number;
    "run-ms": number;
    rec: any[];
}

export interface Rndis {
    "link-state": number;
    "link-speed": number;
    ip: string;
    mask: string;
}

export interface SendFile {
    "total-count-ongoing": number;
    "total-count-done": number;
    "disk-type": number;
    name: string;
    result: number;
    message: string;
    "left-time": number;
    percent: number;
}

export interface SendFileTest {
    result: number;
    "client-id": string;
    id: number;
}

export interface Softap {
    name: string;
    level: number;
    ip: string;
    mask: string;
    router: string;
    dns: string;
    "is-dhcp"?: number;
}

export interface UpgradeStatus {
    step: number;
    percent: number;
    result: number;
    "client-id": string;
    mode: string;
}

export interface Web {
    "is-http": number;
    "http-port": number;
    "is-https": number;
    "https-port": number;
    "is-cert-valid": number;
    "is-cert-key-valid": number;
    theme: number;
}
