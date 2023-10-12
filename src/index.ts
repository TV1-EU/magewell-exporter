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

const loginAll = () => {

    init(deviceIPs);

    zip(deviceIPs, userNames, passwords).forEach(
        ([deviceIP, userName, password]: string[]) => {
            console.log(`Logging in to ${deviceIP}`)
            login(deviceIP, userName, password);
        }
    );
}

loginAll();

// execute loginAll every 6hr
setInterval(loginAll, 6 * 60 * 60 * 1000);

// start metrics endpoint
const server = http.createServer();

server.on("request", async (request, res) => {

    const url = new URL(request.url || "", `http://${request.headers.host}`);

    if (url.pathname === "/probe") {
        // get probe parameter
        const probe = url.searchParams.get("target");

        if (!probe) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write("Bad Request");
            res.end();
            return;
        }

        const data = await getData(probe || "");

        if (!data) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Not Accessible");
            res.end();
            return;
        }

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
console.log("Server running on http://localhost:" + port);
server.listen(port);
