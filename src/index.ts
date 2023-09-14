import "dotenv/config";
import http from "http";
import { getData, init, login } from "./encoders";
import format from "./exporterOutput";

const deviceIPs = process.env.ENCODER_IPS?.split(",") as string[];
const userNames = process.env.ENCODER_USERS?.split(",") as string[];
const passwords = process.env.ENCODER_PASSS?.split(",") as string[];

if (deviceIPs.length !== userNames.length || deviceIPs.length !== passwords.length) {
    throw new Error("ENV variables ENCODER_IPS, ENCODER_USERS and ENCODER_PASSS must have the same number of elements");
}

const zip = <T>(arr: T[], ...arrs: T[][]): T[][] => {
    return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
};

zip(deviceIPs, userNames, passwords).forEach(
    ([deviceIP, userName, password]: string[]) => {
        login(deviceIP, userName, password);
    }
);

init(deviceIPs);

// start metrics endpoint
const server = http.createServer();

server.on("request", async (request, res) => {

    const url = new URL(request.url || "", `http://${request.headers.host}`);

    if (url.pathname === "/metrics") {
        // get probe parameter
        const probe = url.searchParams.get("probe");

        if (!probe) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write("Bad Request");
            res.end();
            return;
        }

        const data = await getData(probe || "");

        // send data to client
        res.writeHead(200, { "Content-Type": "text/plain" });

        const formatted = format(data);

        res.write(formatted);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Not Found");
    }
    res.end();
});

const port = process.env.PORT || 8483;
console.log("Server running on port " + port);
server.listen(port);
