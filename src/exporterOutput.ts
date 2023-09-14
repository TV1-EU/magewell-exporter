import { MagewellStatus } from "./magewellTypes";

function addMetric(name: string, help?: string, params?: string, type: "gauge" | "histogram" | "counter" | "summary" = "gauge", value: number = 0, first: boolean = true) {
    const prefixed = "magewell_" + name;

    let str = "";

    if (help && first) {
        str += `# HELP ${prefixed} ${help}\n`;
    }
    if (first) {
        str += `# TYPE ${prefixed} ${type}\n`;
    }
    str += prefixed;
    if (params) {
        str += `{${params}}`;
    }
    str += " ";
    str += value;
    str += "\n";

    return str;
}

export default function format(data: MagewellStatus) {

    if (!data) {
        return "";
    }

    let str = "";

    str += addMetric("status", "Encoder Status", `device_name="${data["box-name"]}"`, "gauge", data["cur-status"]);
    str += addMetric("input_source", "Input Source", `device_name="${data["box-name"]}"`, "gauge", data["input-source"]);
    str += addMetric("input_device", "Input Device", `device_name="${data["box-name"]}"`, "gauge", data["input-device"]);
    str += addMetric("cpu_temperature", "CPU Temperature", `device_name="${data["box-name"]}"`, "gauge", data["cpu-temperature"]);
    str += addMetric("uptime", "Uptime", `device_name="${data["box-name"]}"`, "gauge", data.sysstat.uptime);
    str += addMetric("cpu_usage", "CPU Usage", `device_name="${data["box-name"]}"`, "gauge", data.sysstat["cpu-usage"]);
    str += addMetric("total_mem", "Memory Total", `device_name="${data["box-name"]}"`, "gauge", data.sysstat["mem-total"]);
    str += addMetric("free_mem", "Memory Free", `device_name="${data["box-name"]}"`, "gauge", data.sysstat["mem-free"]);

    ["eth", "wlan", "mobile", "rndis", "usb", "sd"].forEach(iface => {
        const rx = `${iface}-rx`
        const tx = `${iface}-tx`

        str += addMetric(iface + "_rx", "Network RX", `device_name="${data["box-name"]}",interface="${iface}"`, "gauge", data.sysstat[rx]);
        str += addMetric(iface + "_tx", "Network TX", `device_name="${data["box-name"]}",interface="${iface}"`, "gauge", data.sysstat[tx]);
    })

    str += addMetric("eth_info", "Additional information for the eth interface", `device_name="${data["box-name"]}",link_speed="${data.eth["link-speed"]}",is_dhcp="${data.eth["is-dhcp"]}",ip="${data.eth.ip}",mask="${data.eth.mask}",router="${data.eth.router}",dns="${data.eth.dns}"`, "gauge", 1);

    ["hdmi", "sdi"].forEach((input, index) => {
        const first = index === 0;
        str += addMetric("input_signal_status", "Input Signal Status", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"].status, first);
        str += addMetric("input_signal_cx", "Input Signal CX", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"].cx, first);
        str += addMetric("input_signal_cy", "Input Signal CY", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"].cy, first);
        str += addMetric("input_signal_interlaced", "Input Signal Interlaced", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"].interlaced, first);
        str += addMetric("input_signal_interlaced_scale", "Input Signal Interlaced Scale", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["interlaced-scale"], first);
        str += addMetric("input_signal_frame_rate", "Input Signal Frame Rate", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["frame-rate"], first);
        str += addMetric("input_signal_channel_valid", "Input Signal Channel Valid", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["channel-valid"], first);
        str += addMetric("input_signal_is_lpcm", "Input Signal Is LPCM", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["is-lpcm"], first);
        str += addMetric("input_signal_bits_per_sample", "Input Signal Bits Per Sample", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["bits-per-sample"], first);
        str += addMetric("input_signal_sample_rate", "Input Signal Sample Rate", `device_name="${data["box-name"]}",type="${input}"`, "gauge", data["input-signal"]["sample-rate"], first);
    });

    return str;
}