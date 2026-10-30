// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient, MAX_URL_REDIRECTIONS_PER_REQUEST } = require("../dist");

let server;
let baseUrl;
const requests = [];
// The status and body the stub answers the next request with.
let reply = { status: 200, body: {} };

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            requests.push({ method: req.method, url: req.url, headers: req.headers, raw });
            res.writeHead(reply.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reply.body));
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

async function deleteRedirections(ids, status = 200, body = { deleted: ids, notFound: [] }) {
    requests.length = 0;
    reply = { status, body };
    return new ApiClient({ token: "test", baseUrl }).urlRedirectionMethods.deleteUrlRedirections("00000000-u", ids);
}

test("deleteUrlRedirections sends one DELETE with the ids and the token", async () => {
    await deleteRedirections([12, 13, 14]);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "DELETE");
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/url-redirections?ids=12,13,14");
    assert.equal(requests[0].headers.authorization, "Bearer test");
});

test("deleteUrlRedirections returns what was deleted and what was not found", async () => {
    const result = await deleteRedirections([12, 99], 200, { deleted: [12], notFound: [99] });
    assert.deepEqual(result, { deleted: [12], notFound: [99] });
});

test("deleteUrlRedirections tolerates a response without one of the lists", async () => {
    const result = await deleteRedirections([12], 200, { deleted: [12] });
    assert.deepEqual(result, { deleted: [12], notFound: [] });
});

test("deleteUrlRedirections rejects an empty list without a request", async () => {
    await assert.rejects(deleteRedirections([]), /At least one URL redirection ID is required\./);
    assert.equal(requests.length, 0);
});

test("deleteUrlRedirections rejects more than the per-request limit without a request", async () => {
    const ids = Array.from({ length: MAX_URL_REDIRECTIONS_PER_REQUEST + 1 }, (_, i) => i + 1);
    await assert.rejects(deleteRedirections(ids), /Cannot delete more than 250 URL redirections at a time \(got 251\)\./);
    assert.equal(requests.length, 0);
});

test("deleteUrlRedirections surfaces the server's status and message", async () => {
    await assert.rejects(deleteRedirections([12], 400, { message: "Invalid redirection ID 'x'." }), (err) => {
        assert.ok(err instanceof Error);
        assert.equal(err.statusCode, 400);
        assert.deepEqual(err.responseData, { message: "Invalid redirection ID 'x'." });
        assert.match(err.message, /Unable to delete the URL redirections\. \(HTTP 400\): Invalid redirection ID/);
        return true;
    });
});
