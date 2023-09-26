import HttpUtils from "./httpUtils";
import { MagewellStatus } from "./magewellTypes";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const httpUtils = new HttpUtils();

const encoders: {
    ip: string;
    cookie: string[];
}[] = [];

export function init(ips: string[]) {
    ips.forEach((ip) => {
        encoders.push({ ip, cookie: [] });
    });
}

const statusURL = (deviceIP: string) => `http://${deviceIP}/usapi?method=get-status`;

export async function getData(deviceIP: string) {
    try {
        const { data } = await httpUtils.get(statusURL(deviceIP), {
            headers: {
                'Cookie': encoders.find((encoder) => encoder.ip === deviceIP)?.cookie
            }
        })

        return data as MagewellStatus;
    } catch (err) {
        console.log(err)
    }
}


export function login(deviceIP: string, userName: string, password: string) {
    httpUtils
        .get(`http://${deviceIP}/usapi?method=login&id=${userName}&pass=${password}`)
        .then(
            (loginRes: {
                statusCode: number;
                headers: {
                    "set-cookie": string[];
                };
                data: unknown;
            }) => {
                // get Cookie info
                const resCookies = loginRes["headers"]["set-cookie"];

                // add to encoders
                const encoder = encoders.find((encoder) => encoder.ip === deviceIP);
                if (!encoder) {
                    throw new Error("Encoder not found");
                }
                encoder.cookie = resCookies;

            }
        )
        .catch((err: unknown) => {
            console.info("==> response data:");
            console.log(err);
        });
}
