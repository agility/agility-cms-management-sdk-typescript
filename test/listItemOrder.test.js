// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient } = require("../dist");

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

async function setOrder(referenceName, contentIDs, status = 200, body = { contentIDs, itemsUpdated: contentIDs.length }) {
    requests.length = 0;
    reply = { status, body };
    return new ApiClient({ token: "test", baseUrl }).contentMethods.setContentListItemOrder(referenceName, "00000000-u", "en-us", contentIDs);
}

test("posts the content IDs, in order, to the list's item-order endpoint for the locale", async () => {
    await setOrder("footer_links", [12, 9, 15]);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "POST");
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/en-us/list/footer_links/item-order");
    assert.equal(requests[0].headers.authorization, "Bearer test");
    assert.deepEqual(JSON.parse(requests[0].raw), [12, 9, 15]);
});

test("returns the list's new order and how many items changed", async () => {
    const result = await setOrder("footer_links", [12], 200, { contentIDs: [12, 9, 15], itemsUpdated: 2 });
    assert.deepEqual(result, { contentIDs: [12, 9, 15], itemsUpdated: 2 });
});

test("encodes the reference name in the path", async () => {
    await setOrder("a b/c", [1]);
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/en-us/list/a%20b%2Fc/item-order");
});

test("a 400 throws with the status and the server's message", async () => {
    await assert.rejects(
        () => setOrder("footer_links", [1, 99], 400, "These content IDs aren't items in footer_links for locale en-us: 99."),
        (err) => {
            assert.equal(err.statusCode, 400);
            assert.match(err.message, /footer_links/);
            assert.match(err.message, /99/);
            return true;
        }
    );
});

test("a 404 for an unknown list throws with statusCode 404", async () => {
    await assert.rejects(
        () => setOrder("no_such_list", [1], 404, "Content list not found with reference name no_such_list."),
        (err) => err.statusCode === 404
    );
});
