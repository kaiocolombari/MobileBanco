import client from "./client";

export const requestTransacao = async () => {
    const response = await client.get("/transacao");
    return response;
};